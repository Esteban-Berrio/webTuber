import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
EXAMPLE_ENV_PATH = BASE_DIR / ".env.example"

# Cargar .env si existe; si no (ej. en Vercel donde .env está en .gitignore), usar .env.example
if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH)
elif EXAMPLE_ENV_PATH.exists():
    load_dotenv(dotenv_path=EXAMPLE_ENV_PATH)


def get_required_env(key: str) -> str:
    value = os.getenv(key)
    if value is None or value.strip() == "":
        raise RuntimeError(
            f"Variable de entorno obligatoria '{key}' no definida en .env ni en .env.example"
        )
    return value.strip()


HOST = get_required_env("HOST")
PORT = int(get_required_env("PORT"))
DEFAULT_SPEED_MS = int(get_required_env("DEFAULT_SPEED_MS"))
DEFAULT_VOLUME = float(get_required_env("DEFAULT_VOLUME"))
DEFAULT_VOICE = get_required_env("DEFAULT_VOICE")


def get_public_config() -> dict:
    return {
        "default_speed_ms": DEFAULT_SPEED_MS,
        "default_volume": DEFAULT_VOLUME,
        "default_voice": DEFAULT_VOICE,
    }
