import sys
from pathlib import Path

# Asegurar que la raíz del proyecto esté en sys.path para imports en Vercel
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.main import app  # noqa: E402

# Exportar app para el entorno serverless de Vercel
__all__ = ["app"]

