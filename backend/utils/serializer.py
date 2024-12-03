from rest_framework import serializers


class PermissionFieldsMixin(serializers.Serializer):
    can_edit = serializers.SerializerMethodField()
    can_delete = serializers.SerializerMethodField()

    def has_edit_perm(self, obj, request):
        return False

    def has_delete_perm(self, obj, request):
        return False

    def get_can_edit(self, obj):
        request = self.context.get('request')
        if self.has_edit_perm(obj, request) or (request and request.user.has_perm(self.edit_perm)):
            return True
        return False

    def get_can_delete(self, obj):
        request = self.context.get('request')
        if self.has_delete_perm(obj, request) or (request and request.user.has_perm(self.delete_perm)):
            return True
        return False
