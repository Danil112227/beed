from django.db import models

# Create your models here.
from django.utils import timezone
from users.models import User


class Document(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    file = models.FileField()

    def __str__(self):
        return str(self.author)


class BaseAttach(models.Model):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    documents = models.ManyToManyField(Document, )
    description = models.TextField()
    date_added = models.DateTimeField(default=timezone.now)

    class Meta:
        abstract = True


class Materials(BaseAttach):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='created_materials', null=True)
    topic = models.CharField(max_length=255, )
    user = models.ForeignKey(User, related_name='materials', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.topic

    class Meta:
        ordering = ['-date_added']


class LessonMaterials(BaseAttach):
    author = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='created_lesson_materials', null=True)
    topic = models.CharField(max_length=255, )
    lesson = models.ForeignKey('timetable.Lesson', related_name='materials', null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.topic
