from django.db import models

# Create your models here.
from django.utils import timezone


class Period(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    grade = models.ForeignKey('schools.Grade', on_delete=models.CASCADE)

    def __str__(self):
        return str(f'{self.start_date} {self.end_date}')


class BaseLesson(models.Model):
    title = models.CharField(max_length=255, )
    lesson_link = models.TextField()
    discipline = models.ForeignKey('schools.Discipline', on_delete=models.SET_NULL, null=True)
    students = models.ManyToManyField('users.User', )

    class Meta:
        abstract = True


class MasterLesson(BaseLesson):
    MONDAY = 'Monday'
    TUESDAY = 'Tuesday'
    WEDNESDAY = 'Wednesday'
    THURSDAY = 'Thursday'
    FRIDAY = 'Friday'
    SATURDAY = 'Saturday'
    SUNDAY = 'Sunday'

    DAYS = (
        (MONDAY, 'Monday'),
        (TUESDAY, 'Tuesday'),
        (WEDNESDAY, 'Wednesday'),
        (THURSDAY, 'Thursday'),
        (FRIDAY, 'Friday'),
        (SATURDAY, 'Saturday'),
        (SUNDAY, 'Sunday'),
    )
    grade = models.ForeignKey('schools.Grade', on_delete=models.SET_NULL, null=True, related_name='master_lessons')
    discipline = models.ForeignKey('schools.Discipline', on_delete=models.SET_NULL, null=True, related_name='master_lessons')
    students = models.ManyToManyField('users.User', related_name='master_lessons')
    day_of_week = models.CharField(max_length=50, choices=DAYS, default=MONDAY)
    start_time = models.CharField(max_length=50, default=timezone.now)
    duration = models.PositiveIntegerField(default=40)
    period = models.ForeignKey(Period, on_delete=models.CASCADE)

    def __str__(self):
        return str(f'{self.discipline} {self.period.start_date} {self.start_time}')


class Lesson(BaseLesson):
    lesson_template = models.ForeignKey(MasterLesson, on_delete=models.CASCADE, null=True)
    discipline = models.ForeignKey('schools.Discipline', on_delete=models.SET_NULL, null=True, related_name='lessons')
    temp_teacher = models.ForeignKey(
        'users.User', blank=True, null=True, on_delete=models.SET_NULL, related_name='temp_lessons'
    )
    description = models.TextField(default='')
    students = models.ManyToManyField('users.User', related_name='lessons')
    grade = models.ForeignKey('schools.Grade', null=True, blank=True, related_name='lessons', on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return self.title
