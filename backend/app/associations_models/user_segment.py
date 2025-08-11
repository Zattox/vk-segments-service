from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from ..models.base import Base


class UserSegmentAssociation(Base):
    __tablename__ = "user_segment_association"

    # Table constraints to ensure uniqueness of team-tournament combinations
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "segment_id",
            name="index_unique_user_segment",  # Ensures a team can only be associated with a tournament once
        ),
    )

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    segment_id: Mapped[int] = mapped_column(ForeignKey("segments.id"))
