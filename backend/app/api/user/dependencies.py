from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.app.models import TableUser


def get_user_by_username(
    session: Session,
    username: str,
) -> TableUser:
    user = session.query(TableUser).filter(TableUser.username == username).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {username} not found",
        )

    return user
