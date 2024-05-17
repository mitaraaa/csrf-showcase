from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from src.transactions.router import router as transactions_router
from src.users.router import router as users_router

app = FastAPI()

app.include_router(users_router)
app.include_router(transactions_router)


@app.get("/login", include_in_schema=False)
def login():
    """
    Redirect to the frontend login page
    """
    return RedirectResponse("/")


app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="frontend")
