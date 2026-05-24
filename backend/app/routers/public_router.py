from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional
from ..database import get_db
from ..models import User, TutorProfile, Favorite, Message, Review, Report, SubjectCategoryModel
from ..schemas import TutorBrowseResponse, FavoriteResponse, MessageCreate, MessageResponse, ReportCreate, SubjectCategory
from ..dependencies import get_current_user

router = APIRouter()

SUBJECT_CATEGORIES = [
    SubjectCategory(name="Academic Tutoring", icon="📚", subjects=["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Sanskrit", "History", "Geography", "Political Science", "Economics", "Computer Science", "Accountancy", "Business Studies"]),
    SubjectCategory(name="Languages", icon="🌐", subjects=["English Speaking", "French", "German", "Spanish", "Japanese", "Mandarin", "Sanskrit", "Tamil", "Telugu", "Bengali", "Marathi"]),
    SubjectCategory(name="Science & Technology", icon="🔬", subjects=["Physics", "Chemistry", "Biology", "Computer Science", "Python", "Java", "Web Development", "AI & Machine Learning", "Robotics"]),
    SubjectCategory(name="Arts & Music", icon="🎨", subjects=["Drawing", "Painting", "Guitar", "Piano", "Violin", "Singing", "Dance", "Flute", "Music Theory"]),
    SubjectCategory(name="Sports & Fitness", icon="🏏", subjects=["Cricket", "Badminton", "Chess", "Yoga", "Swimming", "Martial Arts", "Meditation"]),
    SubjectCategory(name="Professional Skills", icon="💼", subjects=["Public Speaking", "Life Coaching", "Personality Development", "Microsoft Excel", "Digital Marketing", "Graphic Design", "Video Editing"]),
    SubjectCategory(name="Test Preparation", icon="🎯", subjects=["JEE", "NEET", "UPSC", "Bank PO", "SSC", "GATE", "IELTS", "TOEFL", "SAT", "GMAT"]),
]

@router.get("/categories", response_model=list[SubjectCategory])
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(SubjectCategoryModel).all()
    if not cats:
        for sc in SUBJECT_CATEGORIES:
            db.add(SubjectCategoryModel(name=sc.name, icon=sc.icon, subjects=sc.subjects))
        db.commit()
        cats = db.query(SubjectCategoryModel).all()
    return cats

