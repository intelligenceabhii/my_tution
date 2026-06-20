from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from typing import Optional
from ..database import get_db
from ..models import User, TutorProfile, ParentRequirement, TutorApplication, LearningSession, DoubtQuery
from ..schemas import LearningSessionCreate, LearningSessionResponse, DoubtRequest, DoubtResponse
from ..dependencies import get_current_user
from ..ai.ai_client import generate_content

router = APIRouter()

@router.post("/sessions", response_model=LearningSessionResponse)
def log_session(
    session: LearningSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "tutor":
        raise HTTPException(status_code=403, detail="Only tutors can log sessions")
    tutor = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor profile not found")
    req = db.query(ParentRequirement).filter(ParentRequirement.id == session.requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found")
    app = db.query(TutorApplication).filter(
        TutorApplication.tutor_id == tutor.id,
        TutorApplication.requirement_id == session.requirement_id,
        TutorApplication.status == "accepted",
    ).first()
    if not app:
        raise HTTPException(status_code=403, detail="You are not the approved tutor for this requirement")

    db_session = LearningSession(
        requirement_id=session.requirement_id,
        tutor_id=tutor.id,
        subject=session.subject,
        topics_covered=session.topics_covered,
        notes=session.notes,
        duration_minutes=session.duration_minutes,
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return LearningSessionResponse(
        id=db_session.id,
        requirement_id=db_session.requirement_id,
        tutor_id=db_session.tutor_id,
        subject=db_session.subject,
        topics_covered=db_session.topics_covered,
        notes=db_session.notes,
        duration_minutes=db_session.duration_minutes,
        session_date=db_session.session_date,
        created_at=db_session.created_at,
        tutor_name=tutor.full_name,
        tutor_qualification=tutor.qualification,
    )

@router.get("/sessions", response_model=list[LearningSessionResponse])
def list_sessions(
    requirement_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(LearningSession).options(
        joinedload(LearningSession.tutor_profile),
        joinedload(LearningSession.requirement),
    )

    if current_user.role == "parent":
        reqs = db.query(ParentRequirement).filter(ParentRequirement.user_id == current_user.id).all()
        req_ids = [r.id for r in reqs]
        query = query.filter(LearningSession.requirement_id.in_(req_ids))
    elif current_user.role == "tutor":
        tutor = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
        if not tutor:
            return []
        query = query.filter(LearningSession.tutor_id == tutor.id)
    elif current_user.role != "admin":
        return []

    if requirement_id:
        query = query.filter(LearningSession.requirement_id == requirement_id)

    sessions = query.order_by(desc(LearningSession.session_date)).all()
    return [LearningSessionResponse(
        id=s.id,
        requirement_id=s.requirement_id,
        tutor_id=s.tutor_id,
        subject=s.subject,
        topics_covered=s.topics_covered,
        notes=s.notes,
        duration_minutes=s.duration_minutes,
        session_date=s.session_date,
        created_at=s.created_at,
        tutor_name=s.tutor_profile.full_name if s.tutor_profile else "Unknown",
        tutor_qualification=s.tutor_profile.qualification if s.tutor_profile else "",
    ) for s in sessions]


@router.get("/sessions/recent-context")
def get_recent_context(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Only parents can view learning context")
    reqs = db.query(ParentRequirement).filter(ParentRequirement.user_id == current_user.id).all()
    if not reqs:
        return {"subjects": [], "recent_topics": [], "child_class": "", "board": ""}
    req = reqs[0]
    sessions = db.query(LearningSession).filter(
        LearningSession.requirement_id == req.id
    ).order_by(desc(LearningSession.session_date)).limit(5).all()

    recent_topics = []
    for s in sessions:
        recent_topics.extend(s.topics_covered or [])

    return {
        "subjects": req.subjects_needed,
        "child_class": req.child_class,
        "board": req.board,
        "recent_topics": list(set(recent_topics)),
    }


@router.post("/doubt", response_model=DoubtResponse)
def ask_doubt(
    doubt: DoubtRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(ParentRequirement).filter(ParentRequirement.id == doubt.requirement_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found")
    if req.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your requirement")

    sessions = db.query(LearningSession).filter(
        LearningSession.requirement_id == doubt.requirement_id
    ).order_by(desc(LearningSession.session_date)).limit(10).all()

    context_topics = []
    for s in sessions:
        context_topics.extend(s.topics_covered or [])

    subject_context = doubt.subject or (req.subjects_needed[0] if req.subjects_needed else "General")
    topics_str = ", ".join(list(set(context_topics))) if context_topics else "various topics"

    prompt = f"""You are MeritAI, an AI learning assistant for MY Tuition. A student is studying the following:

- Class: {req.child_class}
- Board: {req.board}
- Subject: {subject_context}
- Topics recently covered: {topics_str}

The student asks: {doubt.question}

Answer in a clear, helpful, and age-appropriate manner. Include examples where helpful. Keep it concise but thorough."""

    try:
        answer = generate_content(prompt)
    except Exception as e:
        answer = f"I couldn't process your question right now. Error: {str(e)}"

    dq = DoubtQuery(
        requirement_id=doubt.requirement_id,
        user_id=current_user.id,
        subject=doubt.subject,
        question=doubt.question,
        answer=answer,
        context_topics=list(set(context_topics)),
    )
    db.add(dq)
    db.commit()
    db.refresh(dq)

    return DoubtResponse(
        id=dq.id,
        question=dq.question,
        answer=dq.answer,
        context_topics=dq.context_topics,
        created_at=dq.created_at,
    )


@router.get("/doubt-history", response_model=list[DoubtResponse])
def doubt_history(
    requirement_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(DoubtQuery)

    if current_user.role == "parent":
        reqs = db.query(ParentRequirement).filter(ParentRequirement.user_id == current_user.id).all()
        req_ids = [r.id for r in reqs]
        query = query.filter(DoubtQuery.requirement_id.in_(req_ids))
    elif current_user.role == "admin":
        pass
    else:
        return []

    if requirement_id:
        query = query.filter(DoubtQuery.requirement_id == requirement_id)

    doubts = query.order_by(desc(DoubtQuery.created_at)).all()
    return [DoubtResponse(
        id=d.id,
        question=d.question,
        answer=d.answer,
        context_topics=d.context_topics,
        created_at=d.created_at,
    ) for d in doubts]


@router.get("/tutor/my-accepted-requirements")
def tutor_accepted_requirements(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "tutor":
        raise HTTPException(status_code=403, detail="Only tutors")
    tutor = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not tutor:
        return []
    apps = db.query(TutorApplication).filter(
        TutorApplication.tutor_id == tutor.id,
        TutorApplication.status == "accepted",
    ).options(
        joinedload(TutorApplication.requirement).joinedload(ParentRequirement.parent),
    ).all()
    return [{
        "id": a.requirement.id,
        "child_class": a.requirement.child_class,
        "subjects_needed": a.requirement.subjects_needed,
        "board": a.requirement.board,
        "parent_email": a.requirement.parent.email if a.requirement.parent else "Unknown",
    } for a in apps]
