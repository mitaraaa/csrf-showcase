from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from src.transactions.router import router as transactions_router
from src.users.router import router as users_router

templates = Jinja2Templates(directory="frontend/dist")

app = FastAPI()

app.include_router(users_router)
app.include_router(transactions_router)

app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")


@app.get("/logo.svg", response_class=FileResponse)
def logo():
    return FileResponse("frontend/dist/logo.svg", media_type="image/svg+xml")


@app.get(
    "/{full_path:path}",
    response_class=HTMLResponse,
    include_in_schema=False,
)
def serve(request: Request, full_path: str):
    response = templates.TemplateResponse(
        request=request, name="index.html", context={"csrf": "TODO"}
    )

    response.set_cookie(
        key="csrf",
        value="TODO",
        max_age=600,
        samesite="none",
        secure=True,
    )

    return response
