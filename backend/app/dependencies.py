from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import get_db
from .auth import get_current_user_id, get_current_user_role
from .models import User

def get_current_user(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def role_guard(*allowed_roles: str):
    def checker(role: str = Depends(get_current_user_role)):
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {'/'.join(allowed_roles)}",
            )
        return role
    return checker

parent_only = role_guard("parent")
tutor_only = role_guard("tutor")
admin_only = role_guard("admin")
parent_tutor = role_guard("parent", "tutor")
