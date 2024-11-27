'use client'

import React from 'react';
import SearchProfileAppBar from '../components/SearchProfileAppBar';
import NavBar from '../components/NavBar';

const SearchPAN = () => {
  return (
    <div className="mobile-container">
      <div className="content-container">
        <SearchProfileAppBar />
        <div className="main-content">
          <div className="search-container">
            <h2 className="search-title">Search by PAN Number</h2>
            <div className="search-input-container">
              <input 
                type="text" 
                placeholder="Enter PAN Number"
                className="search-input"
                maxLength={10}
              />
              <button className="search-button">
                Search
              </button>
            </div>
            <div className="search-info">
              <p>Please enter a valid PAN number to search</p>
              <ul className="search-guidelines">
                <li>PAN number should be 10 characters</li>
                <li>Format: AAAPL1234C</li>
              </ul>
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  );
};

export default SearchPAN;
