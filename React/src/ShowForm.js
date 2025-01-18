import React, { useState } from 'react';

function ShowForm({ onShowAdded }) {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = 'http://localhost:8000/shows/';
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [date, setDate] = useState('');  // Champ ajouté
  const [artist, setArtist] = useState('');  // Champ ajouté
  const [token] = useState(localStorage.getItem('token'));  // Récupérer le token

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newShow = { id,title, genre, date, artist };  // Ajout des nouveaux champs

    try {
      // Vérifiez si le token existe avant d'envoyer la requête
      if (!token) {
        console.error("Token is missing");
        return;
      }
      console.log("Token envoyé:", token);
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ajouter le token pour l'authentification
        },
        body: JSON.stringify(newShow),  // Convertir les données en JSON
      });

      if (response.ok) {
        const addedShow = await response.json();
        onShowAdded();  // Mettre à jour les shows dans le parent
        setId('');
        setTitle('');
        setGenre('');
        setDate('');
        setArtist('');
      } else {
        console.error('Erreur lors de l\'ajout du show');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="show-form">
      <h2>Add New Show</h2>
      <form onSubmit={handleSubmit}>
      <input
          type="int"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ID"
          required
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre"
          required
        />
        <input
          type="number"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Year"
          required
        />
        <input
          type="text"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist"
          required
        />
        <button type="submit">Add Show</button>
      </form>
    </div>
  );
}

export default ShowForm;
