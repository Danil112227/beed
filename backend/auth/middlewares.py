import re
import jwt
from django.contrib import auth
from django.conf import settings
from django.http import HttpResponse
from django.urls.base import resolve
from django.utils.deprecation import MiddlewareMixin


class JWTMiddleware(MiddlewareMixin):
    @staticmethod
    def process_request(request):
        secret_key = settings.HMAC_JWT_KEY
        if not secret_key:
            raise Exception('HMAC_JWT_KEY is not configured')

        setattr(request, '_dont_enforce_csrf_checks', True)
        token = request.META.get('HTTP_AUTHORIZATION')
        if not token or 'Bearer' not in token:
            return

        token = token.replace('Bearer ', '')
        try:
            token_data = jwt.decode(token, secret_key, algorithms=['HS256'])
            username = token_data['info']['username']
        except jwt.DecodeError as err:
            return
        if request.user.is_authenticated:
            if request.user.get_username() == username:
                return
            else:
                auth.logout(request)

        User = auth.get_user_model()
        defaults = {
            field: value for field, value in token_data['info'].items() if (
                field != 'username' and field in [field.name for field in User._meta.fields]
            )
        }
        user, _ = User.objects.get_or_create(username=username, defaults=defaults)
        request.user = user
        auth.login(request, user)


EXEMPT_URLS = [re.compile(expr) for expr in (
    r'^healthcheck/',
    r'^api/users/login/',
)]


class LoginRequiredMiddleware(MiddlewareMixin):
    @staticmethod
    def process_request(request):
        if not request.user.is_authenticated:
            path = request.path_info.lstrip('/')
            try:
                view_func = resolve(request.path_info).func
            except:
                view_func = None
            if not any(m.match(path) for m in EXEMPT_URLS) and (
                    view_func is None or not getattr(view_func, "login_exempt", False)
                ):
                return HttpResponse('Unauthorized', status=401)
