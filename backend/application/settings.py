import os
import json
import sys
from pathlib import Path
import sentry_sdk
from sentry_sdk.integrations import django, logging

import application.settings_from_config as ConfigSettings
from application.sentry import before_send

PROJECT_NAME = ConfigSettings.PROJECT_NAME

DEBUG = ConfigSettings.DEBUG

SECRET_KEY = ConfigSettings.SECRET_KEY
ROOT_URLCONF = 'application.urls'
WSGI_APPLICATION = 'application.wsgi.application'
DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'
AUTH_USER_MODEL = 'users.User'
SITE_URL = ConfigSettings.SITE_URL
BACKEND_DIR = Path(__file__).resolve().parent.parent

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    # 'auth.middlewares.JWTMiddleware',
    'auth.middlewares.LoginRequiredMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

SESSION_COOKIE_AGE = 3 * 86400
SESSION_COOKIE_HTTPONLY = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BACKEND_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

LANGUAGE_CODE = 'ru'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# docker container static directory
STATIC_DIR = BACKEND_DIR / 'static'

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    STATIC_DIR,
]
STATIC_ROOT = BACKEND_DIR / 'collected_static'

ALLOWED_HOSTS = ('*',)

try:
    build_conf = json.load(open(BACKEND_DIR / '../deploy/BUILD.json'))
    RELEASE = build_conf['version'].strip()
except:
    RELEASE = '1.0.0'

# ---------------- Auth --------------------------------

HMAC_JWT_KEY = ConfigSettings.HMAC_JWT_KEY

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# ---------------- Applications ------------------------

PROJECT_APPS = (
    'healthcheck',
    'users',
    'schools',
    'homeworks',
    'timetable',
    'materials',
)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'watchman',
]

INSTALLED_APPS += PROJECT_APPS

# ---------------- Storages ----------------------------

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': ConfigSettings.DB_NAME,
        'USER': ConfigSettings.DB_USER,
        'PASSWORD': ConfigSettings.DB_PASSWORD,
        'HOST': ConfigSettings.DB_HOST,
        'PORT': ConfigSettings.DB_PORT,
        'CONN_MAX_AGE': 0,
    }
}

# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
#         'LOCATION': 'unique-snowflake',
#     }
# }

# ---------------- Application Packages ----------------

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'PAGE_SIZE': 24,
}

WATCHMAN_CHECKS = (
    'watchman.checks.databases',
    'watchman.checks.caches',
)

# ---------------- Logging --------------------------------

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': "%(levelname)s [%(name)s:%(lineno)s] %(message)s",
            'datefmt': "%d/%b/%Y %H:%M:%S"
        },
        'django.server': {
            '()': 'django.utils.log.ServerFormatter',
            'format': '[%(server_time)s] %(message)s',
        }
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'standard'
        },
        'django.server': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'django.server',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.server': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# ---------------- SMTP settings ---------------------------

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.yandex.ru'
EMAIL_PORT = 465
EMAIL_USE_SSL = True
EMAIL_HOST_USER = ConfigSettings.SMTP_HOST
EMAIL_HOST_PASSWORD = ConfigSettings.SMTP_PASSWORD
DEFAULT_FROM_EMAIL = ConfigSettings.SMTP_HOST

# ---------------- External services ---------------------------

if ConfigSettings.SENTRY_DSN:
    sentry_sdk.init(
        dsn=ConfigSettings.SENTRY_DSN,
        release=RELEASE,
        environment=ConfigSettings.SENTRY_ENVIRONMENT,
        integrations=[django.DjangoIntegration(), logging.LoggingIntegration()],
        before_send=before_send,
    )


# ---------------- Testing ---------------------------------------

TESTING = 'test' in sys.argv

class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None


if TESTING:
    PASSWORD_HASHERS = [
        'django.contrib.auth.hashers.MD5PasswordHasher',
    ]

    SESSION_COOKIE_SECURE = False

    MIGRATION_MODULES = DisableMigrations()
    import tempfile
    import os

    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }

    MEDIA_ROOT = tempfile.mkdtemp()
    EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
    MEDIA_URL = "http://testserver/"

if DEBUG:
    REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'].append(
        'rest_framework.renderers.BrowsableAPIRenderer'
    )