@router.get("/tutors", response_model=list[TutorBrowseResponse])
def browse_tutors(
    subject: Optional[str] = None,
    board: Optional[str] = None,
    teaching_mode: Optional[str] = None,
    area: Optional[str] = None,
    min_fee: Optional[float] = None,
    max_fee: Optional[float] = None,
    min_rating: Optional[float] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "rating",
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(TutorProfile).filter(TutorProfile.is_approved == True)

    if subject:
        query = query.filter(TutorProfile.subjects.astext.contains(subject))
    if board:
        query = query.filter(TutorProfile.board == board)
    if teaching_mode:
        query = query.filter(TutorProfile.teaching_mode == teaching_mode)
    if area:
        query = query.filter(TutorProfile.area_in_ranchi.ilike(f"%{area}%"))
    if min_fee is not None:
        query = query.filter(TutorProfile.expected_fee >= min_fee)
    if max_fee is not None:
        query = query.filter(TutorProfile.expected_fee <= max_fee)
    if min_rating is not None:
        query = query.filter(TutorProfile.rating >= min_rating)
    if search:
        query = query.filter(
            TutorProfile.full_name.ilike(f"%{search}%") |
            TutorProfile.bio.ilike(f"%{search}%") |
            TutorProfile.subjects.astext.ilike(f"%{search}%")
        )

    if sort == "fee_low":
        query = query.order_by(TutorProfile.expected_fee.asc())
    elif sort == "fee_high":
        query = query.order_by(TutorProfile.expected_fee.desc())
    elif sort == "experience":
        query = query.order_by(TutorProfile.experience_years.desc())
    elif sort == "newest":
        query = query.order_by(TutorProfile.created_at.desc())
    else:
        query = query.order_by(TutorProfile.rating.desc())

    total = query.count()
    tutors = query.offset(skip).limit(limit).all()

    result = []
    for t in tutors:
        review_count = db.query(func.count(Review.id)).filter(Review.tutor_id == t.id).scalar() or 0
        result.append(TutorBrowseResponse(
            id=t.id,
            full_name=t.full_name,
            qualification=t.qualification,
            subjects=t.subjects or [],
            classes_handled=t.classes_handled or [],
            board=t.board,
            teaching_mode=t.teaching_mode,
            area_in_ranchi=t.area_in_ranchi,
            expected_fee=t.expected_fee,
            experience_years=t.experience_years or 0,
            bio=t.bio,
            photo_path=t.photo_path,
            is_approved=t.is_approved,
            rating=t.rating or 0.0,
            is_verified=getattr(t, 'is_verified', False),
            offers_free_trial=getattr(t, 'offers_free_trial', False),
            review_count=review_count,
            created_at=t.created_at,
        ))
    return result

@router.get("/tutors/{tutor_id}", response_model=TutorBrowseResponse)
def get_tutor_detail(
    tutor_id: int,
    db: Session = Depends(get_db),
):
    t = db.query(TutorProfile).filter(TutorProfile.id == tutor_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Tutor not found")
    review_count = db.query(func.count(Review.id)).filter(Review.tutor_id == t.id).scalar() or 0
    return TutorBrowseResponse(
        id=t.id,
        full_name=t.full_name,
        qualification=t.qualification,
        subjects=t.subjects or [],
        classes_handled=t.classes_handled or [],
        board=t.board,
        teaching_mode=t.teaching_mode,
        area_in_ranchi=t.area_in_ranchi,
        expected_fee=t.expected_fee,
        experience_years=t.experience_years or 0,
        bio=t.bio,
        photo_path=t.photo_path,
        is_approved=t.is_approved,
        rating=t.rating or 0.0,
        is_verified=getattr(t, 'is_verified', False),
        offers_free_trial=getattr(t, 'offers_free_trial', False),
        review_count=review_count,
        created_at=t.created_at,
    )

@router.post("/favorites/{tutor_id}")
def add_favorite(
    tutor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.tutor_id == tutor_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    fav = Favorite(user_id=current_user.id, tutor_id=tutor_id)
    db.add(fav)
    db.commit()
    return {"message": "Added to favorites"}

@router.delete("/favorites/{tutor_id}")
def remove_favorite(
    tutor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    fav = db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.tutor_id == tutor_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Not in favorites")
    db.delete(fav)
    db.commit()
    return {"message": "Removed from favorites"}

@router.get("/favorites", response_model=list[FavoriteResponse])
def list_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    favs = db.query(Favorite).filter(Favorite.user_id == current_user.id).options(
        joinedload(Favorite.tutor)
    ).order_by(Favorite.created_at.desc()).all()
    return favs

@router.get("/favorites/check/{tutor_id}")
def check_favorite(
    tutor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    fav = db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.tutor_id == tutor_id).first()
    return {"is_favorite": fav is not None}

@router.post("/messages")
def send_message(
    msg: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = Message(
        sender_id=current_user.id,
        receiver_id=msg.receiver_id,
        tutor_profile_id=msg.tutor_profile_id,
        message=msg.message,
    )
    db.add(message)
    db.commit()
    return {"message": "Message sent"}

@router.get("/messages", response_model=list[MessageResponse])
def list_messages(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    msgs = db.query(Message).filter(
        (Message.sender_id == current_user.id) | (Message.receiver_id == current_user.id)
    ).options(
        joinedload(Message.sender),
        joinedload(Message.receiver),
    ).order_by(Message.created_at.desc()).all()

    result = []
    for m in msgs:
        other = m.sender if m.receiver_id == current_user.id else m.receiver
        result.append(MessageResponse(
            id=m.id,
            sender_id=m.sender_id,
            receiver_id=m.receiver_id,
            message=m.message,
            is_read=m.is_read,
            created_at=m.created_at,
            sender_name=other.email if other else "Unknown",
        ))
    return result

@router.put("/messages/{message_id}/read")
def mark_read(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    msg = db.query(Message).filter(Message.id == message_id, Message.receiver_id == current_user.id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found")
    msg.is_read = True
    db.commit()
    return {"message": "Marked as read"}

@router.post("/reports")
def report_tutor(
    report: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    r = Report(reporter_id=current_user.id, tutor_id=report.tutor_id, reason=report.reason, description=report.description)
    db.add(r)
    db.commit()
    return {"message": "Report submitted"}
