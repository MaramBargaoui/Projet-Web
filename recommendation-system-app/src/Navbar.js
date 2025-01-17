import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ token, onLogout }) {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/shows">Shows</Link></li>
        <li><Link to="/add-show">Add Show</Link></li>
        <li><Link to="/recommendations">Recommendations</Link></li>
        {token ? (
          <li><button onClick={onLogout}>Logout</button></li>
        ) : (
          <li><Link to="/">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
