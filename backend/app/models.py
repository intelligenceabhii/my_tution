from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # parent, tutor, admin
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    is_active = Column(Boolean, default=True)

    tutor_profile = relationship("TutorProfile", back_populates="user", uselist=False)
    parent_requirements = relationship("ParentRequirement", back_populates="parent")


class TutorProfile(Base):
    __tablename__ = "tutor_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    qualification = Column(String, nullable=False)
    subjects = Column(JSON, nullable=False)  # JSON array
    classes_handled = Column(JSON, nullable=False)  # JSON array
    board = Column(String, nullable=False)  # JAC/CBSE/ICSE
    teaching_mode = Column(String, nullable=False)  # home/online/both
    area_in_ranchi = Column(String, nullable=True)
    expected_fee = Column(Float, nullable=True)
    experience_years = Column(Integer, default=0)
    bio = Column(Text, nullable=True)
    photo_path = Column(String, nullable=True)
    certificate_path = Column(String, nullable=True)
    is_approved = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    offers_free_trial = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="tutor_profile")
    applications = relationship("TutorApplication", back_populates="tutor")
    reviews_received = relationship("Review", back_populates="tutor", foreign_keys="Review.tutor_id")


class ParentRequirement(Base):
    __tablename__ = "parent_requirements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    child_class = Column(String, nullable=False)
    subjects_needed = Column(JSON, nullable=False)
    board = Column(String, nullable=False)
    preferred_timing = Column(String, nullable=True)
    location_area = Column(String, nullable=True)
    budget_per_month = Column(Float, nullable=True)
    teaching_mode = Column(String, nullable=False)
    special_notes = Column(Text, nullable=True)
    status = Column(String, default="open")  # open/closed
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    parent = relationship("User", back_populates="parent_requirements")
    applications = relationship("TutorApplication", back_populates="requirement")
    match_logs = relationship("AIMatchLog", back_populates="requirement")


class TutorApplication(Base):
    __tablename__ = "tutor_applications"

    id = Column(Integer, primary_key=True, index=True)
    tutor_id = Column(Integer, ForeignKey("tutor_profiles.id"), nullable=False)
    requirement_id = Column(Integer, ForeignKey("parent_requirements.id"), nullable=False)
    status = Column(String, default="pending")  # pending/accepted/rejected
    cover_note = Column(Text, nullable=True)
    applied_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    tutor = relationship("TutorProfile", back_populates="applications")
    requirement = relationship("ParentRequirement", back_populates="applications")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("tutor_profiles.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    tutor = relationship("TutorProfile", back_populates="reviews_received", foreign_keys=[tutor_id])


class AIMatchLog(Base):
    __tablename__ = "ai_match_logs"

    id = Column(Integer, primary_key=True, index=True)
    requirement_id = Column(Integer, ForeignKey("parent_requirements.id"), nullable=False)
    gemini_response = Column(Text, nullable=True)
    matched_tutor_ids = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    requirement = relationship("ParentRequirement", back_populates="match_logs")


class Favorite(Base):
    __tablename__ = "favorites"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("tutor_profiles.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user = relationship("User")
    tutor = relationship("TutorProfile")


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tutor_profile_id = Column(Integer, ForeignKey("tutor_profiles.id"), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])


class SubjectCategoryModel(Base):
    __tablename__ = "subject_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    icon = Column(String, nullable=False)
    subjects = Column(JSON, nullable=False)

class AIConfig(Base):
    __tablename__ = "ai_config"

    id = Column(Integer, primary_key=True, index=True)
    gemini_api_key = Column(String, default="")
    model_name = Column(String, default="gemini-2.0-flash")
    temperature = Column(Float, default=0.7)
    max_tokens = Column(Integer, default=2048)
    top_p = Column(Float, default=0.95)
    match_enabled = Column(Boolean, default=True)
    summarize_enabled = Column(Boolean, default=True)
    match_prompt_template = Column(Text, default="")
    summarize_prompt_template = Column(Text, default="")
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tutor_id = Column(Integer, ForeignKey("tutor_profiles.id"), nullable=False)
    reason = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
