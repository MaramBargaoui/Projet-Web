import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  // State to store user input, token, shows, and loading state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle login and store the access token
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/token/', 
        new URLSearchParams({
          username: username,
          password: password,
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      setAccessToken(response.data.access_token); // Store the token
      console.log('Logged in successfully');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // Fetch shows from the FastAPI backend
  useEffect(() => {
    const fetchShows = async () => {
      if (!accessToken) return; // If no token, do not fetch
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/shows/', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Attach the JWT token
          },
        });
        setShows(response.data);
      } catch (error) {
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [accessToken]); // Only run when the accessToken changes

  return (
    <div className="App">
      <h1>Shows and Ratings</h1>

      {/* Login Form */}
      {!accessToken && (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      )}

      {/* Display shows */}
      {loading && <p>Loading shows...</p>}
      {accessToken && !loading && (
        <div>
          <h2>Available Shows</h2>
          {shows.length > 0 ? (
            <ul>
              {shows.map((show) => (
                <li key={show.id}>
                  <h3>{show.title}</h3>
                  <p>{show.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No shows available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
