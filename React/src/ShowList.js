import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ShowList.css'; // Assurez-vous d'importer le fichier CSS ici

function ListShow() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState(null);
  const [showToDelete, setShowToDelete] = useState(null);
  const [token] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch('http://localhost:8000/shows/');
        if (!response.ok) {
          throw new Error('Failed to fetch shows');
        }
        const data = await response.json();
        setShows(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchShows();
  }, []);

  const handleDeleteClick = (show) => {
    setShowToDelete(show);
    // Afficher le toast pour confirmer la suppression
    toast.info(
      <>
        <p>Are you sure you want to delete the show "{show.title}" ?</p>
        <button onClick={() => handleDeleteConfirm()}>Yes</button>
        <button onClick={() => toast.dismiss()}>No</button>
      </>,
      {
        position: "bottom-right",
        autoClose: false,
        closeButton: false,
        className: "confirm-toast",
      }
    );
  };

  const handleDeleteConfirm = async () => {
    if (showToDelete) {
      try {
        if (!token) {
          throw new Error('Token is missing');
        }
        const response = await fetch(`http://localhost:8000/shows/${showToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete show');
        }

        setShows(shows.filter(show => show.id !== showToDelete.id));
        setShowToDelete(null);

        // Affichage du toast de succès après suppression
        toast.success('Show deleted successfully!');
      } catch (error) {
        setError(error.message);
        toast.error('Failed to delete show');
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>List of Shows</h2>
      {shows.length > 0 ? (
        <div className="card-container">
          {shows.map((show) => (
            <div className="card" key={show.id}>
              <h3>{show.title}</h3>
              <p>Genre: {show.genre}</p>
              <p>Date: {show.date}</p>
              <p>Artist: {show.artist}</p>
              <div className="card-footer">
                <button onClick={() => navigate(`/edit/${show.id}`)}>Update</button>
                <button onClick={() => handleDeleteClick(show)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No shows available</p>
      )}

      {/* Affichage des toasts */}
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar 
        closeButton={false} 
      />
    </div>
  );
}

export default ListShow;
