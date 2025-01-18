import React, { useState, useEffect, use } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditShow() {
  const { id } = useParams(); // Récupère l'ID du show à modifier
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem('token')); 
  const [show, setShow] = useState({
    title: '',
    genre: '',
    date: '',
    artist: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const response = await fetch(`http://localhost:8000/shows/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch show');
        }
        const data = await response.json();
        setShow(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchShow();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/shows/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(show),
      });

      if (!response.ok) {
        throw new Error('Failed to update show');
      }

      navigate('/'); 
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Update Show</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={show.title}
          onChange={(e) => setShow({ ...show, title: e.target.value })}
          required
        />
        <input
          type="text"
          name="genre"
          value={show.genre}
          onChange={(e) => setShow({ ...show, genre: e.target.value })}
          required
        />
        <input
          type="number"
          name="date"
          value={show.date}
          onChange={(e) => setShow({ ...show, date: parseInt(e.target.value) })}
          required
        />
        <input
          type="text"
          name="artist"
          value={show.artist}
          onChange={(e) => setShow({ ...show, artist: e.target.value })}
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default EditShow;
