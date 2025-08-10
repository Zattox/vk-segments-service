from sqlalchemy.orm import Session
from typing import Annotated

from fastapi import Depends, HTTPException, status, Path

from backend.app.models import TableUser
from backend.app import db_helper


def get_user_by_username(
    username: Annotated[str, Path],
    session: Session = Depends(db_helper.get_db),
) -> TableUser:
    user = session.query(TableUser).filter(TableUser.username == username).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User {username} not found",
        )

    return user
