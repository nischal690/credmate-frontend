'use client';

import { useState, useEffect } from 'react';

const newsItems = [
  "Important Update: New features available!",
  "Latest News: Check out our new offerings",
  "Announcement: System maintenance scheduled"
];

export default function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="news-carousel">
      <div className="news-content">
        {newsItems[currentIndex]}
      </div>
      <div className="carousel-dots">
        {newsItems.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
