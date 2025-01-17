import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ShowList from './components/ShowList';
import ShowForm from './components/ShowForm';
import Recommendations from './components/Recommendations';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [shows, setShows] = useState([]);
  const [ratings, setRatings] = useState([]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  // Fetching the data (simulating API calls)
  useEffect(() => {
    if (token) {
      // Simulating loading data for shows and ratings
      fetchShows();
      fetchRatings();
    }
  }, [token]);

  const fetchShows = async () => {
    // Replace with your API call or use the shows.csv data
    setShows([
      { id: 1, title: "Emel Mathlouthi", genre: "Musical", date: "2011", artist: "Emel Mathlouthi" },
      { id: 2, title: "Le Dîner de cons?", genre: "Drama", date: "2023", artist: "David Mira-Jover" },
      { id: 3, title: "Evasion", genre: "Comedy", date: "2023", artist: "Aziz Jebali" },
      { id: 4, title: "Le Placard", genre: "Drama", date: "2023", artist: "Alain Zouvi" },
      { id: 5, title: "Le Tourbillon", genre: "Musical", date: "2022", artist: "Julien Duvivier" }
    ]);
  };

  const fetchRatings = async () => {
    // Replace with your API call or use the ratings.csv data
    setRatings([
      { id: 1, votes: 55037, rating: 7.8, recommendation: "Recommended" },
      { id: 2, votes: 45531, rating: 5.0, recommendation: "Not Recommended" },
      { id: 3, votes: 38917, rating: 4.2, recommendation: "Not Recommended" },
      { id: 4, votes: 74522, rating: 8.7, recommendation: "Highly Recommended" },
      { id: 5, votes: 49199, rating: 7.5, recommendation: "Recommended" }
    ]);
  };

  const getRecommendedShows = (genre) => {
    // Filtering the shows based on the genre and rating recommendations
    const recommendedShows = shows.filter((show) => {
      const rating = ratings.find((r) => r.id === show.id);
      return rating && rating.recommendation === "Recommended" && show.genre === genre;
    });
    return recommendedShows;
  };

  return (
    <Router>
      <div className="App">
        <Navbar token={token} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={token ? <Navigate to="/shows" /> : <Login onLogin={handleLogin} />} />
          <Route path="/shows" element={token ? <ShowList token={token} shows={shows} /> : <Navigate to="/" />} />
          <Route path="/add-show" element={token ? <ShowForm token={token} /> : <Navigate to="/" />} />
          <Route
            path="/recommendations"
            element={token ? <Recommendations token={token} shows={shows} ratings={ratings} getRecommendedShows={getRecommendedShows} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
