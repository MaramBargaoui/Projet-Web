import React, { useState } from 'react';

function ShowForm({ onShowAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add show logic here
    const newShow = { title, description, genre };
    onShowAdded(newShow);
  };

  return (
    <div className="show-form">
      <h2>Add New Show</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre"
          required
        />
        <button type="submit">Add Show</button>
      </form>
    </div>
  );
}

export default ShowForm;
