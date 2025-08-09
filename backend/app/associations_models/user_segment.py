from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.models.base import Base


class UserSegmentAssociation(Base):
    __tablename__ = "user_segment_association"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    segment_id: Mapped[int] = mapped_column(ForeignKey("segments.id"))
