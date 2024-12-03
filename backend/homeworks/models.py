from django.db import models
from users.models import User
from materials.models import BaseAttach


class Homework(models.Model):
    HOMEWORK = 0
    PROJECT = 1

    HOMEWORK_TYPES = (
        (HOMEWORK, 'homework'),
        (PROJECT, 'project'),
    )

    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    description = models.TextField()
    deadline = models.DateField()
    lesson = models.ForeignKey('timetable.Lesson', on_delete=models.CASCADE)
    documents = models.ManyToManyField('materials.document')
    type = models.IntegerField(
        'тип задания', choices=HOMEWORK_TYPES, default=HOMEWORK
    )

    def __str__(self):
        return str(self.lesson)


class Answer(BaseAttach):
    ASSIGNED = 0
    DONE = 1
    UNDONE = 2
    UNDER_REVIEW = 3

    HOMEWORK_STATUS = (
        (ASSIGNED, 'assigned'),
        (DONE, 'done'),
        (UNDONE, 'undone'),
        (UNDER_REVIEW, 'under_review'),
    )
    homework = models.ForeignKey(Homework, related_name='answers', on_delete=models.SET_NULL, null=True)
    status = models.IntegerField(choices=HOMEWORK_STATUS, default=UNDER_REVIEW)

    def __str__(self):
        return str(self.homework)


class TeacherAnswer(BaseAttach):
    answer = models.ForeignKey(Answer, related_name='teacher_answers', on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return str(self.answer)
