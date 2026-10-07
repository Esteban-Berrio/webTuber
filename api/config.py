import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from fastapi import FastAPI
from app.config import get_public_config

app = FastAPI(title="Undertale Dialog Box Config Endpoint")


@app.get("/")
@app.get("/api/config")
@app.get("/config")
def read_config():
    return get_public_config()

