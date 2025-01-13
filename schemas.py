from pydantic import BaseModel, conint
from datetime import datetime

class Show(BaseModel):
    id: int | None = None
    title: str
    genre: str
    date: int
    artist: str

class Rating(BaseModel):
    id: int | None = None
    votes: conint(ge=10000, le=100000) # type: ignore
    ratings: float
    recommendation: str
