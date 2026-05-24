from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, TutorProfile, Review
from ..schemas import ReviewCreate, ReviewResponse
from ..dependencies import get_current_user, parent_only

router = APIRouter()

@router.post("/", response_model=ReviewResponse)
def create_review(
    review_data: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Only parents can review tutors")
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    tutor = db.query(TutorProfile).filter(TutorProfile.id == review_data.tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")
    existing = db.query(Review).filter(Review.parent_id == current_user.id, Review.tutor_id == review_data.tutor_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this tutor")
    review = Review(
        parent_id=current_user.id,
        tutor_id=review_data.tutor_id,
        rating=review_data.rating,
        comment=review_data.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    all_reviews = db.query(Review).filter(Review.tutor_id == review_data.tutor_id).all()
    avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews) if all_reviews else 0
    tutor.rating = round(avg_rating, 1)
    db.commit()

    return review

@router.get("/tutors/{tutor_id}", response_model=list[ReviewResponse])
def get_tutor_reviews(tutor_id: int, db: Session = Depends(get_db)):
    return db.query(Review).filter(Review.tutor_id == tutor_id).order_by(Review.created_at.desc()).all()
