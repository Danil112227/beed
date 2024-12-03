import random
import string

from django.contrib.auth.decorators import permission_required
from django.db.models.query_utils import Q
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import SearchFilter
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from users.serializers import FullUserSerializer, UserSerializer, UserWithPermissionSerializer, SuperLoginSerializer
from users.models import User

from utils.viewsets import SerializerByActionMixin

from users.serializers import FullUserCreateSerializer, UsernameSerializer
from django.contrib.auth import authenticate, login, logout
from schools.models import School, Grade
from auth.decorators import login_exempt

from users.permissions import IsTeacherWithPermission

from users.utils import is_tutor_for_user


# tested
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({'success': 'User logged out successfully'}, status=status.HTTP_200_OK)


# tested
@csrf_exempt
@login_exempt
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)

    if user is not None:
        login(request, user)
        return Response(
            UserWithPermissionSerializer(user).data, status=status.HTTP_200_OK
        )
    else:
        return Response({'error': 'wrong login or password'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def super_login_view(request):
    serializer = SuperLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        if request.user.has_perm('users.can_super_login') or is_tutor_for_user(request.user, user):
            login(request, user)
        else:
            raise PermissionDenied('У вас нет прав для выполнения этой операции.')
        return Response(UserWithPermissionSerializer(user).data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# tested
@api_view(['GET'])
def self_profile(request):
    return Response(UserWithPermissionSerializer(get_object_or_404(User.objects.all(), id=request.user.id)).data)


class UserFilterMixin(object):
    def filter_users(self, current_user, queryset):
        if current_user.has_perm('users.can_view_users'):
            return queryset
        if current_user.type == User.PARENT:
            return queryset.filter(Q(id__in=current_user.child.values_list('id', flat=True)) | Q(id=current_user.id))

        elif current_user.type == User.TUTOR:
            tutor_grades = Grade.objects.filter(tutor=current_user)
            grade_users = User.objects.filter(grades__in=tutor_grades)
            parent_users = User.objects.filter(child__in=grade_users)
            teachers = User.objects.filter(disciplines__grades__in=tutor_grades)

            return queryset.filter(
                Q(id__in=grade_users) |
                Q(id__in=parent_users) |
                Q(id__in=teachers) |
                Q(id=current_user.id)
            ).distinct()

        elif current_user.type == User.TEACHER:
            teacher_grades = Grade.objects.filter(disciplines__teacher=current_user)
            grade_users = User.objects.filter(grades__in=teacher_grades)
            tutors = User.objects.filter(my_grades__in=teacher_grades)

            return queryset.filter(
                Q(id__in=grade_users) |
                Q(id__in=tutors) |
                Q(id=current_user.id)
            ).distinct()

        elif current_user.type == User.STUDENT:
            return queryset.none()

        return queryset

    def get_queryset(self):
        filter_params = {
            'student': User.STUDENT,
            'teacher': User.TEACHER,
            'tutor': User.TUTOR,
            'parent': User.PARENT,
            'all': None
        }
        user_filter = self.request.query_params.get('filter')
        school_filter = self.request.query_params.get('school_filter')
        grade_filter = self.request.query_params.get('grade')
        queryset = User.objects.all()
        queryset = self.filter_users(self.request.user, queryset)

        if self.action == 'list':
            if user_filter is not None:
                current_type = filter_params.get(user_filter, None)
                queryset = queryset.filter(type=current_type)
            if school_filter is not None:
                school = School.objects.filter(id=school_filter).first()
                if school:
                    grades = Grade.objects.filter(school_id=school_filter)
                    queryset = queryset.filter(grades__in=grades).distinct()
                    if grade_filter is not None:
                        grades = Grade.objects.filter(id=grade_filter)
                        if grades:
                            queryset = queryset.filter(grades__in=grades)
                else:
                    queryset = queryset.none()

        return queryset


class UsersView(UserFilterMixin, ModelViewSet):
    filter_backends = (SearchFilter,)
    serializer_class = UserSerializer
    queryset = User.objects.all()
    search_fields = ('first_name', 'last_name', 'Patronymic')

    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = self.serializer_class(user)
        return Response(serializer.data)


class UsersProfileView(SerializerByActionMixin, UserFilterMixin, ModelViewSet):
    filter_backends = (SearchFilter,)
    search_fields = ('first_name', 'last_name', 'Patronymic')
    serializer_by_action = {
        'default': FullUserSerializer,
        'create': FullUserCreateSerializer,
        'update': FullUserCreateSerializer,
    }
    queryset = User.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


def generate_random_password(length=8):
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(random.choice(letters_and_digits) for i in range(length))


# tested
class ResetPasswordView(APIView):
    permission_classes = [IsTeacherWithPermission]

    def post(self, request):
        if request.user.type != User.TEACHER:
            return Response({'error': 'You do not have permission to perform this action'},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = UsernameSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

            new_password = generate_random_password()
            user.set_password(new_password)
            user.save()

            if not settings.DEBUG:
                subject = 'Ваш новый пароль'
                message = f'Ваш новый сгенерированный пароль: {new_password}'
                from_email = settings.DEFAULT_FROM_EMAIL
                recipient_list = [user.email]

                send_mail(subject, message, from_email, recipient_list)
                return Response({'success': 'Password reset and email sent'}, status=status.HTTP_200_OK)
            else:
                return Response({'success': new_password}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
