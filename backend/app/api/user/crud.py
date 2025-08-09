from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from typing import List, Optional

from backend.app.schemes import UserCreate
from backend.app.models import TableUser, TableSegment
from .dependencies import get_user_by_username


def create_user(
    session: Session,
    user_in: UserCreate,
) -> TableUser:
    db_user = TableUser(**user_in.model_dump())
    try:
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User {user_in.username} already exists",
        )
    return db_user


def get_user(
    session: Session,
    username: str,
) -> Optional[TableUser]:
    db_user = get_user_by_username(
        session=session,
        username=username,
    )
    return db_user


def get_users(
    session: Session,
    skip: int = 0,
    limit: int = 100,
) -> List[TableUser]:
    users = session.query(TableUser).offset(skip).limit(limit).all()
    return list(users)


def get_total_users_count(
    session: Session,
) -> int:
    return session.query(TableUser).count()


def get_user_segments(
    user: TableUser,
) -> List[TableSegment]:
    return user.segments


def add_segment_to_user(
    session: Session,
    user: TableUser,
    segment: TableSegment,
) -> TableUser:
    if user and segment and segment not in user.segments:
        user.segments.append(segment)
        session.commit()

    return user


def remove_segment_from_user(
    session: Session,
    user: TableUser,
    segment: TableSegment,
) -> TableUser:
    if user and segment and segment in user.segments:
        user.segments.remove(segment)
        session.commit()

    return user
