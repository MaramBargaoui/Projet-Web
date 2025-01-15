import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [shows, setShows] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    genre: '',
    release_year: '',
  });
  const [ratingFormData, setRatingFormData] = useState({
    show_id: '',
    rating_value: '',
  });
  const [editShowId, setEditShowId] = useState(null);
  const [token, setToken] = useState('');

  // Fetch shows from the API
  const fetchShows = async () => {
    const response = await axios.get('http://localhost:8000/shows/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setShows(response.data);
  };

  // Fetch ratings for a specific show
  const fetchRatings = async (showId) => {
    const response = await axios.get(`http://localhost:8000/ratings/${showId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRatings(response.data);
  };

  // Fetch shows on initial load
  useEffect(() => {
    if (token) {
      fetchShows();
    }
  }, [token]);

  // Handle input changes for show and rating forms
  const handleInputChange = (event) => {
    const value = event.target.value;
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleRatingInputChange = (event) => {
    const value = event.target.value;
    setRatingFormData({
      ...ratingFormData,
      [event.target.name]: value,
    });
  };

  // Handle show form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (editShowId) {
      // If editing, trigger the PUT request
      await axios.put(
        `http://localhost:8000/shows/${editShowId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      // If not editing, trigger the POST request
      await axios.post('http://localhost:8000/shows/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Reset the form and fetch updated shows
    setFormData({
      title: '',
      description: '',
      genre: '',
      release_year: '',
    });
    setEditShowId(null);
    fetchShows();
  };

  // Handle rating form submission
  const handleRatingSubmit = async (event) => {
    event.preventDefault();
    await axios.post('http://localhost:8000/ratings/', ratingFormData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Reset the form
    setRatingFormData({
      show_id: '',
      rating_value: '',
    });

    // Fetch updated ratings
    fetchRatings(ratingFormData.show_id);
  };

  // Handle editing a show
  const handleEdit = (showId) => {
    const selectedShow = shows.find((show) => show.id === showId);
    if (selectedShow) {
      setFormData(selectedShow);
      setEditShowId(showId);
    }
  };

  // Handle deleting a show
  const handleDelete = async (showId) => {
    await axios.delete(`http://localhost:8000/shows/${showId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchShows();
  };

  // Handle login and get token
  const handleLogin = async (event) => {
    event.preventDefault();
    const loginData = {
      username: 'testuser', // Replace with user input for username
      password: 'password', // Replace with user input for password
    };
    const response = await axios.post('http://localhost:8000/token/', loginData);
    setToken(response.data.access_token);
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Shows and Ratings Management App
          </a>
        </div>
      </nav>

      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="title" className="form-label">
              Show Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              onChange={handleInputChange}
              value={formData.title}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={handleInputChange}
              value={formData.description}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="genre" className="form-label">
              Genre
            </label>
            <input
              type="text"
              className="form-control"
              id="genre"
              name="genre"
              onChange={handleInputChange}
              value={formData.genre}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="release_year" className="form-label">
              Release Year
            </label>
            <input
              type="text"
              className="form-control"
              id="release_year"
              name="release_year"
              onChange={handleInputChange}
              value={formData.release_year}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {editShowId ? 'Update' : 'Submit'}
          </button>
        </form>

        <h2>Shows</h2>
        <button className="btn btn-success" onClick={handleLogin}>
          Login
        </button>

        {token && (
          <div>
            <h3>Manage Shows</h3>
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Genre</th>
                  <th>Release Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show) => (
                  <tr key={show.id}>
                    <td>{show.title}</td>
                    <td>{show.description}</td>
                    <td>{show.genre}</td>
                    <td>{show.release_year}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-info btn-sm mx-1"
                        onClick={() => handleEdit(show.id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(show.id)}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => fetchRatings(show.id)}
                      >
                        View Ratings
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Ratings</h3>
            <form onSubmit={handleRatingSubmit}>
              <div className="mb-3">
                <label htmlFor="show_id" className="form-label">
                  Show ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="show_id"
                  name="show_id"
                  onChange={handleRatingInputChange}
                  value={ratingFormData.show_id}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="rating_value" className="form-label">
                  Rating Value
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="rating_value"
                  name="rating_value"
                  onChange={handleRatingInputChange}
                  value={ratingFormData.rating_value}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit Rating
              </button>
            </form>

            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th>Show ID</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.show_id}</td>
                    <td>{rating.rating_value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
