from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from timetable.models import Period, BaseLesson, MasterLesson, Lesson
from users.serializers import UserSerializer
from schools.serializers import GradeSerializer, DisciplineSerializer

from schools.models import Grade, Discipline
from users.models import User

from utils.serializer import PermissionFieldsMixin


class PeriodSerializer(serializers.ModelSerializer):
    grade = GradeSerializer(read_only=True)

    class Meta:
        model = Period
        fields = (
            'id', 'end_date', 'start_date', 'grade',
        )


class PeriodCreateSerializer(serializers.ModelSerializer):
    grade = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all())

    def validate(self, data):
        if data['end_date'] <= data['start_date']:
            raise serializers.ValidationError("The end date must be later than the start date.")
        return data

    class Meta:
        model = Period
        fields = (
            'id', 'end_date', 'start_date', 'grade',
        )


class MaterLessonBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterLesson
        fields = (
            'id', 'title', 'lesson_link', 'grade', 'discipline', 'period', 'day_of_week',
            'start_time', 'duration', 'students', 'grade'
        )


class MasterLessonSerializer(MaterLessonBaseSerializer):
    discipline = DisciplineSerializer()
    students = UserSerializer(many=True)


class MasterLessonCreateSerializer(MaterLessonBaseSerializer):
    grade = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all())
    discipline = serializers.PrimaryKeyRelatedField(queryset=Discipline.objects.all())
    students = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.filter(type=User.STUDENT))


class LessonSerializer(serializers.ModelSerializer):
    discipline = DisciplineSerializer()
    students = UserSerializer(many=True)
    lesson_template = MasterLessonSerializer(read_only=True)
    grade = GradeSerializer(read_only=True)
    temp_teacher = UserSerializer()

    class Meta:
        model = Lesson
        fields = (
            'id', 'title', 'lesson_link', 'grade', 'discipline', 'lesson_template', 'start_time',
            'end_time', 'students', 'description', 'temp_teacher',
        )


class LessonWithPermissionSerializer(PermissionFieldsMixin, serializers.ModelSerializer):
    discipline = DisciplineSerializer()
    students = UserSerializer(many=True)
    lesson_template = MasterLessonSerializer(read_only=True)
    grade = GradeSerializer(read_only=True)
    temp_teacher = UserSerializer()
    can_edit_student_list = SerializerMethodField()

    edit_perm = 'users.can_edit_lesson'
    delete_perm = 'users.can_delete_lesson'

    def has_edit_perm(self, obj, request):
        user = request.user
        if user.id == obj.discipline.teacher_id or user.id == obj.temp_teacher_id:
            return True
        return False

    def get_can_edit_student_list(self, obj):
        request = self.context.get('request')
        if request and request.user.has_perm('users.can_edit_lesson_student_list'):
            return True
        return False

    class Meta:
        model = Lesson
        fields = (
            'id', 'title', 'lesson_link', 'grade', 'discipline', 'lesson_template', 'start_time',
            'end_time', 'students', 'description', 'temp_teacher', 'can_edit_student_list', 'can_edit', 'can_delete'
        )


class LessonCreateSerializer(serializers.ModelSerializer):
    discipline = serializers.PrimaryKeyRelatedField(queryset=Discipline.objects.all())
    students = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.filter(type=User.STUDENT))
    grade = serializers.PrimaryKeyRelatedField(queryset=Grade.objects.all())
    description = serializers.CharField(required=False, default='', allow_blank=True)
    temp_teacher = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(type=User.TEACHER), allow_null=True, required=False
    )

    class Meta:
        model = Lesson
        fields = (
            'id', 'title', 'lesson_link', 'grade', 'discipline', 'start_time', 'end_time', 'students', 'description',
            'temp_teacher',
        )
