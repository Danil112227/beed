from timetable.models import Lesson
from materials.models import LessonMaterials

from .serializers import LessonMaterialsSerializer
from utils.test_utils import generate_user

PATH_TO_FILE = 'materials/test_files/'

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import Permission
from django.urls import reverse
from datetime import date, datetime
from .models import Document, Materials
from users.models import User


class DocumentViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Создаем тестового пользователя
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass',
            type=User.STUDENT,
            Patronymic='Иванович',
            user_timezone=0,
            birthday=date(2000, 1, 1),
            city='Москва',
            phone='1234567890'
        )

        self.client.login(username='testuser', password='testpass')

        self.url_list = reverse('materials:view:document-list')  # assuming you have registered your urls correctly
        self.document = Document.objects.create(author=self.user, file=f'{PATH_TO_FILE}file.txt')
        self.url_detail = reverse('materials:view:document-detail', kwargs={'pk': self.document.id})

    def test_create_document(self):
        with open(f'{PATH_TO_FILE}file.txt', 'rb') as file:
            response = self.client.post(self.url_list, {'file': file}, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertEqual(response.data['author'], self.user.id)

    def test_list_documents(self):
        response = self.client.get(self.url_list, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), Document.objects.count())

    def test_retrieve_document(self):
        response = self.client.get(self.url_detail, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.document.id)

    def test_delete_document(self):
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Document.objects.filter(id=self.document.id).exists())

    def tearDown(self):
        self.client.logout()
        User.objects.all().delete()
        Document.objects.all().delete()


def create_user(self):
    self.user = generate_user('testuser', 'testpass', User.TEACHER)
    self.student_user = generate_user('student_user', 'student_user', User.STUDENT)
    self.other_user = generate_user('otheruser', 'password', User.STUDENT)

