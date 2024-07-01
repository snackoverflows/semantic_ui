import React from 'react';
import { useNavigate } from 'react-router-dom';

function Banner() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleButtonClick = () => {
    navigate('/comparison');
  };

  return (
    <div className="banner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <img 
        src="https://s7d2.scene7.com/is/image/Caterpillar/CM20160629-33279-63115?fmt=png-alpha" 
        alt="Logo" 
        className="banner-logo" 
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />
      <button 
        onClick={handleButtonClick}
        style={{ position: 'absolute', right: '10px', padding: '10px 20px', cursor: 'pointer' }}
      >
        Go to Comparison
      </button>
    </div>
  );
}

export default Banner;
