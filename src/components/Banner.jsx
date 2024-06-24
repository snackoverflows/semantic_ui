import React from 'react';
import { useNavigate } from 'react-router-dom';

function Banner() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="banner">
      <img 
        src="https://s7d2.scene7.com/is/image/Caterpillar/CM20160629-33279-63115?fmt=png-alpha" 
        alt="Logo" 
        className="banner-logo" 
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }} // Para indicar que es clickeable
      />
    </div>
  );
}

export default Banner;
