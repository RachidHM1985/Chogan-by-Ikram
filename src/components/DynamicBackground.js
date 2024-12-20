import React from 'react';
import './DynamicBackground.css';
import backgroundImage from '../Designer.png';
import logo from '../By_Ikram_logo.png'; // Importer le logo principal
import paypalLogo from '../paypal-logo-transparent.png'; // Importer le logo PayPal écrit
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons'; // Importer l'icône WhatsApp
import { faSnapchat } from '@fortawesome/free-brands-svg-icons/faSnapchat';
import whatsapp from '../whatsApp-icone.png';

function DynamicBackground() {
  return (
    <div
      className="dynamic-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
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
        <p>
          <a href="https://acrobat.adobe.com/id/urn:aaid:sc:EU:c0829cdf-c1c2-43e8-b860-0fcde67bef33" download="ChoganByIkram.pdf" className="black-bold-link">Cliquez ici</a> pour télécharger notre liste de cosmetiques.
        </p>
        <div className="buttons">
          <a href="https://www.chogangroupspa.com/referral/IKRFB24D1/FR" target="_blank" rel="noopener noreferrer" className="action-button">
          Cliquez ici pour découvrir nos offres exclusives et commander maintenant !
          </a>
          <a href="https://www.chogangroupspa.com/registration_consultant/IKRFB24D1" target="_blank" rel="noopener noreferrer" className="action-button">
          Rejoignez-nous et commencez à bâtir votre propre succès dans la vente de parfums !
          </a>
          <a href="https://www.paypal.com/paypalme/ikramchogan" target="_blank" rel="noopener noreferrer" className="action-button paypal-button">
            <img src={paypalLogo} alt="PayPal" className="paypal-logo" /> Paiement en direct
          </a>
          <a href="https://wa.me/0663159242" target="_blank" rel="noopener noreferrer" className="action-button whatsapp-button"> {/* Lien vers WhatsApp */}
            <img src={whatsapp} alt="WhatsApp" className="whatsApp-logo" /> <span className="whatsapp-text">Contacter moi</span>
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