from rest_framework.exceptions import ParseError, PermissionDenied
from rest_framework.viewsets import ModelViewSet
from materials.serializers import MaterialsSerializer, LessonMaterialsSerializer, LessonMaterialsCreateSerializer, \
    MaterialsCreateSerializer
from materials.utils import DocumentSerizlizer
from materials.models import Materials, Document, LessonMaterials
from users.models import User
from utils.viewsets import SerializerByActionMixin
from utils.permissions import IsAuthorOrHasPermission


# tested
class MaterialsView(SerializerByActionMixin, ModelViewSet):
    serializer_by_action = {
        'default': MaterialsSerializer,
        'create': MaterialsCreateSerializer,
        'update': MaterialsCreateSerializer,
    }
    queryset = Materials.objects.all()
    permission_classes = [IsAuthorOrHasPermission]
    permissions = {
        "PUT": "users.can_edit_all_materials",
        "PATCH": "users.can_edit_all_materials",
        "DELETE": "users.can_delete_material",
    }

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        # todo тут надо проверять видимость
        queryset = super().get_queryset()
        if self.action == 'list':
            user_filter = self.request.query_params.get('user')
            if user_filter:
                queryset = queryset.filter(user=user_filter)

        return queryset


# todo need add delete permission
class LessonMaterialsView(SerializerByActionMixin, ModelViewSet):
    serializer_by_action = {
        'default': LessonMaterialsSerializer,
        'create': LessonMaterialsCreateSerializer,
        'update': LessonMaterialsCreateSerializer,
    }
    queryset = LessonMaterials.objects.all()
    permission_classes = [IsAuthorOrHasPermission]
    permissions = {
        "PUT": "users.can_edit_all_lesson_materials",
        "PATCH": "users.can_edit_all_lesson_materials",
        "DELETE": "users.can_delete_lesson_materials",
    }

    def get_queryset(self):
        queryset = super().get_queryset()
        lesson_param = self.request.query_params.get('lesson', None)
        if lesson_param:
            queryset = queryset.filter(lesson_id=lesson_param)

        user = self.request.user
        if user.type == User.TEACHER or user.type == User.TUTOR:
            return queryset
        if user.type == User.STUDENT:
            return queryset.filter(lesson__students=user)
        if user.type == User.PARENT:
            return LessonMaterials.objects.filter(lesson__students__in=user.child.all())
        return queryset.none()

    def perform_create(self, serializer):
        if self.request.user.type != User.TEACHER:
            raise ParseError("Only users with teacher status can set lesson material.")
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.author != self.request.user:
            raise PermissionDenied("You cannot upload documents for this material.")
        serializer.save()


# todo need add delete permission
class DocumentView(SerializerByActionMixin, ModelViewSet):
    serializer_by_action = {
        'default': DocumentSerizlizer,
    }
    queryset = Document.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

