import React, { useState, useEffect } from "react";
import axios from "axios";

// Login Component
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password); // Call the login function passed as a prop
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// Main App Component
const App = () => {
  const [shows, setShows] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [showForm, setShowForm] = useState({
    title: "",
    genre: "",
    date: "",
    artist: "",
  });
  const [ratingForm, setRatingForm] = useState({
    votes: "",
    ratings: "",
    recommendation: "",
  });
  const [editShowId, setEditShowId] = useState(null);
  const [editRatingId, setEditRatingId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Fetch shows
  const fetchShows = async () => {
    try {
      const response = await axios.get("http://localhost:8000/shows/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShows(response.data);
    } catch (error) {
      console.error("Error fetching shows:", error);
    }
  };

  // Fetch ratings
  const fetchRatings = async () => {
    try {
      const response = await axios.get("http://localhost:8000/ratings/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRatings(response.data);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchShows();
      fetchRatings();
    }
  }, [token]);

  // Handle login
  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8000/token/", {
        username,
        password,
      });
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem("token", access_token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      {!token ? (
        <Login onLogin={handleLogin} /> // Pass the handleLogin function as a prop
      ) : (
        <div>
          <h1>Shows and Ratings App</h1>
          {/* Shows Form */}
          <form onSubmit={handleShowFormSubmit}>
            <h2>{editShowId ? "Edit Show" : "Add Show"}</h2>
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={showForm.title}
              onChange={handleShowInputChange}
            />
            <input
              type="text"
              placeholder="Genre"
              name="genre"
              value={showForm.genre}
              onChange={handleShowInputChange}
            />
            <input
              type="text"
              placeholder="Date"
              name="date"
              value={showForm.date}
              onChange={handleShowInputChange}
            />
            <input
              type="text"
              placeholder="Artist"
              name="artist"
              value={showForm.artist}
              onChange={handleShowInputChange}
            />
            <button type="submit">{editShowId ? "Update" : "Add"} Show</button>
          </form>

          {/* Ratings Form */}
          <form onSubmit={handleRatingFormSubmit}>
            <h2>{editRatingId ? "Edit Rating" : "Add Rating"}</h2>
            <input
              type="text"
              placeholder="Votes"
              name="votes"
              value={ratingForm.votes}
              onChange={handleRatingInputChange}
            />
            <input
              type="text"
              placeholder="Ratings"
              name="ratings"
              value={ratingForm.ratings}
              onChange={handleRatingInputChange}
            />
            <input
              type="text"
              placeholder="Recommendation"
              name="recommendation"
              value={ratingForm.recommendation}
              onChange={handleRatingInputChange}
            />
            <button type="submit">{editRatingId ? "Update" : "Add"} Rating</button>
          </form>

          {/* Shows Table */}
          <h2>Shows</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Date</th>
                <th>Artist</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => (
                <tr key={show.id}>
                  <td>{show.title}</td>
                  <td>{show.genre}</td>
                  <td>{show.date}</td>
                  <td>{show.artist}</td>
                  <td>
                    <button onClick={() => setEditShowId(show.id)}>Edit</button>
                    <button onClick={() => handleDeleteShow(show.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Ratings Table */}
          <h2>Ratings</h2>
          <table>
            <thead>
              <tr>
                <th>Votes</th>
                <th>Ratings</th>
                <th>Recommendation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating.id}>
                  <td>{rating.votes}</td>
                  <td>{rating.ratings}</td>
                  <td>{rating.recommendation}</td>
                  <td>
                    <button onClick={() => setEditRatingId(rating.id)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteRating(rating.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
