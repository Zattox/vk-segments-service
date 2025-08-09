from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .segment import Segment
from typing import List


class UserBase(BaseModel):
    username: str
    email: Optional[str] = None


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserWithSegments(User):
    segments: List[Segment] = []
