from rest_framework import permissions


class IsAuthorOrHasPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Получаем словарь permissions из view
        permissions_dict = getattr(view, 'permissions', {})

        # Проверяем, является ли текущий пользователь автором объекта
        is_author = obj.author == request.user

        # Проверяем наличие требуемого разрешения для текущего метода
        required_permission = permissions_dict.get(request.method)

        return is_author or (required_permission and request.user.has_perm(required_permission))
