from datetime import datetime
from typing import TYPE_CHECKING, List

from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.base import Base

if TYPE_CHECKING:
    from .table_segment import TableSegment

class TableUser(Base):
    username: Mapped[str] = mapped_column(unique=True, nullable=False)

    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now,
        server_default=func.now(),
    )

    segments: Mapped[List["TableSegment"]] = relationship(
        secondary="user_segment_association",  # Junction table for many-to-many relationship
        back_populates="users",
    )