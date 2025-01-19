
# Recommendation System

## Overview

This project is a RESTful API designed to recommend and manage shows for the Municipal Theater of Tunis. Built using FastAPI, the API allows users to create and manage accounts, authenticate, and interact with a collection of shows and ratings. The system suggests shows based on user ratings and preferences. This project is an academic-based recommendation system.

![Municipal Theater of Tunis](masra7.png "the theater")

## Features

- **User Management:**
 - Create a new user account.
- Retrieve user details by user ID.
  
- **Show Management:**
  - User login to obtain an access token.
  
- **Recipe Management:**
 - Retrieve all available shows.
 - Add, update, or delete shows.
 - Retrieve a specific show by ID.

- **Rating Management:**
- Add, update, or delete ratings for shows.
 - Retrieve ratings by ID.

- **Recommendation:**
- Based on ratings and preferences, the system can suggest shows to the users.

## Endpoints

### 2. Authentication Endpoints

- **User Login**
  - **`POST /login`**
  - Authenticates the user and returns a JWT token.
  - **Request Body:** `OAuth2PasswordRequestForm`
  - **Response:** Access token and token type.

### 3. Show Endpoints

- **Get All Shows**
  - **`GET /Shows/`**
  - Retrieves all shows available.
  - **Response:** List of all shows.

- **Get Show by ID**
  - **`GET /shows/{show_id}`**
  - Retrieves a specific show by its ID.
  - **Response:** Show details.

- **Add a New Show**
  - **`POST /shows/`**
  - Adds a new show.
  - **Request Body:** `Show (JSON: { "title": "string", "date": "integer", ... })`
  - **Response:** Newly created show.

- **Add a New Show**
  - **`PUT /shows/{show_id}`**
  - Adds a new show.
  - **Request Body:** `Show (JSON: { "title": "string", "date": "integer", ... })`
  - **Response:** Newly created show.


- **Get Recipes by Country**
  - **`GET /recipes/country/{country}`**
  - Retrieves recipes originating from a specified country.
  - **Response:** List of recipes from the specified country.
