from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.schemes import SegmentCreate, SegmentUpdate
from backend.app.models import TableSegment

from .dependencies import get_segment_by_name


def create_segment(
    session: Session,
    segment_in: SegmentCreate,
) -> TableSegment:
    db_segment = TableSegment(**segment_in.model_dump())
    try:
        session.add(db_segment)
        session.commit()
        session.refresh(db_segment)
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Segment {segment_in.name} already exists",
        )

    return db_segment


def get_segment(
    session: Session,
    segment_name: str,
) -> Optional[TableSegment]:
    db_segment = get_segment_by_name(
        session=session,
        segment_name=segment_name,
    )
    return db_segment


def get_segments(
    session: Session,
    skip: int = 0,
    limit: int = 100,
) -> List[TableSegment]:
    segments = session.query(TableSegment).offset(skip).limit(limit).all()
    return list(segments)


def update_segment(
    session: Session,
    segment: TableSegment,
    segment_update: SegmentUpdate,
) -> TableSegment:
    for class_field, value in segment_update.model_dump(exclude_unset=True).items():
        setattr(segment, class_field, value)
    session.commit()
    session.refresh(segment)
    return segment


def delete_segment(
    session: Session,
    segment: TableSegment,
) -> None:
    session.delete(segment)
    session.commit()


def get_segment_users_count(
    db_segment: TableSegment,
) -> int:
    return len(db_segment.users)
