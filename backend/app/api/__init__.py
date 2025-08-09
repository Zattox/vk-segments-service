__all__ = (
    "user_router",
    "segment_router",
)

from .user.views import router as user_router
from .segment.views import router as segment_router
