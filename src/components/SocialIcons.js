import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faInstagram, faSnapchat, faPaypal } from '@fortawesome/free-brands-svg-icons';
import './SocialIcons.css';

function SocialIcons() {
  return (
    <div className="social-icons">
      <a href="https://www.tiktok.com/@votrecompte" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faTiktok} size="2x" />
      </a>
      <a href="https://www.instagram.com/votrecompte" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faInstagram} size="2x" />
      </a>
      <a href="https://www.snapchat.com/add/votrecompte" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faSnapchat} size="2x" />
      </a>
      <a href="https://www.paypal.com/paypalme/votrecompte" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faPaypal} size="2x" />
      </a>
    </div>
  );
}

export default SocialIcons;