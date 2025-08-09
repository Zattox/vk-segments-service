from datetime import datetime
from typing import TYPE_CHECKING, List

from sqlalchemy import text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base

if TYPE_CHECKING:
    from .table_user import TableUser


class TableSegment(Base):
    name: Mapped[str] = mapped_column(unique=True)
    description: Mapped[str] = mapped_column(nullable=True)
    is_active: Mapped[bool] = mapped_column(
        default=True,
        server_default=text("true"),
    )

    created_at: Mapped[datetime] = mapped_column(
        default=datetime.now,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        onupdate=func.now(),
    )

    users: Mapped[List["TableUser"]] = relationship(
        secondary="user_segment_association",  # Junction table for many-to-many relationship
        back_populates="segments",
    )
