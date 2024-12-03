from schools.models import Grade
from schools.utils import get_grades_for_teacher


def is_tutor_for_user(current_user, user):
    return Grade.objects.filter(tutor=current_user, users=user).exists()


def is_parent_for_user(current_user, user):
    return user in current_user.child.all()


def is_teacher_for_user(current_user, user):
    grades = get_grades_for_teacher(current_user)
    return grades.filter(users=user).exists()


def has_permits_for_user(current_user, user):
    return is_tutor_for_user(
        current_user, user
    ) or is_parent_for_user(
        current_user, user
    ) or is_teacher_for_user(
        current_user, user
    )