class MaterialsAPITestCase(TestCase):
    """
        test_user_cannot_edit_if_not_author_and_has_no_permission: Проверяем, что пользователь не может редактировать материал с помощью методов PUT и PATCH, если он не является автором и не имеет права can_edit_all_materials.
        test_user_can_edit_if_has_permission_but_not_author: Проверяем, что пользователь может редактировать материал с помощью методов PUT и PATCH, если он не является автором, но имеет право can_edit_all_materials.
        test_user_can_edit_if_author_without_permission: Проверяем, что автор материала может редактировать материал с помощью методов PUT и PATCH, даже если у него нет права can_edit_all_materials.
        test_user_can_delete_if_author_or_has_permission: Проверяем, что пользователь может удалить материал, если он является автором или имеет право can_delete_material.
        test_unauthenticated_user_cannot_access_materials: Проверяет, что неавторизованный пользователь не может получить доступ к методам:
            GET /api/materials/ и GET /api/materials/{id}/
            POST /api/materials/
            PUT /api/materials/{id}/
            PATCH /api/materials/{id}/
            DELETE /api/materials/{id}/
    """

    def setUp(self):
        self.client = APIClient()
        create_user(self)
        self.document = Document.objects.create(author=self.user, file='testfile.txt')
        self.other_document = Document.objects.create(author=self.other_user, file='othertestfile.txt')
        self.materials = Materials.objects.create(
            author=self.user,
            topic='Test Topic',
            description='Test Description',
            user=self.user
        )
        self.materials.documents.add(self.document)

    def test_create_materials(self):
        self.client.login(username='testuser', password='testpass')
        url = reverse('materials:view:materials-list')
        payload = {
            'topic': 'New Topic',
            'description': 'New Description',
            'user': self.user.id,
            'documents': [self.document.id]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['topic'], payload['topic'])

    def test_get_materials_list(self):
        self.client.login(username='testuser', password='testpass')
        url = reverse('materials:view:materials-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_material(self):
        self.client.login(username='testuser', password='testpass')
        url = reverse('materials:view:materials-detail', kwargs={'pk': self.materials.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['topic'], self.materials.topic)

    def test_update_material(self):
        self.client.login(username='testuser', password='testpass')
        url = reverse('materials:view:materials-detail', kwargs={'pk': self.materials.id})
        payload = {
            'topic': 'Updated Topic',
            'description': 'Updated Description',
            'user': self.user.id,
            'documents': [doc.id for doc in self.materials.documents.all()]
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['topic'], payload['topic'])

    def test_delete_material(self):
        self.client.login(username='testuser', password='testpass')
        url = reverse('materials:view:materials-detail', kwargs={'pk': self.materials.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_create_materials_with_other_users_document(self):
        self.client.login(username='testuser', password='testpass')
        url = reverse('materials:view:materials-list')
        payload = {
            'topic': 'New Topic with Other User\'s Document',
            'description': 'New Description',
            'user': self.user.id,
            'documents': [self.other_document.id]  # Document authored by other user
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('documents', response.data)
        self.assertEqual(response.data['documents'][0], "Document does not belong to the user.")

    def test_create_materials_as_student_user(self):
        self.client.login(username='student_user', password='student_user')
        url = reverse('materials:view:materials-list')
        payload = {
            'topic': 'Topic from Student User',
            'description': 'Some description',
            'user': self.student_user.id,
            'documents': [self.document.id]  # Acceptable documents for student user
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user'][0], 'Only users with teacher status can set user field.')

    def test_user_cannot_edit_if_not_author_and_has_no_permission(self):
        # Логиним пользователя кто не является автором и не имеет права can_edit_all_materials
        self.client.login(username=self.other_user.username, password='password')

        data = {'topic': 'Updated Topic', 'description': 'Updated Description'}

        # Проверяем метод PUT
        url = reverse('materials:view:materials-detail', kwargs={'pk': self.materials.id})
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Проверяем метод PATCH
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_edit_if_has_permission_but_not_author(self):
        # Назначаем право can_edit_all_materials пользователю other_user
        permission = Permission.objects.get(codename='can_edit_all_materials')
        self.other_user.user_permissions.add(permission)

        # Логиним пользователя other_user
        self.client.login(username=self.other_user.username, password='password')

        data = {'topic': 'Updated Topic', 'description': 'Updated Description'}

        # Проверяем метод PUT
        url = reverse('materials:view:materials-detail', kwargs={'pk': self.materials.id})
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Проверяем метод PATCH
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_edit_if_author_without_permission(self):
        # Логиним автора материала
        self.client.login(username=self.user.username, password='testpass')

        data = {'topic': 'Updated Topic', 'description': 'Updated Description'}

        # Проверяем метод PUT
        url = reverse('materials:view:materials-detail', kwargs={'pk': self.materials.id})
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Проверяем метод PATCH
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_delete_if_author_or_has_permission(self):
        # Логиним автора материала
        result = self.client.login(username='testuser', password='testpass')
        # Проверка удаления материал автором
        url = reverse('materials:view:materials-detail', kwargs={'pk': self.materials.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Назначаем право can_delete_material пользователю other_user
        self.materials = Materials.objects.create(
            author=self.user,
            topic='Another Test Topic',
            description='Another Test Description',
            user=self.user
        )
        self.materials.documents.add(self.document)
        permission = Permission.objects.get(codename='can_delete_material')
        self.other_user.user_permissions.add(permission)

        # Логиним пользователя other_user
        self.client.login(username=self.other_user.username, password='password')

        # Проверка удаления материал пользователем с правом can_delete_material
        url = reverse('materials:view:materials-detail', kwargs={'pk': self.materials.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unauthenticated_user_cannot_access_materials(self):
        data = {'topic': 'Test Topic', 'description': 'Test Description'}
        material_id = self.materials.id
        detail_url = reverse('materials:view:materials-detail', kwargs={'pk': self.materials.id})
        list_url = reverse('materials:view:materials-list')

        # Проверка доступа для метода GET
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.get(list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Проверка доступа для метода POST
        response = self.client.post(list_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Проверка доступа для метода PUT
        response = self.client.put(detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Проверка доступа для метода PATCH
        response = self.client.patch(detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Проверка доступа для метода DELETE
        response = self.client.delete(detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LessonMaterialsAPITestCase(TestCase):
    """
        Эти тесты проверяю:
        setUp: Инициализация тестового окружения. Создаем пользователя, урок, документы и учебные материалы. Аутентифицируем пользователя.
        test_create_lesson_materials: Проверка успешного создания учебных материалов.
        test_get_lesson_materials: Проверка получения информации о конкретных учебных материалах.
        test_update_lesson_materials: Проверка успешного обновления учебных материалов.
        test_delete_lesson_materials: Проверка успешного удаления учебных материалов.
        test_forbidden_create_without_authentication, test_forbidden_update_without_authentication,
        test_forbidden_delete_without_authentication: Проверка невозможности выполнения операций создания,
        обновления и удаления для неаутентифицированных пользователей.
        test_update_lesson_materials_author_only Только автор материала может загружать документы.
        test_create_lesson_materials_only_teacher: Только пользователи с типом TEACHER могут создавать учебные материалы.
        test_list_lesson_materials_student, test_retrieve_lesson_materials_student: Студенты могут видеть только те учебные материалы, которые связаны с их уроками.
        test_list_lesson_materials_parent, test_retrieve_lesson_materials_parent: Родители могут видеть только те учебные материалы, которые связаны с уроками их детей.
        test_list_lesson_materials_teacher, test_retrieve_lesson_materials_teacher: Учителя и наставники могут видеть все учебные материалы.
        test_list_lesson_materials_tutor, test_retrieve_lesson_materials_tutor: Учителя и наставники могут видеть все учебные материалы.
    """
    def setUp(self):
        self.client = APIClient()

        # Create Users
        self.teacher = User.objects.create_user(
            username='teacher',
            password='testpass',
            type=User.TEACHER,
            Patronymic='Иванович',
            user_timezone=0,
            birthday=date(2000, 1, 1),
            city='Москва',
            phone='1234567890'
        )
        self.client.login(username=self.teacher, password='testpass')
        self.student = User.objects.create_user(
            username='student',
            password='testpass',
            type=User.STUDENT,
            Patronymic='Иванович',
            user_timezone=0,
            birthday=date(2000, 1, 1),
            city='Москва',
            phone='1234567890'
        )
        self.tutor = User.objects.create_user(
            username='tutor',
            password='testpass',
            type=User.TUTOR,
            Patronymic='Иванович',
            user_timezone=0,
            birthday=date(2000, 1, 1),
            city='Москва',
            phone='1234567890'
        )
        self.parent = User.objects.create_user(
            username='parent',
            password='testpass',
            type=User.PARENT,
            Patronymic='Иванович',
            user_timezone=0,
            birthday=date(2000, 1, 1),
            city='Москва',
            phone='1234567890'
        )
        self.child_student = User.objects.create_user(
            username='child_student',
            password='testpass',
            type=User.STUDENT,
            Patronymic='Иванович',
            user_timezone=0,
            birthday=date(2000, 1, 1),
            city='Москва',
            phone='1234567890'
        )
        self.parent.child.add(self.child_student)

        # Create Discipline, Grade, Lesson and Documents
        self.lesson = Lesson.objects.create(
            title = 'title',
            lesson_link = 'link',
            start_time = datetime.now(),
            end_time = datetime.now(),
        )
        self.lesson.students.add(self.student)
        self.lesson.students.add(self.child_student)
        self.document1 = Document.objects.create(author=self.teacher, file='testfile1.txt')
        self.document2 = Document.objects.create(author=self.teacher, file='testfile2.txt')

        # Create LessonMaterial
        self.lesson_material = LessonMaterials.objects.create(
            author=self.teacher,
            topic='Test Topic',
            lesson=self.lesson,
            description='Test Description'
        )
        self.lesson_material.documents.add(self.document1, self.document2)

    def test_create_lesson_materials(self):
        data = {
            'topic': 'New Topic',
            'lesson': self.lesson.id,
            'description': 'New Description',
            'documents': [self.document1.id, self.document2.id]
        }

        response = self.client.post(reverse('materials:view:lesson_materials-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_lesson_materials(self):
        response = self.client.get(
            reverse(
                'materials:view:lesson_materials-detail', kwargs={'pk': self.lesson_material.id}
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = LessonMaterialsSerializer(self.lesson_material)
        self.assertEqual(response.data, serializer.data)

    def test_update_lesson_materials(self):
        data = {
            'topic': 'Updated Topic',
            'lesson': self.lesson.id,
            'description': 'Updated Description',
            'documents': [self.document1.id]
        }
        response = self.client.put(
            reverse(
                'materials:view:lesson_materials-detail', kwargs={'pk': self.lesson_material.id}
            ), data, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.lesson_material.refresh_from_db()
        self.assertEqual(self.lesson_material.topic, 'Updated Topic')
        self.assertEqual(self.lesson_material.description, 'Updated Description')
        self.assertEqual(list(self.lesson_material.documents.all()), [self.document1])

    def test_delete_lesson_materials(self):
        response = self.client.delete(
            reverse(
                'materials:view:lesson_materials-detail', kwargs={'pk': self.lesson_material.id}
            )
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(LessonMaterials.objects.filter(id=self.lesson_material.id).exists())

    def test_forbidden_create_without_authentication(self):
        self.client.logout()
        data = {
            'topic': 'New Topic',
            'lesson': self.lesson.id,
            'description': 'New Description',
            'documents': [self.document1.id, self.document2.id]
        }
        response = self.client.post(reverse('materials:view:lesson_materials-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_forbidden_update_without_authentication(self):
        self.client.logout()
        data = {
            'topic': 'Updated Topic',
            'lesson': self.lesson.id,
            'description': 'Updated Description',
            'documents': [self.document1.id]
        }
        response = self.client.put(
            reverse(
                'materials:view:lesson_materials-detail', kwargs={'pk': self.lesson_material.id}
            ), data, format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_forbidden_delete_without_authentication(self):
        self.client.logout()
        response = self.client.delete(
            reverse(
                'materials:view:lesson_materials-detail', kwargs={'pk': self.lesson_material.id}
            )
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_lesson_materials_only_teacher(self):
        self.client.force_authenticate(user=self.student)
        data = {
            'topic': 'New Topic',
            'lesson': self.lesson.id,
            'description': 'New Description',
            'documents': [self.document1.id, self.document2.id]
        }
        response = self.client.post(reverse('materials:view:lesson_materials-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], "Only users with teacher status can set lesson material.")

    def test_update_lesson_materials_author_only(self):
        self.client.force_authenticate(user=self.student)
        data = {
            'topic': 'Updated Topic',
            'lesson': self.lesson.id,
            'description': 'Updated Description',
            'documents': [self.document1.id]
        }
        response = self.client.put(
            reverse(
                'materials:view:lesson_materials-detail', kwargs={'pk': self.lesson_material.id}
            ), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], "У вас недостаточно прав для выполнения данного действия.")

    def test_list_lesson_materials_student(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(reverse('materials:view:lesson_materials-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.lesson_material.id)

    def test_retrieve_lesson_materials_student(self):
        self.client.force_authenticate(user=self.student)
        response = self.client.get(
            reverse(
                'materials:view:lesson_materials-detail', kwargs={'pk': self.lesson_material.id}
            ))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.lesson_material.id)

    def test_list_lesson_materials_parent(self):
        self.client.force_authenticate(user=self.parent)
        response = self.client.get(reverse('materials:view:lesson_materials-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.lesson_material.id)

    def test_retrieve_lesson_materials_parent(self):
        self.client.force_authenticate(user=self.parent)
        response = self.client.get(
            reverse(
                'materials:view:lesson_materials-detail', kwargs={'pk': self.lesson_material.id}
            ))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.lesson_material.id)

    def test_list_lesson_materials_teacher(self):
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(reverse('materials:view:lesson_materials-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), LessonMaterials.objects.count())

    def test_retrieve_lesson_materials_teacher(self):
        self.client.force_authenticate(user=self.teacher)
        response = self.client.get(
            reverse(
                'materials:view:lesson_materials-detail', kwargs={'pk': self.lesson_material.id}
            ))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.lesson_material.id)

    def test_list_lesson_materials_tutor(self):
        self.client.force_authenticate(user=self.tutor)
        response = self.client.get(reverse('materials:view:lesson_materials-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), LessonMaterials.objects.count())

    def test_retrieve_lesson_materials_tutor(self):
        self.client.force_authenticate(user=self.tutor)
        response = self.client.get(
            reverse(
                'materials:view:lesson_materials-detail', kwargs={'pk': self.lesson_material.id}
            )
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.lesson_material.id)
