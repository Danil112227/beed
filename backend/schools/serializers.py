from datetime import date

from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from schools.models import School, Grade, Discipline
from users.serializers import UserSerializer
from users.models import User

from schools.utils import SimpleGradeSerializer

from schools.models import SchoolPeriod

from utils.serializer import PermissionFieldsMixin


class SchoolPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolPeriod
        fields = ('id', 'start_date', 'end_date', 'type')


class SchoolSerializer(serializers.ModelSerializer):
    grades = SimpleGradeSerializer(many=True, read_only=True)

    class Meta:
        model = School
        fields = (
            'id', 'name', 'text', 'school_timezone', 'school_timezone_text', 'grades', 'email', 'first_name',
            'last_name', 'wats_app', 'description'
        )


class SchoolWithPermissionSerializer(PermissionFieldsMixin, SchoolSerializer):
    grades = SimpleGradeSerializer(many=True, read_only=True)

    edit_perm = 'users.can_edit_school'
    delete_perm = 'users.can_delete_school'

    class Meta:
        model = School
        fields = (
            'id', 'name', 'text', 'school_timezone', 'school_timezone_text', 'grades', 'email', 'first_name',
            'last_name', 'wats_app', 'description', 'can_edit', 'can_delete',
        )



class SchoolDetailSerializer(serializers.ModelSerializer):
    grades = SimpleGradeSerializer(many=True, read_only=True)
    periods = SchoolPeriodSerializer(many=True, read_only=True)

    class Meta:
        model = School
        fields = (
            'id', 'name', 'text', 'school_timezone', 'school_timezone_text', 'grades', 'periods', 'email',
            'first_name', 'last_name', 'wats_app', 'description', 'can_edit', 'can_delete',
        )


class SchoolDetailWithPermissionSerializer(PermissionFieldsMixin, SchoolDetailSerializer):
    edit_perm = 'users.can_edit_school'
    delete_perm = 'users.can_delete_school'

    class Meta:
        model = School
        fields = (
            'id', 'name', 'text', 'school_timezone', 'school_timezone_text', 'grades', 'periods', 'email',
            'first_name', 'last_name', 'wats_app', 'description', 'can_edit', 'can_delete',
        )


class SchoolUpsertSerializer(PermissionFieldsMixin, serializers.ModelSerializer):
    periods = SchoolPeriodSerializer(many=True, required=False)
    email = serializers.CharField(required=False, default='', allow_blank=True)
    first_name = serializers.CharField(required=False, default='', allow_blank=True)
    last_name = serializers.CharField(required=False, default='', allow_blank=True)
    wats_app = serializers.CharField(required=False, default='', allow_blank=True)
    school_timezone_text = serializers.CharField(required=False, default='', allow_blank=True)

    edit_perm = 'users.can_edit_school'
    delete_perm = 'users.can_delete_school'

    def create(self, validated_data):
        periods_data = validated_data.pop('periods', [])
        school = School.objects.create(**validated_data)
        for period_data in periods_data:
            if period_data['end_date'] >= date.today():
                SchoolPeriod.objects.create(school=school, **period_data)
        return school

    def update(self, instance, validated_data):
        periods_data = validated_data.pop('periods', None)

        # Call super to update the instance
        instance = super().update(instance, validated_data)

        if periods_data is not None:
            # Remove existing periods that are not in the new data
            instance.periods.filter(end_date__gte=date.today()).exclude(
                id__in=[p['id'] for p in periods_data if 'id' in p]
            ).delete()

            # Add or update periods
            for period_data in periods_data:
                if period_data['end_date'] >= date.today():
                    period_id = period_data.pop('id', None)
                    if period_id:
                        period_instance = SchoolPeriod.objects.get(id=period_id, school=instance)
                        for key, value in period_data.items():
                            setattr(period_instance, key, value)
                        period_instance.save()
                    else:
                        SchoolPeriod.objects.create(school=instance, **period_data)

        return instance

    class Meta:
        model = School
        fields = (
            'id', 'name', 'text', 'school_timezone', 'school_timezone_text', 'periods', 'email', 'first_name',
            'last_name', 'wats_app', 'description', 'can_edit', 'can_delete',
        )


class DisciplineSerializer(serializers.ModelSerializer):
    teacher = UserSerializer()

    class Meta:
        model = Discipline
        fields = (
            'id', 'name', 'teacher', 'description', 'default_link',
        )


class DisciplineCreateSerializer(serializers.ModelSerializer):
    teacher = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(type=User.TEACHER))
    grades = serializers.PrimaryKeyRelatedField(
        many=True, required=False, queryset=Grade.objects.all()
    )

    class Meta:
        model = Discipline
        fields = (
            'id', 'name', 'teacher', 'description', 'default_link', 'grades',
        )


class GradeSerializer(serializers.ModelSerializer):
    disciplines = DisciplineSerializer(many=True)
    school = SchoolSerializer(read_only=True)
    tutor = UserSerializer(many=True, required=False)
    users = UserSerializer(many=True, required=False)

    class Meta:
        model = Grade
        fields = (
            'id', 'name', 'school', 'year', 'tutor', 'users', 'disciplines', 'description'
        )


class GradeWithPermissionSerializer(PermissionFieldsMixin, GradeSerializer):
    can_create_discipline = SerializerMethodField()
    can_delete_discipline = SerializerMethodField()
    can_edit_timetable_template = SerializerMethodField()
    can_edit_student_list = SerializerMethodField()
    can_view_user_list = SerializerMethodField()

    edit_perm = 'users.can_edit_class'
    delete_perm = 'users.can_delete_classes'

    def get_can_create_discipline(self, obj):
        request = self.context.get('request')
        if request and request.user.has_perm('users.can_create_discipline'):
            return True
        return False

    def get_can_delete_discipline(self, obj):
        request = self.context.get('request')
        if request and request.user.has_perm('users.can_delete_discipline'):
            return True
        return False

    def get_can_edit_timetable_template(self, obj):
        request = self.context.get('request')
        if request and request.user.has_perm('users.can_edit_timetable_template'):
            return True
        return False

    def get_can_edit_student_list(self, obj):
        request = self.context.get('request')
        if request and request.user.has_perm('users.can_edit_student_list'):
            return True
        return False

    def get_can_view_user_list(self, obj):
        request = self.context.get('request')
        if request and (request.user.type == User.TUTOR or request.user.type == User.TEACHER):
            return True
        return False

    class Meta:
        model = Grade
        fields = (
            'id', 'name', 'school', 'year', 'tutor', 'users', 'disciplines',
            'description', 'can_create_discipline', 'can_delete_discipline',
            'can_edit_timetable_template', 'can_edit_student_list', 'can_edit', 'can_delete', 'can_view_user_list'
        )


class GradeCreateSerializer(serializers.ModelSerializer):
    school = serializers.PrimaryKeyRelatedField(queryset=School.objects.all())
    tutor = serializers.PrimaryKeyRelatedField(many=True, required=False, queryset=User.objects.filter(type=User.TUTOR))
    users = serializers.PrimaryKeyRelatedField(many=True, required=False, queryset=User.objects.filter(type=User.STUDENT))
    description = serializers.CharField(required=False, default='', allow_blank=True)

    class Meta:
        model = Grade
        fields = (
            'id', 'name', 'school', 'year', 'tutor', 'users', 'description', 'description'
        )
