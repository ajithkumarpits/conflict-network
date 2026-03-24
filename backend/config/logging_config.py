import logging
import logging.config
import os

LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_DIR = os.path.abspath("logs")
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "detailed": {
            "format": "%(asctime)s - %(levelname)s - %(name)s - %(filename)s - %(funcName)s - %(message)s"
        },
        "simple": {
            "format": "%(levelname)s - %(message)s"
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "simple",
            "level": LOG_LEVEL,
        },
        "file": {
            "class": "logging.FileHandler",
            "formatter": "detailed",
            "filename": "logs/app.log",
            "level": LOG_LEVEL,
        },
        "error_file": {
            "class": "logging.FileHandler",
            "formatter": "detailed",
            "filename": "logs/error.log",
            "level": "ERROR",  # Only logs errors and critical issues
        },
    },
    "loggers": {
        "uvicorn": {
            "level": LOG_LEVEL,
            "handlers": ["console", "file", "error_file"],
            "propagate": False,
        },
        "fastapi": {
            "level": LOG_LEVEL,
            "handlers": ["console", "file", "error_file"],
            "propagate": False,
        },
        "app": {
            "level": LOG_LEVEL,
            "handlers": ["console", "file", "error_file"],
            "propagate": False,
        },
    },
}

def setup_logging():
    """Setup logging using the predefined configuration."""
    logging.config.dictConfig(LOGGING_CONFIG)
