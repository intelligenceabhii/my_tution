from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---

class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str  # parent, tutor, admin
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Tutor Profile Schemas ---

class TutorProfileCreate(BaseModel):
    full_name: str
    qualification: str
    subjects: List[str]
    classes_handled: List[str]
    board: str
    teaching_mode: str
    area_in_ranchi: Optional[str] = None
    expected_fee: Optional[float] = None
    experience_years: Optional[int] = 0
    bio: Optional[str] = None

class TutorProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    qualification: str
    subjects: List[str]
    classes_handled: List[str]
    board: str
    teaching_mode: str
    area_in_ranchi: Optional[str] = None
    expected_fee: Optional[float] = None
    experience_years: Optional[int] = 0
    bio: Optional[str] = None
    photo_path: Optional[str] = None
    certificate_path: Optional[str] = None
    is_approved: bool
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True

class TutorProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    qualification: Optional[str] = None
    subjects: Optional[List[str]] = None
    classes_handled: Optional[List[str]] = None
    board: Optional[str] = None
    teaching_mode: Optional[str] = None
    area_in_ranchi: Optional[str] = None
    expected_fee: Optional[float] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None

# --- Parent Requirement Schemas ---

class RequirementCreate(BaseModel):
    child_class: str
    subjects_needed: List[str]
    board: str
    preferred_timing: Optional[str] = None
    location_area: Optional[str] = None
    budget_per_month: Optional[float] = None
    teaching_mode: str
    special_notes: Optional[str] = None

class RequirementResponse(BaseModel):
    id: int
    user_id: int
    child_class: str
    subjects_needed: List[str]
    board: str
    preferred_timing: Optional[str] = None
    location_area: Optional[str] = None
    budget_per_month: Optional[float] = None
    teaching_mode: str
    special_notes: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Application Schemas ---

class ApplicationCreate(BaseModel):
    cover_note: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    tutor_id: int
    requirement_id: int
    status: str
    cover_note: Optional[str] = None
    applied_at: datetime
    tutor_name: Optional[str] = None

    class Config:
        from_attributes = True

class ApplicationStatusUpdate(BaseModel):
    status: str  # accepted/rejected

# --- Review Schemas ---

class ReviewCreate(BaseModel):
    tutor_id: int
    rating: int  # 1-5
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    parent_id: int
    tutor_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- AI Schemas ---

class AIMatchResult(BaseModel):
    rank: int
    tutor_id: int
    tutor_name: str
    match_score: int
    reason: str

class AIMatchResponse(BaseModel):
    requirement_id: int
    matches: List[AIMatchResult]

class AISummarizeResponse(BaseModel):
    tutor_id: int
    summary: str

class TutorBrowseResponse(BaseModel):
    id: int
    full_name: str
    qualification: str
    subjects: List[str]
    classes_handled: List[str]
    board: str
    teaching_mode: str
    area_in_ranchi: Optional[str] = None
    expected_fee: Optional[float] = None
    experience_years: int = 0
    bio: Optional[str] = None
    photo_path: Optional[str] = None
    is_approved: bool
    rating: float
    is_verified: bool = False
    offers_free_trial: bool = False
    review_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class FavoriteResponse(BaseModel):
    id: int
    tutor_id: int
    tutor: Optional[TutorBrowseResponse] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationCreate(BaseModel):
    receiver_id: int
    subject: Optional[str] = None

class ConversationResponse(BaseModel):
    id: int
    subject: Optional[str] = None
    participant_ids: List[int]
    last_message_at: Optional[datetime] = None
    created_at: datetime
    other_user_name: Optional[str] = None
    last_message: Optional[str] = None
    unread_count: int = 0

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    conversation_id: int
    message: str


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    receiver_id: int
    message: str
    is_read: bool
    created_at: datetime
    sender_name: Optional[str] = None

    class Config:
        from_attributes = True


class ReportCreate(BaseModel):
    tutor_id: int
    reason: str
    description: Optional[str] = None


class SubjectCategory(BaseModel):
    id: Optional[int] = None
    name: str
    icon: str
    subjects: List[str]

class CategoryCreate(BaseModel):
    name: str
    icon: str
    subjects: List[str]

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    subjects: Optional[List[str]] = None


class LearningSessionCreate(BaseModel):
    requirement_id: int
    subject: str
    topics_covered: List[str]
    notes: Optional[str] = None
    duration_minutes: Optional[int] = None

class LearningSessionResponse(BaseModel):
    id: int
    requirement_id: int
    tutor_id: int
    subject: str
    topics_covered: List[str]
    notes: Optional[str] = None
    duration_minutes: Optional[int] = None
    session_date: datetime
    created_at: datetime
    tutor_name: Optional[str] = None
    tutor_qualification: Optional[str] = None

    class Config:
        from_attributes = True

class DoubtRequest(BaseModel):
    requirement_id: int
    question: str
    subject: Optional[str] = None

class DoubtResponse(BaseModel):
    id: int
    question: str
    answer: Optional[str] = None
    context_topics: Optional[List[str]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AIConfigResponse(BaseModel):
    id: int
    ai_provider: str = "gemini"
    gemini_api_key: str = ""
    model_name: str = "gemini-2.0-flash"
    groq_api_key: str = ""
    groq_model: str = "llama3-70b-8192"
    temperature: float = 0.7
    max_tokens: int = 2048
    top_p: float = 0.95
    match_enabled: bool = True
    summarize_enabled: bool = True
    match_prompt_template: str = ""
    summarize_prompt_template: str = ""
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AIConfigUpdate(BaseModel):
    ai_provider: Optional[str] = None
    gemini_api_key: Optional[str] = None
    model_name: Optional[str] = None
    groq_api_key: Optional[str] = None
    groq_model: Optional[str] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None
    top_p: Optional[float] = None
    match_enabled: Optional[bool] = None
    summarize_enabled: Optional[bool] = None
    match_prompt_template: Optional[str] = None
    summarize_prompt_template: Optional[str] = None

# --- Admin Schemas ---

class AdminStats(BaseModel):
    total_users: int
    total_tutors: int
    total_parents: int
    pending_tutors: int
    open_requirements: int
    total_applications: int

class TutorApprovalResponse(BaseModel):
    id: int
    full_name: str
    qualification: str
    subjects: List[str]
    board: str
    teaching_mode: str
    is_approved: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserAdminResponse(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    created_at: datetime
    tutor_profile: Optional[TutorApprovalResponse] = None

    class Config:
        from_attributes = True

class AdminApplicationResponse(BaseModel):
    id: int
    tutor_id: int
    tutor_name: str
    requirement_id: int
    requirement_subjects: List[str]
    requirement_class: str
    requirement_board: str
    parent_email: str
    status: str
    cover_note: Optional[str] = None
    applied_at: datetime

    class Config:
        from_attributes = True


class AdminRequirementResponse(BaseModel):
    id: int
    parent_id: int
    parent_email: str
    child_class: str
    subjects_needed: List[str]
    board: str
    teaching_mode: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class AdminReviewResponse(BaseModel):
    id: int
    tutor_id: int
    tutor_name: str
    parent_email: str
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
