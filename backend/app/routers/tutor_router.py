import os
import shutil
from pydantic import ValidationError
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models import User, TutorProfile
from ..schemas import TutorProfileCreate, TutorProfileResponse, TutorProfileUpdate
from ..dependencies import get_current_user, tutor_only

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/{tutor_id}", response_model=TutorProfileResponse)
def get_tutor(tutor_id: int, db: Session = Depends(get_db)):
    tutor = db.query(TutorProfile).join(User, User.id == TutorProfile.user_id).filter(TutorProfile.id == tutor_id, TutorProfile.is_approved == True, User.is_active == True).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")
    return tutor

@router.put("/profile", response_model=TutorProfileResponse)
def update_tutor_profile(
    profile: TutorProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "tutor":
        raise HTTPException(status_code=403, detail="Only tutors can update profile")
    tutor = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    update_data = profile.model_dump(exclude_unset=True)
    if not tutor:
        try:
            update_data = TutorProfileCreate.model_validate(update_data).model_dump()
        except ValidationError as exc:
            raise HTTPException(status_code=422, detail=exc.errors(include_context=False, include_url=False))
        tutor = TutorProfile(user_id=current_user.id)
        db.add(tutor)
    for key, value in update_data.items():
        setattr(tutor, key, value)
    db.commit()
    db.refresh(tutor)
    return tutor

@router.post("/upload-photo")
def upload_photo(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "tutor":
        raise HTTPException(status_code=403, detail="Only tutors can upload photos")
    tutor = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Complete your profile first")
    ext = os.path.splitext(file.filename or "photo.jpg")[1]
    filename = f"tutor_{current_user.id}_photo{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)
    tutor.photo_path = f"/uploads/{filename}"
    db.commit()
    return {"photo_path": tutor.photo_path}

@router.post("/upload-certificate")
def upload_certificate(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "tutor":
        raise HTTPException(status_code=403, detail="Only tutors can upload certificates")
    tutor = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Complete your profile first")
    ext = os.path.splitext(file.filename or "cert.pdf")[1]
    filename = f"tutor_{current_user.id}_cert{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)
    tutor.certificate_path = f"/uploads/{filename}"
    db.commit()
    return {"certificate_path": tutor.certificate_path}

@router.get("/profile/mine", response_model=TutorProfileResponse)
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tutor = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Profile not found. Please create your profile first.")
    return tutor
