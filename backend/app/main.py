import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import engine, Base
from .routers import auth_router, tutor_router, parent_router, application_router, admin_router, ai_router, review_router, public_router, message_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="MY Tuition API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.include_router(auth_router.router, prefix="/api/auth", tags=["auth"])
app.include_router(tutor_router.router, prefix="/api/tutors", tags=["tutors"])
app.include_router(parent_router.router, prefix="/api/parents", tags=["parents"])
app.include_router(application_router.router, prefix="/api", tags=["applications"])
app.include_router(admin_router.router, prefix="/api/admin", tags=["admin"])
app.include_router(ai_router.router, prefix="/api/ai", tags=["ai"])
app.include_router(review_router.router, prefix="/api/reviews", tags=["reviews"])
app.include_router(public_router.router, prefix="/api", tags=["public"])
app.include_router(message_router.router, prefix="/api", tags=["messages"])

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}
