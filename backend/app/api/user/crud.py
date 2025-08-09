from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.schemes import UserCreate
from backend.app.models import TableUser, TableSegment

from ..segment import get_segment


def create_user(
    session: Session,
    user: UserCreate,
) -> TableUser:
    db_user = TableUser(**user.model_dump())
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user(
    session: Session,
    user_id: int,
) -> Optional[TableUser]:
    return session.query(TableUser).filter(TableUser.id == user_id).first()


def get_user_by_username(
    session: Session,
    username: str,
) -> Optional[TableUser]:
    return session.query(TableUser).filter(TableUser.username == username).first()


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
    session: Session,
    user_id: int,
) -> List[TableSegment]:
    user = get_user(session, user_id)
    if user:
        return user.segments
    return []


def add_segment_to_user(
    session: Session,
    user_id: int,
    segment_id: int,
) -> TableUser:
    user = get_user(session, user_id)
    segment = get_segment(session, segment_id)

    if user and segment and segment not in user.segments:
        user.segments.append(segment)
        session.commit()

    return user


def remove_segment_from_user(
    session: Session,
    user_id: int,
    segment_id: int,
) -> TableUser:
    user = get_user(session, user_id)
    segment = get_segment(session, segment_id)

    if user and segment and segment in user.segments:
        user.segments.remove(segment)
        session.commit()

    return user
