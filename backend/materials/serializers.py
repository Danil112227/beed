from rest_framework import serializers
from materials.models import Materials, LessonMaterials, Document
from rest_framework.exceptions import ValidationError
from users.serializers import UserSerializer
from materials.utils import DocumentSerizlizer
from timetable.serializers import LessonSerializer
from users.models import User
from timetable.models import Lesson

from utils.serializer import PermissionFieldsMixin


class MaterialsBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materials
        fields = (
            'id', 'author', 'topic', 'user', 'description', 'documents',
        )


class MaterialsSerializer(PermissionFieldsMixin, MaterialsBaseSerializer):
    author = UserSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    documents = DocumentSerizlizer(many=True, read_only=True)

    # todo проверить точно ли тут должно быть class
    edit_perm = 'users.can_edit_class'
    delete_perm = 'users.can_delete_classes'

    class Meta:
        model = Materials
        fields = (
            'id', 'author', 'topic', 'user', 'description', 'documents', 'date_added', 'can_edit', 'can_delete',
        )


class MaterialsCreateSerializer(MaterialsBaseSerializer):
    author = UserSerializer(read_only=True)
    date_added = serializers.DateTimeField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    documents = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all(), required=False, many=True)

    def validate_documents(self, value):
        request_user = self.context['request'].user
        for document in value:
            if document.author != request_user:
                raise ValidationError("Document does not belong to the user.")
        return value

    def validate_user(self, value):
        request_user = self.context['request'].user
        # todo добавить право тут проверяем право редактировать ученика
        if request_user.type != User.TEACHER:
            raise serializers.ValidationError('Only users with teacher status can set user field.')
        return value

    def create(self, validated_data):
        documents = validated_data.pop('documents', [])

        material = Materials.objects.create(**validated_data)
        for document in documents:
            material.documents.add(document)
        return material

    class Meta:
        model = Materials
        fields = (
            'id', 'author', 'topic', 'user', 'description', 'documents', 'date_added',
        )


class LessonMaterialsBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonMaterials
        fields = (
            'id', 'author', 'topic', 'lesson', 'description', 'documents',
        )


class LessonMaterialsSerializer(PermissionFieldsMixin, LessonMaterialsBaseSerializer):
    author = UserSerializer(read_only=True)
    documents = DocumentSerizlizer(many=True, read_only=True)
    lesson = LessonSerializer(read_only=True)

    edit_perm = 'users.can_edit_lesson'
    delete_perm = 'users.can_delete_lesson'

    def has_edit_perm(self, obj, request):
        if request.user.id == obj.lesson.discipline.teacher_id or request.user.id == obj.lesson.temp_teacher_id:
            return True
        return False

    def has_delete_perm(self, obj, request):
        if request.user.id == obj.lesson.discipline.teacher_id or request.user.id == obj.lesson.temp_teacher_id:
            return True
        return False

    class Meta:
        model = LessonMaterials
        fields = (
            'id', 'author', 'topic', 'lesson', 'description', 'documents', 'date_added', 'can_edit', 'can_delete'
        )


class LessonMaterialsCreateSerializer(PermissionFieldsMixin, LessonMaterialsBaseSerializer):
    author = UserSerializer(read_only=True)
    documents = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all(), many=True)
    lesson = serializers.PrimaryKeyRelatedField(queryset=Lesson.objects.all())

    edit_perm = 'users.can_edit_lesson'
    delete_perm = 'users.can_delete_lesson'

    def has_edit_perm(self, obj, request):
        if request.user.id == obj.lesson.discipline.teacher_id or request.user.id == obj.lesson.temp_teacher_id:
            return True
        return False

    def has_delete_perm(self, obj, request):
        if request.user.id == obj.lesson.discipline.teacher_id or request.user.id == obj.lesson.temp_teacher_id:
            return True
        return False
