from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from typing import Optional
from ..database import get_db
from ..models import User, TutorProfile, Conversation, Message
from ..schemas import ConversationCreate, MessageCreate, MessageResponse
from ..dependencies import get_current_user

router = APIRouter()

@router.get("/users/search")
def search_users(
    q: str = Query("", min_length=1),
    limit: int = Query(10, ge=1, le=20),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    users = db.query(User).filter(
        User.email.ilike(f"%{q}%"),
        User.id != current_user.id,
    ).limit(limit).all()
    return [{"id": u.id, "email": u.email, "role": u.role} for u in users]

@router.get("/conversations")
def list_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    convos = db.query(Conversation).filter(
        Conversation.participant_ids.contains(current_user.id)
    ).order_by(desc(Conversation.last_message_at)).all()

    result = []
    for c in convos:
        other_id = [pid for pid in c.participant_ids if pid != current_user.id]
        other_user = db.query(User).filter(User.id == other_id[0]).first() if other_id else None
        last_msg = db.query(Message).filter(Message.conversation_id == c.id).order_by(desc(Message.created_at)).first()
        unread = db.query(func.count(Message.id)).filter(
            Message.conversation_id == c.id,
            Message.receiver_id == current_user.id,
            Message.is_read == False,
        ).scalar() or 0

        result.append({
            "id": c.id,
            "subject": c.subject,
            "participant_ids": c.participant_ids,
            "last_message_at": c.last_message_at,
            "created_at": c.created_at,
            "other_user_name": other_user.email.split("@")[0] if other_user else "Unknown",
            "other_user_id": other_user.id if other_user else None,
            "last_message": last_msg.message[:100] if last_msg else None,
            "unread_count": unread,
        })
    return result

@router.post("/conversations")
def create_conversation(
    req: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    receiver = db.query(User).filter(User.id == req.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="User not found")
    if receiver.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot create conversation with yourself")

    existing = db.query(Conversation).filter(
        Conversation.participant_ids.contains(current_user.id),
        Conversation.participant_ids.contains(req.receiver_id),
    ).all()
    for c in existing:
        if len(c.participant_ids) == 2 and current_user.id in c.participant_ids and req.receiver_id in c.participant_ids:
            return {"id": c.id, "existing": True}

    convo = Conversation(
        subject=req.subject,
        participant_ids=[current_user.id, req.receiver_id],
        last_message_at=None,
    )
    db.add(convo)
    db.commit()
    db.refresh(convo)
    return {"id": convo.id, "existing": False}

@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageResponse])
def get_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    convo = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if current_user.id not in convo.participant_ids:
        raise HTTPException(status_code=403, detail="Not a participant")

    msgs = db.query(Message).filter(Message.conversation_id == conversation_id).options(
        joinedload(Message.sender),
        joinedload(Message.receiver),
    ).order_by(Message.created_at.asc()).all()

    return [MessageResponse(
        id=m.id,
        conversation_id=m.conversation_id,
        sender_id=m.sender_id,
        receiver_id=m.receiver_id,
        message=m.message,
        is_read=m.is_read,
        created_at=m.created_at,
        sender_name=m.sender.email.split("@")[0] if m.sender else "Unknown",
    ) for m in msgs]

@router.post("/conversations/{conversation_id}/messages")
def send_message(
    conversation_id: int,
    msg: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    convo = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if current_user.id not in convo.participant_ids:
        raise HTTPException(status_code=403, detail="Not a participant")

    receiver_id = [pid for pid in convo.participant_ids if pid != current_user.id][0]
    message = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        receiver_id=receiver_id,
        message=msg.message,
    )
    db.add(message)
    convo.last_message_at = message.created_at
    db.commit()
    db.refresh(message)

    other = db.query(User).filter(User.id == receiver_id).first()
    return MessageResponse(
        id=message.id,
        conversation_id=message.conversation_id,
        sender_id=message.sender_id,
        receiver_id=message.receiver_id,
        message=message.message,
        is_read=message.is_read,
        created_at=message.created_at,
        sender_name=current_user.email.split("@")[0],
    )

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

@router.put("/conversations/{conversation_id}/read")
def mark_conversation_read(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.receiver_id == current_user.id,
        Message.is_read == False,
    ).update({"is_read": True})
    db.commit()
    return {"message": "All messages marked as read"}
