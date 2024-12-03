import os

from confuse.exceptions import ConfigError, NotFoundError
from confuse import Configuration

LOCAL_CONFIG_FILE_PATH = '../.config/config.yaml'
PROJECT_NAME = 'beed'

config = Configuration(PROJECT_NAME)

if os.path.exists(LOCAL_CONFIG_FILE_PATH):
    config.set_file(LOCAL_CONFIG_FILE_PATH)


def config_get(section, option, default=None):
    """
    Get config property from config.yaml or env variable.
    Env variables should be uppercased
    and have a section name at the beginning:
    SECTION_OPTION
    """
    try:
        return os.environ[f'{PROJECT_NAME.upper()}_{section.upper()}_{option.upper()}']
    except KeyError:
        try:
            return config[section][option].get()
        except (ConfigError, NotFoundError):
            return default
