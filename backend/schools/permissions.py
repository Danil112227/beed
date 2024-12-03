from rest_framework import permissions

from users.models import User

from schools.models import School, Discipline, Grade


class IsTeacherAndCanEditSchool(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.type == User.TEACHER and request.user.has_perm('users.can_edit_school')


class IsTeacherAndCanDeleteSchool(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.type == User.TEACHER and request.user.has_perm('users.can_delete_school')


class IsTeacherAndCanCreateGrade(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.type == User.TEACHER and request.user.has_perm('users.can_create_classes')


class IsTeacherAndCanEditGrade(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.type == User.TEACHER and request.user.has_perm('users.can_edit_class')


class CanViewGrade(permissions.BasePermission):
    def has_permission(self, request, view):
        # есть право смотреть все классы или является учителем в классе или является тьютором в классе или
        # учится в классе или дети учатся в классе
        return request.user.type == User.TEACHER and request.user.has_perm('users.can_view_classes')


class IsTeacherAndCanDeleteGrade(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.type == User.TEACHER and request.user.has_perm('users.can_delete_classes')
