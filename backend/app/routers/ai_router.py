from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, ParentRequirement
from ..dependencies import get_current_user
from ..ai.match_flow import run_ai_match
from ..ai.summarize_flow import summarize_tutor_profile

router = APIRouter()

@router.post("/match/{requirement_id}")
def match_tutors(
    requirement_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(ParentRequirement).filter(ParentRequirement.id == requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found")
    if req.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your requirement")
    try:
        result = run_ai_match(requirement_id, db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI matching failed: {str(e)}")

@router.post("/summarize-tutor/{tutor_id}")
def summarize_tutor(
    tutor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        summary = summarize_tutor_profile(tutor_id, db)
        return {"tutor_id": tutor_id, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")
