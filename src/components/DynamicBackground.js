import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './DynamicBackground.css';
import backgroundImage from '../Designer.png';
import logo from '../By_Ikram_logo.png';
import paypalLogo from '../paypal-logo-transparent.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok, faSnapchat } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

function DynamicBackground() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/search');
  };

  return (
    <div
      className="dynamic-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <title>Chogan Parfums</title>
        <meta name="description" content="Découvrez nos produits exclusifs et suivez-nous sur les réseaux sociaux !" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="cosmétiques, parfums, produits de qualité, grandes marques, changement de vie, richesse, luxe" />
        <meta property="og:title" content="Chogan Parfums" />
        <meta property="og:description" content="Découvrez nos produits exclusifs et suivez-nous sur les réseaux sociaux !" />
        <meta property="og:image" content={backgroundImage} />
        <meta property="og:url" content="https://www.chogangroupspa.com/referral/IKRFB24D1/FR" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chogan Parfums" />
        <meta name="twitter:description" content="Découvrez nos produits exclusifs et suivez-nous sur les réseaux sociaux !" />
        <meta name="twitter:image" content={backgroundImage} />
        <link rel="canonical" href="https://www.chogangroupspa.com/referral/IKRFB24D1/FR" />
      </Helmet>
      <div className="content">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <p>Découvrez nos produits exclusifs et suivez-nous sur les réseaux sociaux !</p>
        <div className="icons">
          <a href="https://www.instagram.com/ikram_nahyl_amir" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a href="https://www.tiktok.com/@ikrams.chogan" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTiktok} size="2x" />
          </a>
          <a href="https://www.snapchat.com/add/ikramou-anass" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSnapchat} size="2x" />
          </a>
        </div>
      
        <div className="buttons">
        <button
            onClick={handleRedirect}
            className="action-button"
            aria-label="Découvrez nos offres exclusives et passez commande maintenant"
          >
            Cliquez ici pour découvrir nos offres exclusives et commander maintenant !
        </button>
          <a href="https://www.chogangroupspa.com/registration_consultant/IKRFB24D1" target="_blank" rel="noopener noreferrer" className="action-button">
            Rejoignez-nous et commencez à bâtir votre propre succès dans la vente de parfums !
          </a>
          <a href="https://www.paypal.com/paypalme/ikramchogan" target="_blank" rel="noopener noreferrer" className="action-button paypal-button">
            <img src={paypalLogo} alt="PayPal" className="paypal-logo" /> Paiement en direct
          </a>
          <a href="mailto:ikram.bakmou@outlook.fr" target="_blank" rel="noopener noreferrer" className="action-button email-button">
            <FontAwesomeIcon icon={faEnvelope} size="2x" className="email-icon" />
            <span className="email-text"> Contactez-moi</span>
          </a>
          </div>
        <div className="selling-points">
          <p>Qualité exceptionnelle</p>
          <p>Livraison rapide</p>
          <p>Service client 24/7</p>
        </div>
      </div>
    </div>
  );
}

export default DynamicBackground;