import json
from sqlalchemy.orm import Session
from ..models import TutorProfile, ParentRequirement, AIMatchLog
from .gemini_client import generate_content

def run_ai_match(requirement_id: int, db: Session) -> dict:
    req = db.query(ParentRequirement).filter(ParentRequirement.id == requirement_id).first()
    if not req:
        raise ValueError("Requirement not found")

    tutors = db.query(TutorProfile).filter(TutorProfile.is_approved == True).all()
    if not tutors:
        return {
            "requirement_id": requirement_id,
            "matches": [],
            "message": "No approved tutors available for matching",
        }

    tutors_json = []
    for t in tutors:
        tutors_json.append({
            "tutor_id": t.id,
            "full_name": t.full_name,
            "qualification": t.qualification,
            "subjects": t.subjects,
            "classes_handled": t.classes_handled,
            "board": t.board,
            "teaching_mode": t.teaching_mode,
            "area_in_ranchi": t.area_in_ranchi or "Any",
            "expected_fee": t.expected_fee or 0,
            "experience_years": t.experience_years,
            "rating": t.rating,
        })

    system_prompt = (
        "You are an expert education consultant for Jharkhand, India. "
        "You help parents find the best home tutors for their children. "
        "Consider: subject match, class level, area proximity, fee fit, "
        "teaching mode preference, board expertise (JAC/CBSE/ICSE), "
        "tutor experience and rating. Respond ONLY in JSON."
    )

    user_prompt = f"""
Parent Requirement:
 - Child Class: {req.child_class}
 - Subjects: {req.subjects_needed}
 - Board: {req.board}
 - Area: {req.location_area or 'Any'}
 - Budget: ₹{req.budget_per_month or 'Negotiable'}/month
 - Mode: {req.teaching_mode}

Available Tutors (JSON):
{json.dumps(tutors_json, indent=2, default=str)}

Task: Rank the top 3 tutors. For each return:
{{
  'rank': 1,
  'tutor_id': ...,
  'tutor_name': ...,
  'match_score': 0-100,
  'reason': '2 sentence explanation in simple Hindi-English mix'
}}

Return ONLY a JSON array, no other text.
"""

    full_prompt = f"{system_prompt}\n\n{user_prompt}"
    raw_response = generate_content(full_prompt)

    cleaned = raw_response.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()

    try:
        matches = json.loads(cleaned)
    except json.JSONDecodeError:
        matches = [{
            "rank": 1,
            "tutor_id": 0,
            "tutor_name": "AI Parse Error",
            "match_score": 0,
            "reason": f"Could not parse AI response: {raw_response[:200]}",
        }]

    log = AIMatchLog(
        requirement_id=requirement_id,
        gemini_response=raw_response,
        matched_tutor_ids=[m.get("tutor_id") for m in matches if isinstance(m, dict)],
    )
    db.add(log)
    db.commit()

    return {
        "requirement_id": requirement_id,
        "matches": matches,
    }
