from django.contrib.auth.models import UserManager, AbstractUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    STUDENT = 0
    TEACHER = 1
    TUTOR = 2
    PARENT = 3

    USER_TYPES = (
        (STUDENT, 'student'),
        (TEACHER, 'teacher'),
        (TUTOR, 'tutor'),
        (PARENT, 'parent'),
    )

    username = models.CharField(
        'Имя пользователя', max_length=30, unique=True, db_index=True,
        help_text='Обязательное. Не более 30 символов. Letters, digits and @/./+/-/_ only.',
        validators=[
            UnicodeUsernameValidator(message='Может содержать только буквы, цифры и символы @/./+/-/_')
        ],
        error_messages={
            'unique': 'Пользователь с таким именем уже существует',
        }
    )
    Patronymic = models.CharField(max_length=255, blank=True, default='')
    type = models.IntegerField(
        'тип пользователя', choices=USER_TYPES
    )
    user_timezone = models.IntegerField('user timezone', default=0)
    user_timezone_text = models.CharField(max_length=150, blank=True, default='')
    birthday = models.DateField('birthday', default=timezone.now)
    city = models.CharField(max_length=150, blank=True, default='')
    phone = models.CharField(max_length=150, blank=True, default='')
    child = models.ManyToManyField('self', blank=True)

    USERNAME_FIELD = 'username'
    objects = UserManager()

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        permissions = [
            ("can_change_password", "can change password"),
            # school
            ('can_create_school', 'can_create_school'),
            ("can_edit_school", "can edit school"),
            ("can_view_school", "can view school"),
            ("can_delete_school", "can delete school"),
            # material
            ("can_delete_material", "can_delete_material"),
            ("can_edit_all_materials", "can_edit_all_materials"),
            ("can_edit_all_lesson_materials", "can_edit_all_lesson_materials"),
            ("can_delete_lesson_materials", "can_delete_lesson_materials"),
            # users
            ("can_view_users", "can_view_users"),
            ("can_create_users", "can_create_users"),
            ("can_edit_users", "can_edit_users"),
            ("can_delete_users", "can_delete_users"),
            # disciplines
            ("can_create_discipline", "can_create_discipline"),
            ("can_delete_discipline", "can_delete_discipline"),
            # classes
            ("can_create_classes", "can_create_classes"),
            ("can_edit_class", "can_edit_class"),
            ("can_view_classes", "can_view_classes"),
            ("can_delete_classes", "can_delete_classes"),
            # class actions
            ("can_edit_timetable_template", "can_edit_timetable_template"),
            ("can_edit_student_list", "can_edit_student_list"),
            # lesson
            ("can_edit_lesson_student_list", "can_edit_lesson_student_list"),
            ("can_edit_lesson", "can_edit_lesson"),
            ("can_delete_lesson", "can_delete_lesson"),
            # super_login
            ("can_super_login", "can_super_login"),
        ]

    def __str__(self):
        return self.username
