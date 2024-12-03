from django.db import models
from users.models import User

# Create your models here.


class School(models.Model):
    name = models.CharField('name', max_length=255, unique=True)
    description = models.TextField(default='', blank=True)
    school_timezone_text = models.CharField(max_length=150, blank=True, default='')
    school_timezone = models.IntegerField()
    text = models.TextField()
    contact = models.TextField()
    email = models.TextField(default='', blank=True)
    wats_app = models.TextField(default='', blank=True)
    first_name = models.TextField(default='', blank=True)
    last_name = models.TextField(default='', blank=True)

    class Meta:
        verbose_name = 'Школа'
        verbose_name_plural = 'Школы'

    def __str__(self):
        return self.name


class SchoolPeriod(models.Model):
    WORK_DAY = 'work day'
    DAY_OFF = 'day off'

    PERIOD_CHOICES = [
        (WORK_DAY, 'Work day'),
        (DAY_OFF, 'Day off'),
    ]

    start_date = models.DateField()
    end_date = models.DateField()
    type = models.CharField(
        max_length=8,
        choices=PERIOD_CHOICES,
        default=WORK_DAY,
    )
    school = models.ForeignKey(
        School, related_name='periods', null=True, blank=True, default=None, on_delete=models.CASCADE
    )

    def __str__(self):
        return f'{self.type} from {self.start_date} to {self.end_date}'


class Discipline(models.Model):
    name = models.CharField('name', max_length=255)
    teacher = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='disciplines')
    description = models.TextField()
    default_link = models.CharField(default='', blank=True, max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = (
            ('name', 'teacher'),
        )


class Grade(models.Model):
    name = models.CharField('name', max_length=255, )
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, related_name='grades')
    year = models.IntegerField(default=1)
    tutor = models.ManyToManyField(User, blank=True, related_name='my_grades')
    users = models.ManyToManyField(User, blank=True, related_name='grades')
    disciplines = models.ManyToManyField(Discipline, related_name='grades')
    description = models.TextField(default='', blank=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = (
            ('name', 'school'),
        )
