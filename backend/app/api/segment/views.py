from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from . import crud, dependencies
from ..utils import distribute_segment_randomly

from backend.app.schemes import (
    ResponseSegment,
    SegmentUpdate,
    SegmentCreate,
    DistributionResult,
)

from backend.app.database import get_db
from backend.app.models import TableSegment

router = APIRouter(prefix="/segments", tags=["segments"])


def table_to_response_form(
    segment: TableSegment,
) -> ResponseSegment:
    result = ResponseSegment(
        name=segment.name,
        description=segment.description,
        is_active=segment.is_active,
        created_at=segment.created_at,
        updated_at=segment.updated_at,
        users=[],
    )

    result.users = [user.username for user in segment.users]

    return result


@router.post(
    "/",
    response_model=ResponseSegment,
    status_code=status.HTTP_201_CREATED,
)
def create_segment(
    segment_in: SegmentCreate,
    session: Session = Depends(get_db),
) -> ResponseSegment:
    segment = crud.create_segment(
        session=session,
        segment_in=segment_in,
    )
    return table_to_response_form(segment)


@router.get(
    "/",
    response_model=List[ResponseSegment],
    status_code=status.HTTP_200_OK,
)
def get_segments(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_db),
) -> List[ResponseSegment]:
    segments = crud.get_segments(
        session=session,
        skip=skip,
        limit=limit,
    )
    return [table_to_response_form(segment) for segment in segments]


@router.get(
    "/{segment_id}",
    response_model=ResponseSegment,
    status_code=status.HTTP_200_OK,
)
def get_segment(
    segment_name: str,
    session: Session = Depends(get_db),
) -> ResponseSegment:
    db_segment = crud.get_segment(
        session=session,
        segment_name=segment_name,
    )
    return table_to_response_form(db_segment)


@router.put(
    "/{segment_id}",
    response_model=ResponseSegment,
    status_code=status.HTTP_200_OK,
)
def update_segment(
    segment_update: SegmentUpdate,
    segment: TableSegment = Depends(dependencies.get_segment_by_name),
    session: Session = Depends(get_db),
) -> ResponseSegment:
    db_segment = crud.update_segment(
        session=session,
        segment=segment,
        segment_update=segment_update,
    )
    return table_to_response_form(db_segment)


@router.delete(
    "/{segment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_segment(
    segment: TableSegment = Depends(dependencies.get_segment_by_name),
    session: Session = Depends(get_db),
) -> None:
    crud.delete_segment(
        session=session,
        segment=segment,
    )


@router.post(
    "/distribute",
    response_model=DistributionResult,
)
def distribute_segment(
    percentage: float,
    segment: TableSegment = Depends(dependencies.get_segment_by_name),
    session: Session = Depends(get_db),
) -> DistributionResult:
    if not (0 <= percentage <= 100):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Percentage must be between 0 and 100",
        )

    result = distribute_segment_randomly(
        session=session,
        segment=segment,
        percentage=percentage,
    )

    return result
