import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import ShowList from './ShowList';
import ShowForm from './ShowForm';
import Recommendations from './Recomm'; 
import Navbar from './Navbar';
import './App.css';
import EditShow from './EditShow';

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
    window.location.href = '/';
  };

  const fetchShows = async () => {
    try {
      const response = await fetch('http://localhost:8000/shows/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setShows(data);
      } else {
        console.error('Erreur lors de la récupération des shows');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await fetch('http://localhost:8000/ratings/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRatings(data);
      } else {
        console.error('Erreur lors de la récupération des ratings');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchShows();
      fetchRatings();
    }
  }, [token]);

  return (
    <Router>
      <div className="App">
        {/* N'afficher la Navbar que si l'utilisateur est connecté et n'est pas sur la page de login */}
        {token && window.location.pathname !== "/" && <Navbar token={token} onLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={token ? <Navigate to="/shows" /> : <Login onLogin={handleLogin} />} />
          <Route
            path="/shows"
            element={token ? <ShowList shows={shows} /> : <Navigate to="/" />}
          />
          <Route
            path="/add-show"
            element={token ? <ShowForm onShowAdded={fetchShows} /> : <Navigate to="/" />}
          />
          <Route
            path="/recommendations"
            element={token ? <Recommendations shows={shows} ratings={ratings} /> : <Navigate to="/" />}
          />
          <Route
            path="/edit/:id"
            element={token ? <EditShow /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
