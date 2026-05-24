from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, TutorProfile, ParentRequirement, TutorApplication
from ..schemas import ApplicationCreate, ApplicationResponse, ApplicationStatusUpdate
from ..dependencies import get_current_user

router = APIRouter()

@router.post("/apply/{requirement_id}", response_model=ApplicationResponse)
def apply_to_requirement(
    requirement_id: int,
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "tutor":
        raise HTTPException(status_code=403, detail="Only tutors can apply")
    tutor = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Please complete your tutor profile first")
    if not tutor.is_approved:
        raise HTTPException(status_code=403, detail="Your profile is not yet approved by admin")
    req = db.query(ParentRequirement).filter(ParentRequirement.id == requirement_id, ParentRequirement.status == "open").first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found or closed")
    existing = db.query(TutorApplication).filter(
        TutorApplication.tutor_id == tutor.id,
        TutorApplication.requirement_id == requirement_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this requirement")
    application = TutorApplication(
        tutor_id=tutor.id,
        requirement_id=requirement_id,
        cover_note=app_data.cover_note,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return ApplicationResponse(
        id=application.id,
        tutor_id=application.tutor_id,
        requirement_id=application.requirement_id,
        status=application.status,
        cover_note=application.cover_note,
        applied_at=application.applied_at,
        tutor_name=tutor.full_name,
    )

@router.put("/applications/{application_id}/status")
def update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role not in ("parent", "admin"):
        raise HTTPException(status_code=403, detail="Only parents or admins can update application status")
    application = db.query(TutorApplication).filter(TutorApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role == "parent":
        req = db.query(ParentRequirement).filter(ParentRequirement.id == application.requirement_id).first()
        if not req or req.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not your requirement")
    if status_update.status not in ("accepted", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be 'accepted' or 'rejected'")
    application.status = status_update.status
    db.commit()
    return {"message": f"Application {status_update.status}"}

@router.get("/my-applications", response_model=list[ApplicationResponse])
def my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "tutor":
        raise HTTPException(status_code=403, detail="Only tutors can view their applications")
    tutor = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not tutor:
        return []
    applications = db.query(TutorApplication).filter(TutorApplication.tutor_id == tutor.id).order_by(TutorApplication.applied_at.desc()).all()
    result = []
    for app in applications:
        result.append(ApplicationResponse(
            id=app.id,
            tutor_id=app.tutor_id,
            requirement_id=app.requirement_id,
            status=app.status,
            cover_note=app.cover_note,
            applied_at=app.applied_at,
            tutor_name=tutor.full_name,
        ))
    return result
