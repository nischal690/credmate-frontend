'use client'

import React from 'react';
import SearchProfileAppBar from '../components/SearchProfileAppBar';
import NavBar from '../components/NavBar';

const SearchMobile = () => {
  return (
    <div className="mobile-container">
      <div className="content-container">
        <SearchProfileAppBar />
        <div className="main-content">
          <div className="search-container">
            <h2 className="search-title">Search by Mobile Number</h2>
            <div className="search-input-container">
              <input 
                type="tel" 
                placeholder="Enter Mobile Number"
                className="search-input"
                maxLength={10}
              />
              <button className="search-button">
                Search
              </button>
            </div>
            <div className="search-info">
              <p>Please enter a valid mobile number to search</p>
              <ul className="search-guidelines">
                <li>Mobile number should be 10 digits</li>
                <li>Enter numbers only, no spaces or special characters</li>
              </ul>
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  );
};

export default SearchMobile;
