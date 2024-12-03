from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from django.utils.timezone import make_aware
from rest_framework.test import APIClient
from rest_framework import status
from timetable.models import MasterLesson, Lesson, Period
from schools.models import Discipline, Grade
from users.models import User
import datetime

from utils.test_utils import generate_user


class MasterLessonViewTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = generate_user('testuser', 'password', User.TEACHER)
        self.client.login(username='testuser', password='password')
        self.grade = Grade.objects.create(name='Grade 1')
        self.period = Period.objects.create(
            start_date=timezone.now().date() + datetime.timedelta(days=1),
            end_date=timezone.now().date() + datetime.timedelta(days=180),
            grade=self.grade
        )
        self.discipline = Discipline.objects.create(name='Mathematics')
        self.student = generate_user('student1', 'password', User.STUDENT)
        self.master_lesson_data = {
            'title': 'Math Lesson',
            'lesson_link': 'http://example.com',
            'discipline': self.discipline.id,
            'students': [self.student.id],
            'day_of_week': 'Monday',
            'start_time': '09:00',
            'duration': 40,
            'period': self.period.id,
            'grade': self.grade.id
        }
        self.url = reverse('timetable:view:master_lesson-list')

    def test_create_master_lesson(self):
        response = self.client.post(self.url, self.master_lesson_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        master_lesson = MasterLesson.objects.get(id=response.data['id'])
        lessons = Lesson.objects.filter(lesson_template=master_lesson)
        self.assertTrue(lessons.exists())

    def test_master_lesson_students_match_lessons(self):
        response = self.client.post(self.url, self.master_lesson_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        master_lesson = MasterLesson.objects.get(id=response.data['id'])
        lessons = Lesson.objects.filter(lesson_template=master_lesson)

        for lesson in lessons:
            self.assertListEqual(
                list(lesson.students.values_list('id', flat=True)),
                list(master_lesson.students.values_list('id', flat=True))
            )

    def test_update_master_lesson_updates_lessons(self):
        response = self.client.post(self.url, self.master_lesson_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        master_lesson = MasterLesson.objects.get(id=response.data['id'])
        new_data = self.master_lesson_data.copy()
        new_data.update({
            'title': 'Updated Math Lesson',
            'start_time': '10:00',
            'duration': 30,
        })
        url = reverse('timetable:view:master_lesson-detail', kwargs={'pk': master_lesson.id})
        response = self.client.put(url, new_data, format='json')
        master_lesson = MasterLesson.objects.get(id=response.data['id'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        lessons = Lesson.objects.filter(lesson_template=master_lesson)
        for lesson in lessons:
            self.assertEqual(lesson.title, 'Updated Math Lesson')
            self.assertEqual(lesson.start_time.time(), datetime.time(10, 0))
            self.assertEqual(lesson.end_time.time(), datetime.time(10, 30))

    def test_crud_operations(self):
        # Create
        response = self.client.post(self.url, self.master_lesson_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        master_lesson_id = response.data['id']

        # Read
        url = reverse('timetable:view:master_lesson-detail', kwargs={'pk': master_lesson_id})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Update
        new_data = self.master_lesson_data.copy()
        new_data.update({'title': 'Updated Title'})
        response = self.client.put(url, new_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Title')

        # Delete
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(MasterLesson.objects.filter(id=master_lesson_id).exists())
