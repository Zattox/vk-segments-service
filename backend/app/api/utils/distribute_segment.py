from sqlalchemy.orm import Session
import random

from ...models import TableSegment, TableUser
from ...schemes import DistributionResult
from ..user.crud import get_total_users_count, add_segment_to_user


def distribute_segment_randomly(
    session: Session,
    segment: TableSegment,
    percentage: float,
) -> DistributionResult:
    """Distribute segment to a random percentage of users."""
    # Total users in the system
    total_users = get_total_users_count(session)
    target_count = int(total_users * (percentage / 100))

    # Get all users not currently in this segment
    users_not_in_segment = (
        session.query(TableUser)
        .filter(~TableUser.segments.any(TableSegment.id == segment.id))
        .all()
    )

    # Randomly select users to add to segment
    if len(users_not_in_segment) >= target_count:
        selected_users = random.sample(users_not_in_segment, target_count)
    else:
        selected_users = users_not_in_segment

    # Add selected users to segment
    assigned_count = 0
    for user in selected_users:
        add_segment_to_user(session=session, user=user, segment=segment)
        assigned_count += 1

    # Calculate actual achieved percentage
    actual_percentage = (assigned_count / total_users) * 100 if total_users > 0 else 0.0

    # Return distribution result
    result = DistributionResult(
        segment_name=segment.name,
        total_users=total_users,
        assigned_users=assigned_count,
        percentage_achieved=actual_percentage,
    )
    return result
