from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ParentRequirement, TutorApplication, TutorProfile
from ..schemas import RequirementCreate, RequirementResponse, ApplicationResponse
from ..dependencies import get_current_user, parent_only

router = APIRouter()

@router.post("/requirements", response_model=RequirementResponse)
def create_requirement(
    req: RequirementCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Only parents can post requirements")
    requirement = ParentRequirement(
        user_id=current_user.id,
        child_class=req.child_class,
        subjects_needed=req.subjects_needed,
        board=req.board,
        preferred_timing=req.preferred_timing,
        location_area=req.location_area,
        budget_per_month=req.budget_per_month,
        teaching_mode=req.teaching_mode,
        special_notes=req.special_notes,
    )
    db.add(requirement)
    db.commit()
    db.refresh(requirement)
    return requirement

@router.get("/requirements/mine", response_model=list[RequirementResponse])
def my_requirements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(ParentRequirement).filter(ParentRequirement.user_id == current_user.id).order_by(ParentRequirement.created_at.desc()).all()

@router.get("/requirements/open", response_model=list[RequirementResponse])
def open_requirements(
    db: Session = Depends(get_db),
):
    return db.query(ParentRequirement).filter(ParentRequirement.status == "open").order_by(ParentRequirement.created_at.desc()).all()

@router.get("/requirements/{requirement_id}", response_model=RequirementResponse)
def get_requirement(requirement_id: int, db: Session = Depends(get_db)):
    req = db.query(ParentRequirement).filter(ParentRequirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found")
    return req

@router.put("/requirements/{requirement_id}/close")
def close_requirement(
    requirement_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(ParentRequirement).filter(ParentRequirement.id == requirement_id, ParentRequirement.user_id == current_user.id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found")
    req.status = "closed"
    db.commit()
    return {"message": "Requirement closed"}

@router.get("/requirements/{requirement_id}/applications", response_model=list[ApplicationResponse])
def get_applications_for_requirement(
    requirement_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(ParentRequirement).filter(ParentRequirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found")
    if req.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your requirement")
    applications = db.query(TutorApplication).filter(TutorApplication.requirement_id == requirement_id).all()
    result = []
    for app in applications:
        tutor = db.query(TutorProfile).filter(TutorProfile.id == app.tutor_id).first()
        app_data = ApplicationResponse(
            id=app.id,
            tutor_id=app.tutor_id,
            requirement_id=app.requirement_id,
            status=app.status,
            cover_note=app.cover_note,
            applied_at=app.applied_at,
            tutor_name=tutor.full_name if tutor else "Unknown",
        )
        result.append(app_data)
    return result
