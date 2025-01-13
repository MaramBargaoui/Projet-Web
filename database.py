import sqlite3
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


conn = sqlite3.connect('recommendation_system.db')

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


Base = declarative_base()

cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS Shows (
    ID INTEGER,
    Title String,
    Genre String,
    Date Integer,
    Artist String,
    PRIMARY KEY (ID)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Ratings (
    Id Integer,
    Votes Integer,
    Ratings Float,
    Recommendation String,
    
    PRIMARY KEY (ID)
)
''')

conn.commit()

shows_df = pd.read_csv('Shows.csv')
shows_df.to_sql('Shows', conn, if_exists='replace', index=False)

ratings_df = pd.read_csv('Ratings.csv')
ratings_df.to_sql('Ratings', conn, if_exists='replace', index=False)

conn.commit()
shows_query = cursor.execute('SELECT * FROM shows')
shows_data = shows_query.fetchall()

ratings_query = cursor.execute('SELECT * FROM Ratings')
ratings_data = ratings_query.fetchall()



print("Shows Data:")
for row in shows_data:
    print(row)

print("\nRatings Data:")
for row in ratings_data:
    print(row)

engine = create_engine("sqlite:///./recommendation_system.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 
conn.close()

Base.metadata.create_all(bind=engine)
print("Tables created successfully!")