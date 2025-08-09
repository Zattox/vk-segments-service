from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app.schemes import SegmentCreate, SegmentUpdate
from backend.app.models import TableSegment


def create_segment(
    session: Session,
    segment: SegmentCreate,
) -> TableSegment:
    db_segment = TableSegment(**segment.model_dump())
    session.add(db_segment)
    session.commit()
    session.refresh(db_segment)
    return db_segment


def get_segment(
    session: Session,
    segment_id: int,
) -> Optional[TableSegment]:
    return session.query(TableSegment).filter(TableSegment.id == segment_id).first()


def get_segment_by_name(
    session: Session,
    name: str,
) -> Optional[TableSegment]:
    return session.query(TableSegment).filter(TableSegment.name == name).first()


def get_segments(
    session: Session,
    skip: int = 0,
    limit: int = 100,
) -> List[TableSegment]:
    segments = session.query(TableSegment).offset(skip).limit(limit).all()
    return list(segments)


def update_segment(
    session: Session,
    segment_id: int,
    segment_update: SegmentUpdate,
) -> Optional[TableSegment]:
    db_segment = (
        session.query(TableSegment).filter(TableSegment.id == segment_id).first()
    )
    if db_segment:
        update_data = segment_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_segment, key, value)
        session.commit()
        session.refresh(db_segment)
    return db_segment


def delete_segment(
    session: Session,
    segment_id: int,
) -> None:
    db_segment = (
        session.query(TableSegment).filter(TableSegment.id == segment_id).first()
    )
    if db_segment:
        session.delete(db_segment)
        session.commit()


def get_segment_users_count(
    session: Session,
    segment_id: int,
) -> int:
    segment = get_segment(session, segment_id)
    if segment:
        return len(segment.users)
    return 0
