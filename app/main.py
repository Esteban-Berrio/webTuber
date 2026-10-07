from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.config import HOST, PORT, get_public_config

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"

app = FastAPI(title="Undertale Dialog Box")

# Montar estáticos tanto para la raíz como para el prefijo /api que usa Vercel
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/api/static", StaticFiles(directory=str(STATIC_DIR)), name="api_static")


def serve_index_html() -> HTMLResponse:
    index_file = TEMPLATES_DIR / "index.html"
    return HTMLResponse(content=index_file.read_text(encoding="utf-8"))


@app.get("/")
@app.get("/api")
@app.get("/api/")
@app.get("/api/index")
@app.get("/api/index.py")
async def serve_index():
    return serve_index_html()


@app.get("/api/config")
@app.get("/config")
async def get_config():
    return get_public_config()


@app.exception_handler(404)
async def not_found_fallback(request: Request, exc):
    path = request.url.path
    if "config" in path:
        return get_public_config()
    if "/static/" in path:
        relative = path.split("/static/")[-1]
        static_file = STATIC_DIR / relative
        if static_file.exists():
            return FileResponse(str(static_file))
    return serve_index_html()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
