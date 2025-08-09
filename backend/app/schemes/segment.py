from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user import User
from typing import List


class SegmentBase(BaseModel):
    name: str
    description: Optional[str] = None


class SegmentCreate(SegmentBase):
    pass


class SegmentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class Segment(SegmentBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SegmentWithUsers(Segment):
    users: List[User] = []
