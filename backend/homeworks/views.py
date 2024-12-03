from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from homeworks.serializers import HomeworkSerializer, AnswerSerializer, HomeworkCreateSerializer, \
    AnswerCreateSerializer, TeacherAnswerSerializer, TeacherAnswerCreateSerializer, HomeworkDetailSerializer, \
    HomeworkListSerializer
from homeworks.models import Homework, Answer, TeacherAnswer

from utils.viewsets import SerializerByActionMixin

from users.models import User

from timetable.models import Lesson


class HomeworkView(SerializerByActionMixin, ModelViewSet):
    serializer_by_action = {
        'default': HomeworkSerializer,
        'create': HomeworkCreateSerializer,
        'update': HomeworkCreateSerializer,
    }
    queryset = Homework.objects.all()

    def get_queryset(self):
        filter_params = {
            'homework': Homework.HOMEWORK,
            'project': Homework.PROJECT,
        }
        queryset = super().get_queryset()  # todo фильтровать по правам пользователей
        lesson_param = self.request.query_params.get('lesson', None)
        if lesson_param:
            queryset = queryset.filter(lesson_id=lesson_param)
        user_param = self.request.query_params.get('user', None)
        if user_param:
            user = User.objects.filter(id=user_param).first()
            # todo закрыть эксплойт с просмотром чужих домашек при передаче user, answer
            if user.type == User.STUDENT:
                queryset = queryset.filter(lesson__in=user.lessons.all())
            elif user.type == User.TEACHER:
                lessons = Lesson.objects.filter(discipline__teacher=user)
                queryset = queryset.filter(lesson__in=lessons)
                if self.action == 'list':
                    homework = Answer.objects.filter(homework__in=queryset, status=Answer.UNDER_REVIEW).values_list(
                        'homework_id', flat=True
                    )
                    queryset = queryset.filter(id__in=homework)
            else:
                queryset = queryset.none()
        homework_filter = self.request.query_params.get('filter')
        if self.action == 'list':
            if homework_filter is not None:
                current_type = filter_params.get(homework_filter, Homework.HOMEWORK)
                queryset = queryset.filter(type=current_type)

        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user_param = self.request.query_params.get('user', None)
        if user_param:
            context['user'] = User.objects.filter(id=user_param).first()
        context['request'] = self.request
        return context

    def get_serializer_class(self):
        if self.action == 'retrieve':
            user_param = self.request.query_params.get('user', None)
            if user_param:
                return HomeworkDetailSerializer
        if self.action == 'list':
            user_param = self.request.query_params.get('user', None)
            if user_param:
                return HomeworkListSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        user_param = self.request.query_params.get('user', None)
        if user_param and request.user.type == User.TEACHER:
            student = User.objects.filter(id=user_param).first()
            if student:
                # Проверяем, существует ли ответ
                answer_exists = Answer.objects.filter(homework=instance, author=student).exists()
                if not answer_exists:
                    # Создаем ответ с статусом ASSIGNED
                    Answer.objects.create(homework=instance, author=student, status=Answer.ASSIGNED)
        response = super().retrieve(request, *args, **kwargs)
        return response

    def patched_homework(self, answer):
        homework = answer.homework
        homework.related_answer = answer
        return homework

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            # тут уже список объектов
            # пользователь - учитель
            # пользователь которого смотрят - учитель
            user_param = self.request.query_params.get('user', None)
            new_page = page
            if user_param:
                user = User.objects.filter(id=user_param).first()
                if request.user.type == User.TEACHER and user.type == User.TEACHER:
                    answers = Answer.objects.filter(homework__in=page, status=Answer.UNDER_REVIEW)
                    new_page = [self.patched_homework(answer) for answer in answers]
            serializer = self.get_serializer(new_page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class AnswerView(SerializerByActionMixin, ModelViewSet):
    serializer_by_action = {
        'default': AnswerSerializer,
        'create': AnswerCreateSerializer,
        'update': AnswerCreateSerializer,
    }
    queryset = Answer.objects.all()

    def perform_create(self, serializer):
        author = self.request.user

        # Проверка типа пользователя
        if author.type not in (User.TUTOR, User.STUDENT):
            raise PermissionDenied('You do not have permission to perform this action.')

        user_id = self.request.query_params.get('user')

        if author.type == User.TUTOR and user_id:
            try:
                user = User.objects.get(id=user_id)
                author = user
            except User.DoesNotExist:
                raise ValidationError({'user': 'User with this ID does not exist.'})

        serializer.save(author=author)

    def get_serializer_context(self):
        return {'request': self.request}


class TeacherAnswerView(SerializerByActionMixin, ModelViewSet):
    serializer_by_action = {
        'default': TeacherAnswerSerializer,
        'create': TeacherAnswerCreateSerializer,
        'update': TeacherAnswerCreateSerializer,
    }
    queryset = TeacherAnswer.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        serializer.save(author=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}
