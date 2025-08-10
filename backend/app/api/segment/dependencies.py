from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Path, Depends
from typing import Annotated
from backend.app.models import TableSegment
from backend.app import db_helper


def get_segment_by_name(
    segment_name: Annotated[str, Path],
    session: Session = Depends(db_helper.get_db),
) -> TableSegment:
    segment = (
        session.query(TableSegment).filter(TableSegment.name == segment_name).first()
    )

    if segment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Segment {segment_name} not found",
        )

    return segment
