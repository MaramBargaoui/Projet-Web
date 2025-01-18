import React, { useState, useEffect } from 'react';
import './ShowList.css';  // Assurez-vous d'importer le fichier CSS ici

function Recommendations({ shows, ratings }) {
  const [recommendations, setRecommendations] = useState([]);
  const [genre, setGenre] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [filteredShows, setFilteredShows] = useState([]);  // Liste filtrée par genre

  useEffect(() => {
    // Filtrer les shows selon le genre et la note minimale
    const filtered = shows.filter((show) => {
      // Trouver le rating du show par son ID (show.id === rating.show_id)
      const rating = ratings.find((r) => r.show_id === show.id);  // Utiliser l'id du show pour associer le rating
      return (
        rating && // Vérifier si un rating existe pour ce show
        rating.rating >= minRating && // Vérifier si le rating est au-dessus de la note minimale
        (genre === '' || show.genre.toLowerCase().includes(genre.toLowerCase())) // Filtrage par genre
      );
    });

    setRecommendations(filtered);  // Mettre à jour la liste des recommandations
  }, [genre, minRating, shows, ratings]);

  // Fonction pour filtrer les shows en temps réel en fonction du genre saisi
  const handleGenreChange = (e) => {
    const value = e.target.value;
    setGenre(value);

    // Filtrer les shows en fonction du genre saisi
    const genreFilteredShows = shows.filter((show) =>
      show.genre.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredShows(genreFilteredShows);  // Mettre à jour la liste filtrée
  };

  return (
    <div className="recommendations">
      <h2>Recommendations</h2>
      <div className="filters">
        <input
          type="text"
          value={genre}
          onChange={handleGenreChange}
          placeholder="Filter by genre"
        />
        <input
          type="number"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          placeholder="Minimum rating"
          min="0"
          max="10"
          step="0.1"
        />
      </div>

      {/* Affichage des shows filtrés sous forme de cartes */}
      {recommendations.length > 0 ? (
        <div className="card-container">
          {recommendations.map((show) => {
            // Trouver le rating du show par son ID (show.id === rating.show_id)
            const showRating = ratings.find((r) => r.show_id === show.id)?.rating;  // Utiliser l'id du show pour trouver le rating
            return (
              <div className="card" key={show.id}>
                <h3>{show.title}</h3>
                <p>Genre: {show.genre}</p>
                <p>Rating: {showRating !== undefined ? showRating : 'No rating available'}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No recommendations match your filters.</p>
      )}

      {/* Affichage des shows ayant le genre saisi */}
      {genre && filteredShows.length > 0 && (
        <div>
          <h3>Shows with the genre "{genre}":</h3>
          <div className="card-container">
            {filteredShows.map((show) => {
              const showRating = ratings.find((r) => r.show_id === show.id)?.rating;
              return (
                <div className="card" key={show.id}>
                  <h3>{show.title}</h3>
                  <p>Genre: {show.genre}</p>
                  <p>Rating: {showRating !== undefined ? showRating : 'No rating available'}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommendations;
