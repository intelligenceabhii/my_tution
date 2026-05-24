import os
import shutil
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

@router.get("/", response_model=list[TutorProfileResponse])
def list_tutors(
    subject: Optional[str] = None,
    class_level: Optional[str] = None,
    area: Optional[str] = None,
    board: Optional[str] = None,
    teaching_mode: Optional[str] = None,
    min_fee: Optional[float] = None,
    max_fee: Optional[float] = None,
    approved_only: bool = True,
    db: Session = Depends(get_db),
):
    query = db.query(TutorProfile)
    if approved_only:
        query = query.filter(TutorProfile.is_approved == True)
    if subject:
        query = query.filter(TutorProfile.subjects.astext.contains(subject))
    if class_level:
        query = query.filter(TutorProfile.classes_handled.astext.contains(class_level))
    if area:
        query = query.filter(TutorProfile.area_in_ranchi.ilike(f"%{area}%"))
    if board:
        query = query.filter(TutorProfile.board == board)
    if teaching_mode:
        query = query.filter(TutorProfile.teaching_mode == teaching_mode)
    if min_fee is not None:
        query = query.filter(TutorProfile.expected_fee >= min_fee)
    if max_fee is not None:
        query = query.filter(TutorProfile.expected_fee <= max_fee)
    return query.all()

@router.get("/{tutor_id}", response_model=TutorProfileResponse)
def get_tutor(tutor_id: int, db: Session = Depends(get_db)):
    tutor = db.query(TutorProfile).filter(TutorProfile.id == tutor_id).first()
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
    if not tutor:
        tutor = TutorProfile(user_id=current_user.id)
        db.add(tutor)
    update_data = profile.model_dump(exclude_unset=True)
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
