'use client';

import React from 'react';

export default function NavBar() {
  return (
    <nav className="navbar">
      <a href="/" className="nav-item">
        <span className="material-icons">home</span>
        <span>Home</span>
      </a>
      <a href="/table-rows" className="nav-item">
        <span className="material-icons">table_rows</span>
        <span>Table Rows</span>
      </a>
      <a href="/history" className="nav-item">
        <span className="material-icons">history</span>
        <span>History</span>
      </a>
      <a href="/profile" className="nav-item">
        <span className="material-icons">person</span>
        <span>Person</span>
      </a>
    </nav>
  );
}
