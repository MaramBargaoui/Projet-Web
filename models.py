from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, String, Float


Base = declarative_base()

class Shows(Base):
    __tablename__ = "Shows"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, index=True)
    genre = Column(String)
    date = Column(Integer)
    artist = Column(String)

class Ratings(Base):
    __tablename__ = "Ratings"
    id = Column(Integer, primary_key=True, autoincrement=True)
    votes = Column(Integer)
    ratings = Column(Float)
    recommendation = Column(String)