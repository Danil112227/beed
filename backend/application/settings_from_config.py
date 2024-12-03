from .config_setup import config_get

# Django
PROJECT_NAME = config_get('django', 'project_name', 'beed')
DEBUG = config_get('django', 'debug', False)
SECRET_KEY = config_get('django', 'secret_key', 'asd')
SITE_URL = config_get('django', 'site_url')


# Storages
DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT = (
    config_get('database', 'name'),
    config_get('database', 'user'),
    config_get('database', 'password'),
    config_get('database', 'host'),
    config_get('database', 'port'),
)

# External services
SENTRY_DSN = config_get('sentry', 'dsn')
SENTRY_ENVIRONMENT = config_get('sentry', 'env')

# Auth
HMAC_JWT_KEY = config_get('auth', 'HMAC_JWT_KEY')

#SMTP
SMTP_HOST = config_get('smtp', 'host')
SMTP_PASSWORD = config_get('auth', 'password')
