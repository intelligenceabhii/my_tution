import json
from sqlalchemy.orm import Session
from ..models import TutorProfile
from .gemini_client import generate_content, is_summarize_enabled, get_summarize_prompt_template

def summarize_tutor_profile(tutor_id: int, db: Session) -> str:
    if not is_summarize_enabled():
        return "AI summary is currently disabled by admin."

    tutor = db.query(TutorProfile).filter(TutorProfile.id == tutor_id).first()
    if not tutor:
        raise ValueError("Tutor not found")

    custom_template = get_summarize_prompt_template()
    if custom_template:
        prompt = custom_template.format(
            tutor_name=tutor.full_name,
            tutor_qualification=tutor.qualification,
            tutor_subjects=', '.join(tutor.subjects) if tutor.subjects else 'N/A',
            tutor_classes=', '.join(tutor.classes_handled) if tutor.classes_handled else 'N/A',
            tutor_board=tutor.board,
            tutor_mode=tutor.teaching_mode,
            tutor_area=tutor.area_in_ranchi or 'Any',
            tutor_fee=tutor.expected_fee or 'Negotiable',
            tutor_experience=tutor.experience_years,
            tutor_rating=tutor.rating,
        )
    else:
        prompt = f"""
You are an expert education consultant. Summarize the following tutor profile in exactly 3 lines for a parent's quick view.
Keep it friendly, informative, and in simple Hindi-English mix.

Tutor Profile:
- Name: {tutor.full_name}
- Qualification: {tutor.qualification}
- Subjects: {', '.join(tutor.subjects) if tutor.subjects else 'N/A'}
- Classes: {', '.join(tutor.classes_handled) if tutor.classes_handled else 'N/A'}
- Board: {tutor.board}
- Teaching Mode: {tutor.teaching_mode}
- Area: {tutor.area_in_ranchi or 'Any'}
- Fee: ₹{tutor.expected_fee or 'Negotiable'}
- Experience: {tutor.experience_years} years
- Rating: {tutor.rating}/5

Return ONLY the 3-line summary, no other text.
"""
    return generate_content(prompt).strip()
