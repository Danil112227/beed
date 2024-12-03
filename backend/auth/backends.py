import logging
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

logger = logging.getLogger('auth')


class ModelAuthBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):
        if not password or not username:
            return None

        if settings.DEBUG or settings.TESTING:
            dev_pass = getattr(settings, 'DEV_PASSWORD', None)
            if dev_pass is None or password != dev_pass:
                return None
            try:
                return get_user_model().objects.get(username=username)
            except get_user_model().DoesNotExist:
                return None
