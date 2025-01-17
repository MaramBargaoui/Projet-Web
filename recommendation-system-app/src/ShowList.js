import React from 'react';

function ShowList({ shows }) {
  return (
    <div className="show-list">
      <h2>Show List</h2>
      {shows.length === 0 ? (
        <p>No shows available.</p>
      ) : (
        <ul>
          {shows.map((show) => (
            <li key={show.id}>
              <h3>{show.title}</h3>
              <p>Genre: {show.genre}</p>
              <p>{show.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ShowList;
