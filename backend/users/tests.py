from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from django.test import TestCase
from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model
from users.models import User
from users.serializers import UserSerializer, UserWithPermissionSerializer
from unittest.mock import patch
from utils.test_utils import generate_user
from schools.models import Grade, Discipline, School



class UserProfileTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword',
            type=User.TEACHER
        )
        self.url = reverse('users:self_profile')

    def test_unauthorized_user_get_profile(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authorized_user_get_profile(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(self.url)
        expected_data = UserWithPermissionSerializer(self.user).data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected_data)


class LoginViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword',
            type=User.STUDENT
        )
        self.url = reverse('users:api_login')

    def test_login_success(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(self.url, data, format='json')
        expected_data = UserWithPermissionSerializer(self.user).data

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected_data)

    def test_login_failure(self):
        data = {
            'username': 'wronguser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'Неправильный логин или пароль.'})

def set_change_password_permission(self):
    content_type = ContentType.objects.get_for_model(User)
    permission = Permission.objects.get(codename='can_change_password', content_type=content_type)
    self.user.user_permissions.add(permission)
    self.user.save()


class ResetPasswordViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.reset_password_url = reverse('users:reset-password')

        # Создаем тестового пользователя
        self.user = User.objects.create_user(
            username='testuser', password='old_password', email='test@example.com', type=User.TEACHER
        )

        self.user.save()

    @patch('users.views.generate_random_password', return_value='new_password')
    @patch('users.views.send_mail')  # Мокаем send_mail
    def test_reset_password_success(self, mock_send_mail, mock_generate_random_password):
        set_change_password_permission(self)
        self.client.login(username='testuser', password='old_password')
        response = self.client.post(self.reset_password_url, {'username': 'testuser'}, format='json')

        self.user.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Проверяем, что send_mail был вызван один раз
        mock_send_mail.assert_called_once()

        # Проверка аргументов вызова send_mail
        subject, message, from_email, recipient_list = mock_send_mail.call_args.args
        self.assertEqual(subject, 'Ваш новый пароль')
        self.assertIn('new_password', message)
        self.assertEqual(from_email, settings.DEFAULT_FROM_EMAIL)
        self.assertEqual(recipient_list, [self.user.email])

    def test_reset_password_permission_denied(self):
        self.client.login(username='testuser', password='old_password')
        response = self.client.post(self.reset_password_url, {'username': 'testuser'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_reset_password_role_denied(self):
        set_change_password_permission(self)
        self.user.type = User.STUDENT  # Not User.Teacher
        self.user.save()

        self.client.login(username='testuser', password='old_password')
        response = self.client.post(self.reset_password_url, {'username': 'testuser'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_reset_password_unauthenticated(self):
        response = self.client.post(self.reset_password_url, {'username': 'testuser'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_reset_password_user_does_not_exist(self):
        set_change_password_permission(self)
        self.client.login(username='testuser', password='old_password')
        response = self.client.post(self.reset_password_url, {'username': 'nonexistent'}, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_reset_password_invalid_data(self):
        set_change_password_permission(self)
        self.client.login(username='testuser', password='old_password')
        response = self.client.post(self.reset_password_url, {'username': ''}, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LogoutViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.logout_url = reverse('users:logout')

        # Создаем тестового пользователя
        self.user = User.objects.create_user(username='testuser', password='password', type=User.TEACHER)

    def test_logout_success(self):
        self.client.login(username='testuser', password='password')
        response = self.client.post(self.logout_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['success'], 'User logged out successfully')

        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_unauthenticated(self):
        response = self.client.post(self.logout_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UsersViewTest(APITestCase):

    def setUp(self):
        # Create users with different roles
        self.superuser = generate_user('admin', 'password', User.TEACHER)
        self.superuser.is_superuser = True
        self.superuser.is_staff = True
        self.superuser.save()

        self.parent_user = generate_user('parent', 'password', User.PARENT)
        self.tutor_user = generate_user('tutor', 'password', User.TUTOR)
        self.teacher_user = generate_user('teacher', 'password', User.TEACHER)
        self.student_user = generate_user('student', 'password', User.STUDENT)

        # Create child users
        self.child_user = generate_user('child', 'password', User.STUDENT)
        self.parent_user.child.add(self.child_user)

        # Create related grades and disciplines
        self.grade = Grade.objects.create(name='Grade 1', year=2024)
        self.grade.users.add(self.child_user)
        self.grade.tutor.add(self.tutor_user)

        self.discipline = Discipline.objects.create(name='Math', teacher=self.teacher_user,
                                                    description='Math discipline')
        self.grade.disciplines.add(self.discipline)

        # Create another school and grade
        self.school = School.objects.create(name='Test School', school_timezone=0)
        self.grade_with_school = Grade.objects.create(name='Grade 2', year=2024, school=self.school)
        self.grade_with_school.users.add(self.child_user)

    def authenticate_user(self, username, password):
        self.client = APIClient()
        login_successful = self.client.login(username=username, password=password)
        self.assertTrue(login_successful)

    def test_parent_user_visibility(self):
        self.authenticate_user('parent', 'password')
        response = self.client.get(reverse('users:view:users-list'))
        self.assertEqual(response.status_code, 200)
        visible_usernames = [user['username'] for user in response.data['results']]
        self.assertIn('child', visible_usernames)
        self.assertNotIn('teacher', visible_usernames)
        self.assertNotIn('tutor', visible_usernames)

    def test_tutor_user_visibility(self):
        self.authenticate_user('tutor', 'password')
        response = self.client.get(reverse('users:view:users-list'))
        self.assertEqual(response.status_code, 200)
        visible_usernames = [user['username'] for user in response.data['results']]
        self.assertIn('child', visible_usernames)
        self.assertIn('teacher', visible_usernames)
        self.assertIn('parent', visible_usernames)
        self.assertNotIn('admin', visible_usernames)

    def test_teacher_user_visibility(self):
        self.authenticate_user('teacher', 'password')
        response = self.client.get(reverse('users:view:users-list'))
        self.assertEqual(response.status_code, 200)
        visible_usernames = [user['username'] for user in response.data['results']]
        self.assertIn('child', visible_usernames)
        self.assertIn('tutor', visible_usernames)
        self.assertNotIn('parent', visible_usernames)
        self.assertNotIn('admin', visible_usernames)

    def test_student_user_visibility(self):
        self.authenticate_user('student', 'password')
        response = self.client.get(reverse('users:view:users-list'))
        self.assertEqual(response.status_code, 200)
        visible_usernames = [user['username'] for user in response.data['results']]
        self.assertNotIn('child', visible_usernames)
        self.assertNotIn('teacher', visible_usernames)
        self.assertNotIn('tutor', visible_usernames)
        self.assertNotIn('parent', visible_usernames)

    def test_superuser_visibility(self):
        self.authenticate_user('admin', 'password')
        response = self.client.get(reverse('users:view:users-list'))
        self.assertEqual(response.status_code, 200)
        visible_usernames = [user['username'] for user in response.data['results']]
        self.assertIn('child', visible_usernames)
        self.assertIn('teacher', visible_usernames)
        self.assertIn('tutor', visible_usernames)
        self.assertIn('parent', visible_usernames)
