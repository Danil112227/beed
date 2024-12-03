from datetime import date

from users.models import User


def generate_user(username, password, type):
    return User.objects.create_user(
        username=username,
        password=password,
        type=type,
        Patronymic='Иванович',
        user_timezone=0,
        birthday=date(2000, 1, 1),
        city='Москва',
        phone='1234567890'
    )
