'use client'

import React from 'react';
import SearchProfileAppBar from '../components/SearchProfileAppBar';
import NavBar from '../components/NavBar';

const SearchGST = () => {
  return (
    <div className="mobile-container">
      <div className="content-container">
        <SearchProfileAppBar />
        <div className="main-content">
          <div className="gst-search-container">
            <h2 className="search-title">Search by GST Number</h2>
            <div className="search-input-container">
              <input 
                type="text" 
                placeholder="Enter GST Number"
                className="gst-input"
              />
              <button className="search-button">
                Search
              </button>
            </div>
            <div className="gst-info">
              <p>Please enter a valid GST number to search</p>
              <ul className="gst-guidelines">
                <li>GST number should be 15 digits</li>
                <li>Format: 22AAAAA0000A1Z5</li>
              </ul>
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  );
};

export default SearchGST;
