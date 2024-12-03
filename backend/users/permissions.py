from rest_framework import permissions

from users.models import User


class IsTeacherWithPermission(permissions.BasePermission):
    """
    Custom permission to only allow users with a specific type and permission.
    """
    def has_permission(self, request, view):
        # Check if user type is 'Teacher' and has the 'can_change_password' permission
        if request.user.type == User.TEACHER and request.user.has_perm('users.can_change_password'):
            return True

        return False
