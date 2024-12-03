from rest_framework import serializers
from users.models import User

from schools.utils import SimpleGradeSerializer, SimpleDisciplineSerializer

from utils.serializer import PermissionFieldsMixin

from users.utils import is_tutor_for_user


class UserSerializer(PermissionFieldsMixin, serializers.ModelSerializer):
    grades = SimpleGradeSerializer(many=True, read_only=True)
    disciplines = SimpleDisciplineSerializer(many=True, read_only=True)

    edit_perm = 'users.can_edit_users'
    delete_perm = 'users.can_delete_users'

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'Patronymic', 'username', 'type', 'grades',
            'disciplines', 'can_edit', 'can_delete',
        )
        read_only_fields = (
            'id', 'first_name', 'last_name', 'Patronymic', 'username', 'type', 'grades',
            'disciplines', 'can_edit', 'can_delete',
        )


class UserWithPermissionSerializer(UserSerializer):
    permissions = serializers.SerializerMethodField()

    def check_permission(self, obj, perm):
        if perm == 'can_view_users' or perm == 'can_view_classes':
            return obj.type == User.TEACHER or obj.type == User.PARENT or obj.type == User.TUTOR or obj.has_perm(
                f"users.{perm}"
            )
        return obj.has_perm(f"users.{perm}")

    def get_permissions(self, obj):
        user = obj
        permissions_to_check = [
            'can_change_password',
            #schools
            'can_create_school',
            # 'can_edit_school',
            'can_view_school',
            # 'can_delete_school',
            #users
            'can_create_users',
            # 'can_edit_users',
            'can_view_users',
            # 'can_delete_users',
            #disciplines
            'can_create_discipline',
            'can_delete_discipline',
            #classes
            'can_create_classes',
            'can_view_classes',
            # 'can_delete_classes',
            #timetable_template
            # 'can_edit_timetable_template',
            # 'can_edit_student_list',
        ]

        user_permissions = {perm: self.check_permission(user, perm) for perm in permissions_to_check}
        return user_permissions

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'Patronymic', 'username', 'type', 'grades', 'disciplines', 'permissions'
        )
        read_only_fields = (
            'id', 'first_name', 'last_name', 'Patronymic', 'username', 'type', 'grades', 'disciplines', 'permissions'
        )


# todo тут надо добавить фильтрацию can_edit, can_create
class FullUserSerializer(PermissionFieldsMixin, serializers.ModelSerializer):
    child = serializers.SerializerMethodField()
    my_grades = serializers.SerializerMethodField()
    disciplines = serializers.SerializerMethodField()
    can_super_login = serializers.SerializerMethodField()

    edit_perm = 'users.can_edit_users'
    delete_perm = 'users.can_delete_users'

    def get_can_super_login(self, obj):
        request = self.context.get('request')
        if request and (request.user.has_perm('users.can_super_login') or is_tutor_for_user(request.user, obj)):
            return True
        return False

    def get_child(self, obj):
        if obj.type != User.PARENT:
            return []
        children = obj.child.all()
        return UserSerializer(children, many=True).data

    def get_my_grades(self, obj):
        if obj.type != User.TUTOR:
            return []
        my_grades = obj.my_grades.all()
        return SimpleGradeSerializer(my_grades, many=True).data

    def get_disciplines(self, obj):
        if obj.type != User.TEACHER:
            return []
        disciplines = obj.disciplines.all()
        return SimpleDisciplineSerializer(disciplines, many=True).data

    class Meta:
        model = User
        fields = (
            'id','first_name', 'last_name', 'Patronymic', 'email', 'username', 'type',
            'user_timezone', 'user_timezone_text', 'birthday', 'city', 'phone', 'child', 'my_grades', 'disciplines',
            'can_edit', 'can_delete', 'can_super_login',
        )


class FullUserCreateSerializer(PermissionFieldsMixin, serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    user_timezone = serializers.CharField(required=True)
    user_timezone_text = serializers.CharField(default='', allow_blank=True)
    birthday = serializers.DateField(required=True)
    child = serializers.PrimaryKeyRelatedField(
        many=True, required=False, queryset=User.objects.filter(type=User.STUDENT)
    )
    email = serializers.EmailField(required=True)
    can_super_login = serializers.SerializerMethodField(read_only=True)

    edit_perm = 'users.can_edit_users'
    delete_perm = 'users.can_delete_users'

    def get_can_super_login(self, obj):
        request = self.context.get('request')
        if request and (request.user.has_perm('users.can_super_login') or is_tutor_for_user(request.user, obj)):
            return True
        return False

    class Meta:
        model = User
        fields = (
            'id', 'first_name', 'last_name', 'Patronymic', 'email', 'username', 'type',
            'user_timezone', 'birthday', 'city', 'phone', 'child', 'user_timezone_text',
            'can_edit', 'can_delete', 'can_super_login',
        )
        read_only_fields = (
            'can_edit', 'can_delete', 'can_super_login',
        )


class UsernameSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)


class SuperLoginSerializer(serializers.Serializer):
    user = serializers.CharField(required=True)

    def validate_user(self, value):
        try:
            user = User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('User not found.')
        return user
