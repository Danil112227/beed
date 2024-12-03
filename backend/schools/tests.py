from datetime import date, timedelta
from django.urls import reverse
from django.contrib.auth.models import Permission
from rest_framework import status
from rest_framework.test import APITestCase
from .models import School, SchoolPeriod, User
from schools.serializers import SchoolWithPermissionSerializer, SchoolDetailWithPermissionSerializer

class SchoolViewTests(APITestCase):
    '''
        test_create_school: Проверяем создание школы и вложенных периодов.
        test_retrieve_school_list: Проверяем получение списка школ.
        test_retrieve_school_detail: Проверяем получение детальной информации о школе.
        test_update_school: Проверяем обновление школы, исключая удаление периодов с end_date < date.today().
        test_partial_update_school: Проверяем частичное обновление школы.
        test_delete_school: Проверяем удаление школы и связанных периодов.
        test_list_serializer_data: Проверяем, что данные, возвращаемые методом list, совпадают с SchoolListSerializer.
        test_detail_serializer_data: Проверяем, что данные, возвращаемые методом detail, совпадают с SchoolDetailSerializer.
        test_edit_school_permission: Проверяем права на редактирование школы.
        test_view_school_permission: Проверяем права на просмотр детальной информации о школе.
        test_list_schools_permission: Проверяем права на получение списка школ методом list.
    '''
    def setUp(self):
        self.teacher_user = User.objects.create_user(username='teacher', password='password', type=User.TEACHER)
        self.teacher_user.user_permissions.add(
            Permission.objects.get(codename='can_edit_school'),
            Permission.objects.get(codename='can_view_school')
        )

        self.student_user = User.objects.create_user(username='student', password='password', type=User.STUDENT)

        self.school_data = {
            'name': 'Test School',
            'school_timezone': 1,
            'text': 'This is a test school.',
            'contact': '123-456-7890',
            'periods': [
                {
                    'start_date': (date.today() + timedelta(days=1)).isoformat(),
                    'end_date': (date.today() + timedelta(days=2)).isoformat(),
                    'type': 'work day'
                },
                {
                    'start_date': (date.today() + timedelta(days=3)).isoformat(),
                    'end_date': (date.today() + timedelta(days=4)).isoformat(),
                    'type': 'day off'
                }
            ]
        }
        self.school = School.objects.create(
            name='Existing School',
            school_timezone=1,
            text='Existing school text.',
            contact='987-654-3210'
        )
        self.past_period = SchoolPeriod.objects.create(
            school=self.school,
            start_date=date.today() - timedelta(days=10),
            end_date=date.today() - timedelta(days=5),
            type='work day'
        )
        SchoolPeriod.objects.create(
            school=self.school,
            start_date=date.today() + timedelta(days=5),
            end_date=date.today() + timedelta(days=6),
            type='work day'
        )

    def test_create_school(self):
        self.client.login(username='teacher', password='password')
        url = reverse('schools:view:school-list')
        response = self.client.post(url, self.school_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(School.objects.count(), 2)
        self.assertEqual(SchoolPeriod.objects.count(), 4)
        self.assertEqual(response.data['name'], self.school_data['name'])
        self.client.logout()

    def test_retrieve_school_list(self):
        self.client.login(username='teacher', password='password')
        url = reverse('schools:view:school-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.client.logout()

    def test_retrieve_school_detail(self):
        self.client.login(username='teacher', password='password')
        url = reverse('schools:view:school-detail', args=[self.school.id])
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.school.name)
        self.client.logout()

    def test_update_school(self):
        self.client.login(username='teacher', password='password')
        url = reverse('schools:view:school-detail', args=[self.school.id])
        update_data = {
            'name': 'Updated School',
            'school_timezone': 2,
            'text': 'Updated school text.',
            'contact': '555-555-5555',
            'periods': [
                {
                    'start_date': (date.today() + timedelta(days=7)).isoformat(),
                    'end_date': (date.today() + timedelta(days=8)).isoformat(),
                    'type': 'day off'
                }
            ]
        }
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(School.objects.get(id=self.school.id).name, update_data['name'])
        # Check that past period was not deleted
        self.assertTrue(SchoolPeriod.objects.filter(id=self.past_period.id).exists())
        # Check that a new period was added and one old was removed
        self.assertEqual(SchoolPeriod.objects.filter(school=self.school).count(), 2)
        self.client.logout()

    def test_partial_update_school(self):
        self.client.login(username='teacher', password='password')
        url = reverse('schools:view:school-detail', args=[self.school.id])
        update_data = {
            'text': 'Partially updated school text.'
        }
        response = self.client.patch(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(School.objects.get(id=self.school.id).text, update_data['text'])
        self.client.logout()

    def test_delete_school(self):
        url = reverse('schools:view:school-detail', args=[self.school.id])

        # Without authentication
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # With student user
        self.client.login(username='student', password='password')
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()

        # With teacher user but without required permission
        self.client.login(username='teacher', password='password')
        self.teacher_user.user_permissions.clear()
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()

        # With teacher user and required permission
        self.teacher_user.user_permissions.add(Permission.objects.get(codename='can_view_school'))
        self.teacher_user.user_permissions.add(Permission.objects.get(codename='can_delete_school'))
        self.client.login(username='teacher', password='password')
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(School.objects.count(), 0)
        self.client.logout()

    def test_list_serializer_data(self):
        self.client.login(username='teacher', password='password')
        url = reverse('schools:view:school-list')
        response = self.client.get(url, format='json')
        response_data = response.data['results']
        request = response.wsgi_request
        expected_data = SchoolWithPermissionSerializer(
            School.objects.all(), context={"request": request}, many=True
        ).data
        self.assertEqual(response_data, expected_data)
        self.client.logout()

    def test_detail_serializer_data(self):
        self.client.login(username='teacher', password='password')
        url = reverse('schools:view:school-detail', args=[self.school.id])
        response = self.client.get(url, format='json')
        response_data = response.json()
        request = response.wsgi_request
        expected_data = SchoolDetailWithPermissionSerializer(
            School.objects.get(id=self.school.id),
            context={"request": request}
        ).data
        self.assertEqual(response_data, expected_data)
        self.client.logout()

    def test_edit_school_permission(self):
        url = reverse('schools:view:school-detail', args=[self.school.id])
        update_data = {
            'name': 'Updated School',
            'school_timezone': 2,
            'text': 'Updated school text.',
            'contact': '555-555-5555'
        }

        # Without authentication
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # With student user
        self.client.login(username='student', password='password')
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # With teacher user but without required permission
        self.client.login(username='teacher', password='password')
        self.teacher_user.user_permissions.clear()
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.client.logout()

        # With teacher user and required permission
        self.teacher_user.user_permissions.add(Permission.objects.get(codename='can_edit_school'))
        self.teacher_user.user_permissions.add(Permission.objects.get(codename='can_view_school'))
        self.client.login(username='teacher', password='password')
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

    def test_view_school_permission(self):
        url = reverse('schools:view:school-detail', args=[self.school.id])

        # Without authentication
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # With student user
        self.client.login(username='student', password='password')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # With teacher user but without required permission
        self.client.login(username='teacher', password='password')
        self.teacher_user.user_permissions.clear()
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.client.logout()

        # With teacher user and required permission
        self.teacher_user.user_permissions.add(Permission.objects.get(codename='can_view_school'))
        self.client.login(username='teacher', password='password')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

    def test_list_schools_permission(self):
        url = reverse('schools:view:school-list')

        # Without authentication
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # With student user
        self.client.login(username='student', password='password')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # With teacher user but without required permission
        self.client.login(username='teacher', password='password')
        self.teacher_user.user_permissions.clear()
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()

        # With teacher user and required permission
        self.teacher_user.user_permissions.add(Permission.objects.get(codename='can_view_school'))
        self.client.login(username='teacher', password='password')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.logout()
