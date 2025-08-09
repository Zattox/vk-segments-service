from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.app.models import TableSegment


def get_segment_by_name(
    session: Session,
    name: str,
) -> TableSegment:
    segment = session.query(TableSegment).filter(TableSegment.name == name).first()

    if segment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Segment {name} not found",
        )

    return segment
