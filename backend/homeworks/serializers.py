from django.utils import timezone
from rest_framework import serializers
from materials.utils import DocumentSerizlizer
from rest_framework.exceptions import ValidationError
from users.serializers import UserSerializer
from homeworks.models import Homework, Answer, TeacherAnswer
from timetable.serializers import LessonSerializer

from materials.models import Document

from users.models import User

from utils.serializer import PermissionFieldsMixin


class HomeworkBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Homework
        fields = (
            'id', 'author', 'lesson', 'description', 'deadline', 'documents', 'type'
        )


class HomeworkSerializer(PermissionFieldsMixin, HomeworkBaseSerializer):
    lesson = LessonSerializer(read_only=True)
    author = UserSerializer(read_only=True)
    documents = DocumentSerizlizer(many=True, read_only=True)

    edit_perm = 'users.can_edit_lesson'
    delete_perm = 'users.can_delete_lesson'
    class Meta:
        model = Homework
        fields = (
            'id', 'author', 'lesson', 'description', 'deadline', 'documents', 'type', 'can_edit', 'can_delete'
        )

    def has_edit_perm(self, obj, request):
        if request.user.id == obj.lesson.discipline.teacher_id or request.user.id == obj.lesson.temp_teacher_id:
            return True
        return False

    def has_delete_perm(self, obj, request):
        if request.user.id == obj.lesson.discipline.teacher_id or request.user.id == obj.lesson.temp_teacher_id:
            return True
        return False


class HomeworkListSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    author = UserSerializer(read_only=True)
    documents = DocumentSerizlizer(many=True, read_only=True)
    status = serializers.SerializerMethodField()
    answer = serializers.SerializerMethodField()

    def get_answer(self, obj):
        return AnswerWithPermissionSerializer(obj.related_answer, context=self.context).data if hasattr(obj, "related_answer") else None

    def get_status(self, obj):
        user = self.context.get('user')
        if user and user.type == User.STUDENT or user.type == User.TEACHER:
            answer = Answer.objects.filter(homework=obj, author=user).first()
            if hasattr(obj, "related_answer"):
                answer = obj.related_answer
            status = Answer.ASSIGNED
            if obj.deadline < timezone.now().date():
                status = Answer.UNDONE
            if answer:
                status = answer.status
            return status
        return Answer.ASSIGNED  # Default status is 0 (ASSIGNED)

    class Meta:
        model = Homework
        fields = (
            'id', 'author', 'lesson', 'description', 'deadline', 'documents', 'type', 'status', 'answer'
        )


class HomeworkDetailSerializer(PermissionFieldsMixin, serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    author = UserSerializer(read_only=True)
    documents = DocumentSerizlizer(many=True, read_only=True)
    answer = serializers.SerializerMethodField()
    teacher_answer = serializers.SerializerMethodField()

    edit_perm = 'users.can_edit_lesson'
    delete_perm = 'users.can_delete_lesson'

    class Meta:
        model = Homework
        fields = (
            'id', 'author', 'lesson', 'description', 'deadline', 'documents', 'type',
            'answer', 'teacher_answer', 'can_edit', 'can_delete',
        )

    def has_edit_perm(self, obj, request):
        if request.user.id == obj.lesson.discipline.teacher_id or request.user.id == obj.lesson.temp_teacher_id:
            return True
        return False

    def has_delete_perm(self, obj, request):
        if request.user.id == obj.lesson.discipline.teacher_id or request.user.id == obj.lesson.temp_teacher_id:
            return True
        return False

    def get_answer(self, obj):
        user = self.context.get('user')
        request = self.context.get('request')
        answer = request.query_params.get('answer', None)
        if user and user.type == User.STUDENT:
            answer = Answer.objects.filter(homework=obj, author=user).first()
            return AnswerWithPermissionSerializer(answer, context=self.context).data if answer else None
        if user and user.type == User.TEACHER and answer:
            answer = Answer.objects.filter(id=answer).first()
            return AnswerWithPermissionSerializer(answer, context=self.context).data if answer else None
        return None

    def get_teacher_answer(self, obj):
        user = self.context.get('user')
        if user and user.type == User.STUDENT:
            answer = Answer.objects.filter(homework=obj, author=user).first()
            if answer:
                teacher_answer = TeacherAnswer.objects.filter(answer=answer).first()
                return TeacherAnswerPermissionSerializer(teacher_answer, context=self.context).data if teacher_answer else None
        request = self.context.get('request')
        answer = None
        if request:
            answer = request.query_params.get('answer', None)
        if user and user.type == User.TEACHER and answer:
            answer = Answer.objects.filter(id=answer).first()
            if answer:
                teacher_answer = TeacherAnswer.objects.filter(answer=answer).first()
                return TeacherAnswerPermissionSerializer(teacher_answer,
                                                         context=self.context).data if teacher_answer else None
        return None


class HomeworkCreateSerializer(HomeworkBaseSerializer):
    type = serializers.IntegerField(required=False, default=0)
    author = UserSerializer(read_only=True)
    documents = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all(), required=False, many=True)

    def validate_type(self, value):
        if value not in [0,1]:
            raise ValidationError(f"type can be only 0 or 1")
        return value

    def validate_documents(self, value):
        request_user = self.context['request'].user
        for document in value:
            if document.author != request_user:
                raise ValidationError(f"Document {document.id} does not belong to the user.")
        return value

    def create(self, validated_data):
        documents = validated_data.pop('documents', [])
        homework = Homework.objects.create(**validated_data)
        for document in documents:
            homework.documents.add(document)
        return homework


class AnswerBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = (
            'id', 'author', 'homework', 'description', 'documents', 'status'
        )


class AnswerSerializer(AnswerBaseSerializer):
    author = UserSerializer(read_only=True)
    documents = DocumentSerizlizer(many=True, read_only=True)
    homework = HomeworkSerializer()


class AnswerWithPermissionSerializer(PermissionFieldsMixin, AnswerSerializer):
    # todo дописать тут логику для can edit учеником

    edit_perm = 'users.can_edit_lesson'
    delete_perm = 'users.can_delete_lesson'

    def has_edit_perm(self, obj, request):
        if request.user.id in obj.homework.lesson.grade.tutor.values_list('id', flat=True) or request.user.id == obj.author_id:
            return True
        return False

    def has_delete_perm(self, obj, request):
        return False

    class Meta:
        model = Answer
        fields = (
            'id', 'author', 'homework', 'description', 'documents', 'status', 'can_edit', 'can_delete'
        )


class AnswerCreateSerializer(AnswerBaseSerializer):
    author = UserSerializer(read_only=True)
    documents = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all(), required=False, many=True)
    homework = serializers.PrimaryKeyRelatedField(queryset=Homework.objects.all(), required=False)
    status = serializers.IntegerField(read_only=True)

    def validate_documents(self, value):
        request_user = self.context['request'].user
        if request_user.type == User.TUTOR:
            return value
        for document in value:
            if document.author != request_user:
                raise ValidationError(f"Document {document.id} does not belong to the user.")
        return value

    def create(self, validated_data):
        documents = validated_data.pop('documents', [])
        answer = Answer.objects.create(status=Answer.UNDER_REVIEW, **validated_data)
        for document in documents:
            answer.documents.add(document)
        return answer

    def update(self, instance, validated_data):
        documents = validated_data.pop('documents', [])
        validated_data['status'] = Answer.UNDER_REVIEW
        instance = super().update(instance, validated_data)
        instance.documents.set(documents)
        return instance


class TeacherAnswerBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherAnswer
        fields = (
            'id', 'author', 'answer', 'description', 'documents',
        )


class TeacherAnswerSerializer(TeacherAnswerBaseSerializer):
    author = UserSerializer(read_only=True)
    documents = DocumentSerizlizer(many=True, read_only=True)
    answer = AnswerSerializer()


class TeacherAnswerPermissionSerializer(PermissionFieldsMixin, TeacherAnswerSerializer):

    edit_perm = 'users.can_edit_lesson'
    delete_perm = 'users.can_delete_lesson'

    def has_edit_perm(self, obj, request):
        # учтьель или временный учитель
        if request.user.id == obj.answer.homework.lesson.discipline.teacher_id or (
            request.user.id == obj.answer.homework.lesson.temp_teacher_id
        ):
            return True
        return False

    class Meta:
        model = TeacherAnswer
        fields = (
            'id', 'author', 'answer', 'description', 'documents', 'can_edit', 'can_delete',
        )


class TeacherAnswerCreateSerializer(TeacherAnswerBaseSerializer):
    author = UserSerializer(read_only=True)
    documents = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all(), required=False, many=True)
    answer = serializers.PrimaryKeyRelatedField(queryset=Answer.objects.all(), required=False)
    status = serializers.ChoiceField(choices=[0, 1, 2, 3], default=3)

    def create(self, validated_data):
        status = validated_data.pop('status', 3)
        teacher_answer = super().create(validated_data)
        teacher_answer.answer.status = status
        teacher_answer.answer.save()
        return teacher_answer

    def update(self, instance, validated_data):
        status = validated_data.pop('status', 3)
        teacher_answer = super().update(instance, validated_data)
        teacher_answer.answer.status = status
        teacher_answer.answer.save()
        return teacher_answer

    def validate_documents(self, value):
        request_user = self.context['request'].user
        # проверяем то же право, что и на редактирование ответа пользователя
        if request_user.has_perm('users.can_edit_lesson'):
            return value
        for document in value:
            if document.author != request_user:
                raise ValidationError(f"Document {document.id} does not belong to the user.")
        return value

    class Meta:
        model = TeacherAnswer
        fields = (
            'id', 'author', 'answer', 'description', 'documents', 'status'
        )
