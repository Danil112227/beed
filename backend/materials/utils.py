from rest_framework import serializers
from materials.models import Document


class DocumentSerizlizer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = (
            'id', 'file', 'author'
        )
        read_only_fields = ('author', )
