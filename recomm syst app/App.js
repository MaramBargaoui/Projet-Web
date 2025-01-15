import React, { useState, useEffect } from "react";
import axios from "axios";

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

  // Handle input changes for show and rating forms
  const handleShowInputChange = (e) => {
    const { name, value } = e.target;
    setShowForm({ ...showForm, [name]: value });
  };

  const handleRatingInputChange = (e) => {
    const { name, value } = e.target;
    setRatingForm({ ...ratingForm, [name]: value });
  };

  // Handle show form submission (add/update)
  const handleShowFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editShowId) {
        await axios.put(`http://localhost:8000/shows/${editShowId}`, showForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("http://localhost:8000/shows/", showForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowForm({ title: "", genre: "", date: "", artist: "" });
      setEditShowId(null);
      fetchShows();
    } catch (error) {
      console.error("Error submitting show form:", error);
    }
  };

  // Handle rating form submission (add/update)
  const handleRatingFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editRatingId) {
        await axios.put(
          `http://localhost:8000/ratings/${editRatingId}`,
          ratingForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:8000/ratings/", ratingForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setRatingForm({ votes: "", ratings: "", recommendation: "" });
      setEditRatingId(null);
      fetchRatings();
    } catch (error) {
      console.error("Error submitting rating form:", error);
    }
  };

  // Handle delete operations
  const handleDeleteShow = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/shows/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchShows();
    } catch (error) {
      console.error("Error deleting show:", error);
    }
  };

  const handleDeleteRating = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/ratings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRatings();
    } catch (error) {
      console.error("Error deleting rating:", error);
    }
  };

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
        <div>
          <h2>Login</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin("testuser", "password");
            }}
          >
            <button type="submit">Login</button>
          </form>
        </div>
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
            <button type="submit">
              {editRatingId ? "Update" : "Add"} Rating
            </button>
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
