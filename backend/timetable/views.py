import datetime

from django.db import transaction

# Create your views here.
from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError
from timetable.serializers import PeriodSerializer, MasterLessonSerializer, LessonSerializer
from timetable.models import Period, MasterLesson, Lesson

from timetable.serializers import MasterLessonCreateSerializer, PeriodCreateSerializer, \
    LessonCreateSerializer, LessonWithPermissionSerializer
from utils.viewsets import SerializerByActionMixin

from timetable.utils import _convert_str_to_time

from users.models import User

from schools.models import Discipline


class PeriodView(SerializerByActionMixin, ModelViewSet):
    serializer_by_action = {
        'default': PeriodSerializer,
        'create': PeriodCreateSerializer,
        'update': PeriodCreateSerializer,
    }
    queryset = Period.objects.all()

    def get_queryset(self):
        grade_id = self.request.query_params.get('grade')
        queryset = super().get_queryset()  # todo фильтровать по правам пользователей
        if self.action == 'list':
            if grade_id is not None:
                queryset = queryset.filter(grade_id=grade_id)
            else:
                queryset = queryset.none()
        return queryset


class MasterLessonView(SerializerByActionMixin, ModelViewSet):
    serializer_by_action = {
        'default': MasterLessonSerializer,
        'create': MasterLessonCreateSerializer,
        'update': MasterLessonCreateSerializer,
    }
    queryset = MasterLesson.objects.all()

    def get_queryset(self):
        period_id = self.request.query_params.get('period')
        queryset = super().get_queryset()  # todo фильтровать по правам пользователей
        if self.action == 'list':
            if period_id is not None:
                queryset = queryset.filter(period_id=period_id)
            else:
                queryset = queryset.none()
        return queryset

    def perform_create(self, serializer):
        with transaction.atomic():
            master_lesson = serializer.save()
            self.create_related_lessons(master_lesson)

    def perform_update(self, serializer):
        with transaction.atomic():
            old_master_lesson = MasterLesson.objects.filter(id=serializer.instance.id).first()
            old_students_list = [student_id for student_id in old_master_lesson.students.values_list('id', flat=True)]
            master_lesson = serializer.save()
            self.update_related_lessons(master_lesson, old_master_lesson, old_students_list)

    def create_related_lessons(self, master_lesson):
        period_start_date = master_lesson.period.start_date
        period_end_date = master_lesson.period.end_date
        current_date = period_start_date

        day_of_week_map = {
            'Monday': 0,
            'Tuesday': 1,
            'Wednesday': 2,
            'Thursday': 3,
            'Friday': 4,
            'Saturday': 5,
            'Sunday': 6,
        }

        day_of_week_number = day_of_week_map[master_lesson.day_of_week]
        days_to_add = (day_of_week_number - current_date.weekday()) % 7
        current_date += datetime.timedelta(days=days_to_add)
        lessons = []
        start_time = _convert_str_to_time(master_lesson.start_time)
        while current_date <= period_end_date:
            start_datetime = datetime.datetime.combine(current_date, start_time)
            lessons.append(Lesson(
                title=master_lesson.title,
                lesson_link=master_lesson.lesson_link,
                discipline=master_lesson.discipline,
                grade=master_lesson.grade,
                start_time=start_datetime,
                end_time=start_datetime + datetime.timedelta(minutes=master_lesson.duration),
                lesson_template=master_lesson
            ))
            current_date += datetime.timedelta(days=7)
        created_lessons = Lesson.objects.bulk_create(lessons)
        lesson_students_model = Lesson.students.through
        lesson_student_relations = [
            lesson_students_model(user_id=student_id, lesson_id=lesson.id)
            for lesson in created_lessons
            for student_id in master_lesson.students.values_list('id', flat=True)
        ]
        lesson_students_model.objects.bulk_create(lesson_student_relations)

    def update_related_lessons(self, master_lesson, old_master_lesson, old_students_list):
        lesson_queryset = Lesson.objects.filter(lesson_template=master_lesson, end_time__gte=timezone.now())
        changes = {}
        if old_master_lesson.title != master_lesson.title:
            changes['title'] = master_lesson.title

        if old_master_lesson.lesson_link != master_lesson.lesson_link:
            changes['lesson_link'] = master_lesson.lesson_link

        if old_master_lesson.discipline != master_lesson.discipline:
            changes['discipline'] = master_lesson.discipline
        if changes:
            lesson_queryset.update(**changes)

        old_start_time = _convert_str_to_time(old_master_lesson.start_time)
        new_start_time = _convert_str_to_time(master_lesson.start_time)
        if old_start_time != new_start_time or old_master_lesson.duration != master_lesson.duration:
            for lesson in lesson_queryset:
                new_start_datetime = datetime.datetime.combine(lesson.start_time.date(), new_start_time)
                new_end_datetime = new_start_datetime + datetime.timedelta(minutes=master_lesson.duration)
                Lesson.objects.filter(pk=lesson.pk).update(
                    start_time=new_start_datetime,
                    end_time=new_end_datetime
                )

        if master_lesson.students.values_list('id') != old_students_list:
            lesson_students_model = Lesson.students.through
            lesson_students_model.objects.filter(lesson__in=lesson_queryset).delete()
            lesson_student_relations = [
                lesson_students_model(user_id=student_id, lesson_id=lesson.id)
                for lesson in lesson_queryset
                for student_id in master_lesson.students.values_list('id', flat=True)
            ]
            lesson_students_model.objects.bulk_create(lesson_student_relations)


class LessonView(SerializerByActionMixin, ModelViewSet):
    serializer_by_action = {
        'default': LessonSerializer,
        'retrieve': LessonWithPermissionSerializer,
        'create': LessonCreateSerializer,
        'update': LessonCreateSerializer,
    }
    queryset = Lesson.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        start_date_param = self.request.query_params.get('start_date', None)
        grade_param = self.request.query_params.get('grade', None)
        user_param = self.request.query_params.get('user', None)
        if start_date_param:
            try:
                start_date = parse_date(start_date_param)
                if not start_date:
                    raise ValueError
                start_range = datetime.datetime.combine(start_date, datetime.datetime.min.time()) - datetime.timedelta(days=7)
                end_range = datetime.datetime.combine(start_date, datetime.datetime.min.time()) + datetime.timedelta(days=15)
                queryset = queryset.filter(start_time__gte=start_range, start_time__lte=end_range)
            except (ValueError, TypeError):
                raise ValidationError({'start_date': 'Invalid date format. Expected format: YYYY-MM-DD.'})
        if grade_param:
            queryset = queryset.filter(grade=grade_param)
        if user_param:
            user = User.objects.filter(id=user_param).first()
            if user and user.type == User.TEACHER:
                disciplines = Discipline.objects.filter(teacher=user)
                queryset = queryset.filter(discipline__in=disciplines)
            elif user and user.type == User.STUDENT:
                queryset = queryset.filter(students__in=[user])
            else:
                queryset = queryset.none()
        return queryset
