from pydantic import BaseModel


class SegmentDistribution(BaseModel):
    segment_name: str
    percentage: float


class DistributionResult(BaseModel):
    segment_name: str
    total_users: int
    assigned_users: int
    percentage_achieved: float
