'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import SearchProfileAppBar from '../components/SearchProfileAppBar';
import NavBar from '../components/NavBar';

const SearchProfile = () => {
  const router = useRouter();

  const handleGSTSearch = () => {
    router.push('/search-gst');
  };

  const handlePANSearch = () => {
    router.push('/search-pan');
  };

  const handleMobileSearch = () => {
    router.push('/search-mobile');
  };

  const handleAadhaarSearch = () => {
    router.push('/search-aadhaar');
  };

  return (
    <div className="mobile-container">
      <div className="content-container">
        <SearchProfileAppBar />
        {/* Add your search profile content here */}
        <div className="main-content">
          <p className="search-method-text">Choose your preferred method of search</p>
          <div className="search-options-container">
            <h3 className="search-option-title">Search by Face</h3>
            <div className="search-option-box">
              <div className="sub-options">
                <div className="sub-option-box">
                  <span>Take a Photo</span>
                </div>
                <div className="sub-option-box">
                  <span>Upload from Gallery</span>
                </div>
              </div>
            </div>

            <div className="search-option-box" onClick={handleGSTSearch}>
              <h3>Search by GST</h3>
            </div>

            <div className="search-option-box" onClick={handlePANSearch}>
              <h3>Search by PAN</h3>
            </div>

            <div className="search-option-box" onClick={handleMobileSearch}>
              <h3>Search by Mobile</h3>
            </div>

            <div className="search-option-box" onClick={handleAadhaarSearch}>
              <h3>Search by Aadhaar</h3>
            </div>
          </div>
        </div>
        <NavBar />
      </div>
    </div>
  );
};

export default SearchProfile;