'use client'

import React from 'react';
import SearchProfileAppBar from '../components/SearchProfileAppBar';
import NavBar from '../components/NavBar';

const SearchProfile = () => {
  return (
    <div className="mobile-container">
      <div className="content-container">
        <SearchProfileAppBar />
        {/* Add your search profile content here */}
        <div className="main-content">
          <p className="search-method-text">Choose your preferred method of search</p>
          <div className="search-options-container">
            <div className="search-option-box">
              <h3>Search by Face</h3>
              <div className="sub-options">
                <div className="sub-option-box">
                  <span>Take a Photo</span>
                </div>
                <div className="sub-option-box">
                  <span>Upload from Gallery</span>
                </div>
              </div>
            </div>

            <div className="search-option-box">
              <h3>Search by GST</h3>
            </div>

            <div className="search-option-box">
              <h3>Search by PAN</h3>
            </div>

            <div className="search-option-box">
              <h3>Search by Mobile</h3>
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  );
};

export default SearchProfile;