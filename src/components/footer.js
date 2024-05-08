import React, { useState, useEffect } from 'react';
import '../styles/footer.css'; // Import your CSS file
import reviveWell from "../images/ReviveWell.png"

const App = () => {
  const [isFooterFixed, setIsFooterFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate the scroll position
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // Determine if the scroll position exceeds a certain threshold
      const threshold = 100; // Adjust this value based on your requirements
      setIsFooterFixed(scrollY > threshold);
    };

    // Add event listener for scroll events
    window.addEventListener('scroll', handleScroll);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app">
      <div id="main-content">
        {/* Your main page content goes here */}
      </div>
      <footer className='fixed-footer' id="footer">
        <div className ="image-container">
        <img  className = "image-det" src = {reviveWell} alt ="reviveWell"></img>
        </div>
      </footer>
    </div>
  );
};

export default App;
