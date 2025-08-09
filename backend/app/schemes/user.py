from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from typing import List


class UserBase(BaseModel):
    username: str
    email: Optional[str] = None


class UserCreate(UserBase):
    pass


class ResponseUser(UserBase):
    created_at: datetime
    segments: List[str] = []

    class Config:
        from_attributes = True
