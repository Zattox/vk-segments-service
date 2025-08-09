from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from . import crud, dependencies

from backend.app.schemes import (
    ResponseUser,
    UserCreate,
    ResponseSegment,
)

from backend.app.database import get_db
from backend.app.models import TableUser, TableSegment

from ..segment import get_segment_by_name

from ..segment.views import table_to_response_form as table_segment_to_response_segment

router = APIRouter(prefix="/users", tags=["users"])


def table_to_response_form(
    user: TableUser,
) -> ResponseUser:
    result = ResponseUser(
        username=user.username,
        email=user.email,
        created_at=user.created_at,
        segments=[],
    )

    result.segments = [segment.name for segment in user.segments]

    return result


@router.post(
    "/",
    response_model=ResponseUser,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_in: UserCreate,
    session: Session = Depends(get_db),
) -> ResponseUser:
    user = crud.create_user(
        session=session,
        user_in=user_in,
    )
    return table_to_response_form(user)


@router.get(
    "/",
    response_model=List[ResponseUser],
    status_code=status.HTTP_200_OK,
)
def get_users(
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_db),
) -> List[ResponseUser]:
    users = crud.get_users(
        session=session,
        skip=skip,
        limit=limit,
    )
    return [table_to_response_form(user) for user in users]


@router.get(
    "/{user_id}",
    response_model=ResponseUser,
    status_code=status.HTTP_200_OK,
)
def get_user(
    username: str,
    session: Session = Depends(get_db),
) -> ResponseUser:
    db_user = crud.get_user(
        session=session,
        username=username,
    )

    return table_to_response_form(db_user)


@router.get(
    "/{user_id}/segments",
    response_model=List[ResponseSegment],
    status_code=status.HTTP_200_OK,
)
def get_user_segments(
    user: TableUser = Depends(dependencies.get_user_by_username),
) -> List[ResponseSegment]:
    segments = crud.get_user_segments(
        user=user,
    )
    return [table_segment_to_response_segment(segment) for segment in segments]


@router.post(
    "/{user_id}/segments/{segment_id}",
    response_model=ResponseUser,
    status_code=status.HTTP_200_OK,
)
def add_user_to_segment(
    user: TableUser = Depends(dependencies.get_user_by_username),
    segment: TableSegment = Depends(get_segment_by_name),
    session: Session = Depends(get_db),
) -> ResponseUser:
    user = crud.add_segment_to_user(
        session=session,
        user=user,
        segment=segment,
    )
    return table_to_response_form(user)


@router.delete(
    "/{user_id}/segments/{segment_id}",
    response_model=ResponseUser,
    status_code=status.HTTP_200_OK,
)
def remove_user_from_segment(
    user: TableUser = Depends(dependencies.get_user_by_username),
    segment: TableSegment = Depends(get_segment_by_name),
    session: Session = Depends(get_db),
) -> ResponseUser:
    user = crud.remove_segment_from_user(
        session=session,
        user=user,
        segment=segment,
    )
    return table_to_response_form(user)
