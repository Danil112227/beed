from rest_framework import serializers
from schools.models import Grade, School, Discipline


class SimpleSchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ('id', 'name')
        read_only_fields = ('id', 'name')


class SimpleGradeSerializer(serializers.ModelSerializer):
    school = SimpleSchoolSerializer()

    class Meta:
        model = Grade
        fields = ('id', 'name', 'school', 'year')
        read_only_fields = ('id', 'name', 'school', 'year')


class SimpleDisciplineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Discipline
        fields = ('id', 'name')
        read_only_fields = ('id', 'name')


def get_grades_for_tutor(user, queryset=None):
    # Найти все классы, в которых user tutor
    if queryset is None:
        queryset = Grade.objects.all()
    grades = queryset.filter(tutor=user).distinct()
    return grades


def get_grades_for_teacher(user, queryset=None):
    if queryset is None:
        queryset = Grade.objects.all()
    # Найти все дисциплины, которые преподает данный учитель
    disciplines = Discipline.objects.filter(teacher=user)
    # Найти все классы, в которых преподаются эти дисциплины
    grades = queryset.filter(disciplines__in=disciplines).distinct()
    return grades


def get_grades_for_student(user, queryset=None):
    if queryset is None:
        queryset = Grade.objects.all()
    # Найти все классы, в которых преподаются эти дисциплины
    grades = queryset.filter(users=user).distinct()
    return grades


def get_grades_for_parent(user, queryset=None):
    if queryset is None:
        queryset = Grade.objects.all()
    # Найти все классы, в которых преподаются эти дисциплины
    grades = queryset.filter(users__in=user.child.all()).distinct()
    return grades


def get_schools_for_tutor(user, queryset=None):
    if queryset is None:
        queryset = School.objects.all()
    grades = get_grades_for_tutor(user)
    # Найти все школы, к которым относятся эти классы
    schools = queryset.filter(grades__in=grades).distinct()
    return schools


def get_schools_for_teacher(user, queryset=None):
    if queryset is None:
        queryset = School.objects.all()
    grades = get_grades_for_teacher(user)
    # Найти все школы, к которым относятся эти классы
    schools = queryset.filter(grades__in=grades).distinct()
    return schools


def get_schools_for_student(user, queryset=None):
    if queryset is None:
        queryset = School.objects.all()
    grades = get_grades_for_student(user)
    # Найти все школы, к которым относятся эти классы
    schools = queryset.filter(grades__in=grades).distinct()
    return schools


def get_schools_for_parent(user, queryset=None):
    if queryset is None:
        queryset = School.objects.all()
    grades = get_grades_for_parent(user)
    # Найти все школы, к которым относятся эти классы
    schools = queryset.filter(grades__in=grades).distinct()
    return schools
