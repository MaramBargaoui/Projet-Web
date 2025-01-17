import React, { useState, useEffect } from 'react';

function Recommendations({ token, shows, ratings }) {
  const [recommendations, setRecommendations] = useState([]);
  const [genre, setGenre] = useState('');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const filteredShows = shows.filter((show) => {
      const rating = ratings.find((r) => r.id === show.id);
      return rating && rating.rating >= minRating && (genre === '' || show.genre.toLowerCase().includes(genre.toLowerCase()));
    });
    setRecommendations(filteredShows);
  }, [genre, minRating, shows, ratings]);

  return (
    <div className="recommendations">
      <h2>Recommendations</h2>
      <div className="filters">
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
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
      <ul>
        {recommendations.map((show) => (
          <li key={show.id}>
            <h3>{show.title}</h3>
            <p>Genre: {show.genre}</p>
            <p>Rating: {ratings.find((r) => r.id === show.id)?.rating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations;
