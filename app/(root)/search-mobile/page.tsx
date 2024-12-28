'use client';

import React from 'react';
import SearchProfileAppBar from '../../../components/SearchProfileAppBar';
import NavBar from '../../../components/NavBar';

const SearchMobile = () => {
  const [mobileNumber, setMobileNumber] = React.useState('');

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any existing +91 prefix and non-digit characters
    const cleanNumber = e.target.value.replace(/^\+91|[^\d]/g, '');
    // Add +91 prefix if there's a number
    const formattedNumber = cleanNumber ? `+91${cleanNumber}` : '';
    setMobileNumber(formattedNumber);
  };

  const handleSearch = () => {
    // Use the formatted mobile number for search
    console.log('Searching with number:', mobileNumber);
  };

  return (
    <div className='mobile-container'>
      <div className='content-container'>
        <SearchProfileAppBar />
        <div className='main-content'>
          <div className='search-container'>
            <h2 className='search-title'>Search by Mobile Number</h2>
            <div className='search-input-container'>
              <input
                type='tel'
                placeholder='Enter Mobile Number'
                className='search-input'
                maxLength={12}
                value={mobileNumber.replace(/^\+91/, '')} // Display without prefix
                onChange={handleMobileNumberChange}
              />
              <button className='search-button' onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className='search-info'>
              <p>Please enter a valid mobile number to search</p>
              <ul className='search-guidelines'>
                <li>Mobile number should be 10 digits</li>
                <li>Enter numbers only, no spaces or special characters</li>
                <li>+91 prefix will be automatically added</li>
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
