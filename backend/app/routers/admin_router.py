from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models import User, TutorProfile, ParentRequirement, TutorApplication, Review, SubjectCategoryModel, AIConfig
from ..schemas import AdminStats, TutorApprovalResponse, UserAdminResponse, AdminApplicationResponse, ApplicationStatusUpdate, AdminRequirementResponse, AdminReviewResponse, SubjectCategory, CategoryCreate, CategoryUpdate, AIConfigResponse, AIConfigUpdate
from ..auth import hash_password
from ..dependencies import get_current_user, admin_only

router = APIRouter()

@router.get("/tutors/pending", response_model=list[TutorApprovalResponse])
def pending_tutors(
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    tutors = db.query(TutorProfile).filter(TutorProfile.is_approved == False).all()
    return tutors

@router.put("/tutors/{tutor_id}/approve")
def approve_tutor(
    tutor_id: int,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    tutor = db.query(TutorProfile).filter(TutorProfile.id == tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")
    tutor.is_approved = True
    db.commit()
    return {"message": "Tutor approved successfully"}

@router.get("/stats", response_model=AdminStats)
def get_stats(
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    total_users = db.query(User).count()
    total_tutors = db.query(User).filter(User.role == "tutor").count()
    total_parents = db.query(User).filter(User.role == "parent").count()
    pending_tutors = db.query(TutorProfile).filter(TutorProfile.is_approved == False).count()
    open_requirements = db.query(ParentRequirement).filter(ParentRequirement.status == "open").count()
    total_applications = db.query(TutorApplication).count()
    return AdminStats(
        total_users=total_users,
        total_tutors=total_tutors,
        total_parents=total_parents,
        pending_tutors=pending_tutors,
        open_requirements=open_requirements,
        total_applications=total_applications,
    )

@router.get("/tutors/all", response_model=list[TutorApprovalResponse])
def all_tutors(
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    return db.query(TutorProfile).order_by(TutorProfile.created_at.desc()).all()

@router.get("/users", response_model=list[UserAdminResponse])
def list_users(
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    users = db.query(User).options(joinedload(User.tutor_profile)).order_by(User.created_at.desc()).all()
    return users

@router.put("/users/{user_id}/activate")
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = True
    db.commit()
    return {"message": "User activated successfully"}

@router.put("/users/{user_id}/deactivate")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    return {"message": "User deactivated successfully"}

class CreateAdminRequest(BaseModel):
    email: str
    password: str

@router.post("/admins")
def create_admin(
    req: CreateAdminRequest,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=req.email,
        password_hash=hash_password(req.password),
        role="admin",
        is_active=True,
    )
    db.add(user)
    db.commit()
    return {"message": f"Admin created: {req.email}"}

@router.put("/tutors/{tutor_id}/decline")
def decline_tutor(
    tutor_id: int,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    tutor = db.query(TutorProfile).filter(TutorProfile.id == tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")
    user = db.query(User).filter(User.id == tutor.user_id).first()
    db.delete(tutor)
    if user:
        user.is_active = False
    db.commit()
    return {"message": "Tutor declined and user deactivated"}

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot delete admin accounts")

    tutor = db.query(TutorProfile).filter(TutorProfile.user_id == user_id).first()
    if tutor:
        db.query(Review).filter(Review.tutor_id == tutor.id).delete()
        db.query(TutorApplication).filter(TutorApplication.tutor_id == tutor.id).delete()
        db.delete(tutor)

    db.query(ParentRequirement).filter(ParentRequirement.user_id == user_id).delete()
    db.query(Review).filter(Review.parent_id == user_id).delete()
    db.delete(user)
    db.commit()
    return {"message": f"User {user.email} deleted permanently"}

@router.get("/applications", response_model=list[AdminApplicationResponse])
def list_applications(
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    apps = db.query(TutorApplication).options(
        joinedload(TutorApplication.tutor),
        joinedload(TutorApplication.requirement).joinedload(ParentRequirement.parent),
    ).order_by(TutorApplication.applied_at.desc()).all()

    result = []
    for app in apps:
        result.append(AdminApplicationResponse(
            id=app.id,
            tutor_id=app.tutor_id,
            tutor_name=app.tutor.full_name if app.tutor else "Unknown",
            requirement_id=app.requirement_id,
            requirement_subjects=app.requirement.subjects_needed if app.requirement else [],
            requirement_class=str(app.requirement.child_class) if app.requirement else "",
            requirement_board=app.requirement.board if app.requirement else "",
            parent_email=app.requirement.parent.email if app.requirement and app.requirement.parent else "Unknown",
            status=app.status,
            cover_note=app.cover_note,
            applied_at=app.applied_at,
        ))
    return result

@router.put("/applications/{application_id}/status")
def admin_update_application_status(
    application_id: int,
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    app = db.query(TutorApplication).filter(TutorApplication.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if status_update.status not in ("accepted", "rejected"):
        raise HTTPException(status_code=400, detail='Status must be "accepted" or "rejected"')
    app.status = status_update.status
    db.commit()
    return {"message": f"Application {status_update.status}"}

@router.get("/requirements", response_model=list[AdminRequirementResponse])
def list_requirements(
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    reqs = db.query(ParentRequirement).options(
        joinedload(ParentRequirement.parent),
    ).order_by(ParentRequirement.created_at.desc()).all()

    return [AdminRequirementResponse(
        id=r.id,
        parent_id=r.user_id,
        parent_email=r.parent.email if r.parent else "Unknown",
        child_class=r.child_class,
        subjects_needed=r.subjects_needed,
        board=r.board,
        teaching_mode=r.teaching_mode,
        status=r.status,
        created_at=r.created_at,
    ) for r in reqs]

@router.put("/requirements/{requirement_id}/close")
def close_requirement(
    requirement_id: int,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    req = db.query(ParentRequirement).filter(ParentRequirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found")
    req.status = "closed"
    db.commit()
    return {"message": "Requirement closed"}

@router.get("/reviews", response_model=list[AdminReviewResponse])
def list_reviews(
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    reviews = db.query(Review).options(
        joinedload(Review.tutor),
        ).order_by(Review.created_at.desc()).all()

    result = []
    for review in reviews:
        tutor = db.query(TutorProfile).filter(TutorProfile.id == review.tutor_id).first()
        parent = db.query(User).filter(User.id == review.parent_id).first()
        result.append(AdminReviewResponse(
            id=review.id,
            tutor_id=review.tutor_id,
            tutor_name=tutor.full_name if tutor else "Unknown",
            parent_email=parent.email if parent else "Unknown",
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
        ))
    return result


@router.get("/categories", response_model=list[SubjectCategory])
def list_categories(
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    cats = db.query(SubjectCategoryModel).order_by(SubjectCategoryModel.id).all()
    return cats


@router.post("/categories", response_model=SubjectCategory)
def create_category(
    cat: CategoryCreate,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    existing = db.query(SubjectCategoryModel).filter(SubjectCategoryModel.name == cat.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    db_cat = SubjectCategoryModel(name=cat.name, icon=cat.icon, subjects=cat.subjects)
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat


@router.put("/categories/{category_id}", response_model=SubjectCategory)
def update_category(
    category_id: int,
    cat: CategoryUpdate,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    db_cat = db.query(SubjectCategoryModel).filter(SubjectCategoryModel.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    if cat.name is not None:
        existing = db.query(SubjectCategoryModel).filter(SubjectCategoryModel.name == cat.name, SubjectCategoryModel.id != category_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Category name already exists")
        db_cat.name = cat.name
    if cat.icon is not None:
        db_cat.icon = cat.icon
    if cat.subjects is not None:
        db_cat.subjects = cat.subjects
    db.commit()
    db.refresh(db_cat)
    return db_cat


@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    db_cat = db.query(SubjectCategoryModel).filter(SubjectCategoryModel.id == category_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"message": "Category deleted"}

def get_or_create_ai_config(db: Session) -> AIConfig:
    config = db.query(AIConfig).first()
    if not config:
        config = AIConfig()
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

@router.get("/ai-config", response_model=AIConfigResponse)
def get_ai_config(
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    return get_or_create_ai_config(db)

@router.put("/ai-config", response_model=AIConfigResponse)
def update_ai_config(
    update: AIConfigUpdate,
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    config = get_or_create_ai_config(db)
    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(config, key, value)
    db.commit()
    db.refresh(config)
    return config

@router.post("/ai-config/test")
def test_ai_config(
    db: Session = Depends(get_db),
    _=Depends(admin_only),
):
    config = get_or_create_ai_config(db)
    api_key = config.gemini_api_key
    if not api_key:
        import os
        api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        raise HTTPException(status_code=400, detail="No API key configured. Set it in .env or via AI Settings.")
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model=config.model_name or "gemini-2.0-flash",
            contents="Respond with just: OK",
        )
        return {"status": "success", "message": response.text.strip()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"AI connection failed: {str(e)}")
