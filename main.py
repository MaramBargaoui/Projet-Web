from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv 
import os  
from models import Base, Shows, Ratings  
from Database.database import engine, SessionLocal
from schemas import Show, Rating
from passlib.context import CryptContext


app = FastAPI()

load_dotenv()


SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret_key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))


print("SECRET_KEY:", SECRET_KEY)
print("ALGORITHM:", ALGORITHM)
print("ACCESS_TOKEN_EXPIRE_MINUTES:", ACCESS_TOKEN_EXPIRE_MINUTES)



origins = [
    "http://localhost:3000",  
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
plain_password = "password"
STORED_HASHED_PASSWORD="$2b$12$W1DBvzcp3jQvat6sKHLIE.2jC5rNTLeWFq450h701zB.CyMNjvdMS"


print(f"New hashed password: {STORED_HASHED_PASSWORD}")


result = pwd_context.verify(plain_password,STORED_HASHED_PASSWORD )
print(f"Password matches: {result}")


class User(BaseModel):
    username: str
   

def verify_password(plain_password, STORED_HASHED_PASSWORD):
    return pwd_context.verify(plain_password, STORED_HASHED_PASSWORD)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return User(username=username)
    except JWTError:
        raise credentials_exception


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/token/")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"Attempting login for user: {form_data.username}")  
    if form_data.username != "testuser" or not verify_password(form_data.password, STORED_HASHED_PASSWORD):


        print("Password verification failed.")  
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": form_data.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/shows/")
async def read_shows(db: Session = Depends(get_db)):
    shows = db.query(Shows).all()  
    return shows

@app.get("/shows/{show_id}", response_model=Show)
def read_show_by_id(show_id: int, db: Session = Depends(get_db)):
    show = db.query(Shows).filter(Shows.id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show

@app.post("/shows/", response_model=Show)
async def create_show(show: Show, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_show = Shows(**show.dict(exclude_unset=True))
    db.add(new_show)
    db.commit()
    db.refresh(new_show)
    return new_show

@app.put("/shows/{show_id}", response_model=Show)
def update_show(show_id: int, show: Show, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_show = db.query(Shows).filter(Shows.id == show_id).first()
    if not existing_show:
        raise HTTPException(status_code=404, detail="Show not found")
    for key, value in show.dict(exclude_unset=True).items():
        setattr(existing_show, key, value)
    db.commit()
    db.refresh(existing_show)
    return existing_show

@app.delete("/shows/{show_id}", response_model=Show)
def delete_show(show_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_show = db.query(Shows).filter(Shows.id == show_id).first()
    if not existing_show:
        raise HTTPException(status_code=404, detail="Show not found")
    db.delete(existing_show)
    db.commit()
    return existing_show


@app.get("/ratings/{rating_id}", response_model=Rating)
def read_rating_by_id(rating_id: int, db: Session = Depends(get_db)):
    rating = db.query(Ratings).filter(Ratings.id == rating_id).first()
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    return rating

@app.post("/ratings/", response_model=Rating)
def create_ratings(rating: Rating, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_rating = Ratings(**rating.dict())
    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)
    return new_rating

@app.put("/ratings/{rating_id}", response_model=Rating)
def update_rating(rating_id: int, rating: Rating, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_rating = db.query(Ratings).filter(Ratings.id == rating_id).first()
    if not existing_rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    for key, value in rating.dict(exclude_unset=True).items():
        setattr(existing_rating, key, value)
    db.commit()
    db.refresh(existing_rating)
    return existing_rating

@app.delete("/ratings/{rating_id}", response_model=Rating)
def delete_rating(rating_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing_rating = db.query(Ratings).filter(Ratings.id == rating_id).first()
    if not existing_rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    db.delete(existing_rating)
    db.commit()
    return existing_rating


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Shows and Ratings API. Check SWAGGER at http://localhost:8000/docs"
    }



