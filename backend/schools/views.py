
# Create your views here.
from django.utils import timezone
from rest_framework.filters import SearchFilter
from rest_framework.mixins import ListModelMixin
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from schools.serializers import GradeSerializer, DisciplineSerializer, GradeCreateSerializer, \
    DisciplineCreateSerializer, SchoolSerializer, SchoolDetailSerializer, SchoolUpsertSerializer, \
    SchoolDetailWithPermissionSerializer, SchoolWithPermissionSerializer, GradeWithPermissionSerializer
from schools.models import School, Grade, Discipline
from users.models import User

from utils.viewsets import SerializerByActionMixin

from schools.utils import SimpleGradeSerializer

from schools.permissions import IsTeacherAndCanEditSchool, IsTeacherAndCanDeleteSchool, \
    IsTeacherAndCanEditGrade, IsTeacherAndCanDeleteGrade, IsTeacherAndCanCreateGrade
from timetable.models import Lesson, MasterLesson


# tested
from schools.utils import get_schools_for_teacher, get_schools_for_tutor, get_schools_for_student, \
    get_schools_for_parent, get_grades_for_teacher, get_grades_for_tutor, get_grades_for_student, \
    get_grades_for_parent


class SchoolView(SerializerByActionMixin, ModelViewSet):
    filter_backends = (SearchFilter,)
    serializer_by_action = {
        'retrieve': SchoolDetailWithPermissionSerializer,
        'list': SchoolWithPermissionSerializer,
        'default': SchoolUpsertSerializer,
    }
    queryset = School.objects.all()
    search_fields = ('name',)

    def get_queryset(self):
        queryset = super().get_queryset()
        # есть право смотреть все школы или является учителем в школе или является тьютором в школе или
        # учится в школе или дети учатся в школе
        if self.request.user.has_perm('users.can_view_school'):
            return queryset
        if self.request.user.type == User.TEACHER:
            return get_schools_for_teacher(self.request.user, queryset)
        if self.request.user.type == User.TUTOR:
            return get_schools_for_tutor(self.request.user, queryset)
        if self.request.user.type == User.STUDENT:
            return get_schools_for_student(self.request.user, queryset)
        if self.request.user.type == User.PARENT:
            return get_schools_for_parent(self.request.user, queryset)
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [IsTeacherAndCanEditSchool()]
        if self.action in ['destroy']:
            return [IsTeacherAndCanDeleteSchool()]
        return super().get_permissions()


class GradeView(SerializerByActionMixin, ModelViewSet):
    serializer_by_action = {
        'default': GradeWithPermissionSerializer,
        'create': GradeCreateSerializer,
        'update': GradeCreateSerializer,
    }
    filter_backends = (SearchFilter,)
    search_fields = ('name',)
    queryset = Grade.objects.all()

    def get_permissions(self):
        if self.action in ['create']:
            return [IsTeacherAndCanCreateGrade()]
        if self.action in ['update', 'partial_update']:
            return [IsTeacherAndCanEditGrade()]
        if self.action in ['destroy']:
            return [IsTeacherAndCanDeleteGrade()]
        return super().get_permissions()

    def get_queryset(self):
        school_filter = self.request.query_params.get('school_filter')
        queryset = super().get_queryset() # todo фильтровать по правам пользователей
        if not self.request.user.has_perm('users.can_view_school'):
            if self.request.user.type == User.TEACHER:
                queryset = get_grades_for_teacher(self.request.user, queryset)
            elif self.request.user.type == User.TUTOR:
                queryset = get_grades_for_tutor(self.request.user, queryset)
            elif self.request.user.type == User.STUDENT:
                queryset = get_grades_for_student(self.request.user, queryset)
            elif self.request.user.type == User.PARENT:
                queryset = get_grades_for_parent(self.request.user, queryset)
        if self.action == 'list':
            if school_filter is not None:
                school = School.objects.filter(id=school_filter).first()
                if school:
                    queryset = queryset.filter(school=school)
                else:
                    queryset = queryset.none()

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_update(self, serializer):
        instance = serializer.instance
        new_users = set(serializer.validated_data.get('users', instance.users.all()))
        old_users = set(instance.users.all())

        added_users = new_users - old_users
        removed_users = old_users - new_users

        super().perform_update(serializer)

        self.update_related_lessons(instance, added_users, removed_users)

    def update_related_lessons(self, grade, added_users, removed_users):
        now = timezone.now()

        # Update Lessons
        lessons = Lesson.objects.filter(grade=grade, end_time__gt=now)
        for lesson in lessons:
            lesson.students.add(*added_users)
            lesson.students.remove(*removed_users)

        # Update MasterLessons
        master_lessons = MasterLesson.objects.filter(grade=grade, period__end_date__gt=now)
        for master_lesson in master_lessons:
            master_lesson.students.add(*added_users)
            master_lesson.students.remove(*removed_users)


class SimpleGradeView(ListModelMixin, GenericViewSet):
    filter_backends = (SearchFilter,)
    search_fields = ('name',)
    serializer_class = SimpleGradeSerializer
    queryset = Grade.objects.all()


class DisciplineView(SerializerByActionMixin, ModelViewSet):
    filter_backends = (SearchFilter,)
    serializer_by_action = {
        'default': DisciplineSerializer,
        'create': DisciplineCreateSerializer,
        'update': DisciplineCreateSerializer,
    }
    queryset = Discipline.objects.all()
    search_fields = ('name', 'teacher__last_name', 'teacher__last_name')
