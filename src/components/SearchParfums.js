import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import ReactPaginate from 'react-paginate';
import supabase from './supabaseClient.js';
import './SearchParfums.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash, faHome } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Filter from './Filter';
import ProductGrid from './ProductGrid'; // Import the new ProductGrid component

function SearchParfums() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [form, setForm] = useState({ name: '', prenom: '', phone: '', email: '' });
  const [isFormValid, setIsFormValid] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [focusedCard, setFocusedCard] = useState(null);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [selectedSizes, setSelectedSizes] = useState({});
  const [genreFilter, setGenreFilter] = useState('');
  const [prixFilter, setprixFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const itemsPerPage = 12;
  const cartRef = useRef();
  const [setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [marqueFilter, setMarqueFilter] = useState(''); // Default to a specific brand if needed
  
  // Fetch all parfums from the database when the component mounts
  useEffect(() => {
    const fetchAllParfums = async () => {
      const { data, error } = await supabase.from('parfums').select('*');
      if (error) {
        console.error('Erreur lors de la recherche:', error);
      } else {
        setResults(data);
        setSuggestions(data);
      }
    };
    fetchAllParfums();
  }, []);

  // Handle search functionality when the user types in the search input
  useEffect(() => {
    const handleSearch = async (value) => {
      const { data, error } = await supabase
        .from('parfums')
        .select('*')
        .or(`nom_produit.ilike.%${value}%,code.ilike.%${value}%,genre.ilike.%${value}%,nom_marque.ilike.%${value}%`);
      if (error) {
        console.error('Erreur lors de la recherche:', error);
      } else {
        setResults(data);
        setSuggestions(data);
      }
    };

    if (query) {
      handleSearch(query);
    }
  }, [query]);

  // Check if the form is valid whenever the user inputs data
  useEffect(() => {
    const { name, prenom, phone, email } = form;
    setIsFormValid(name && prenom && phone && email);
  }, [form]);

  // Autosuggest fetch and clear suggestions
  const onSuggestionsFetchRequested = ({ value }) => {
    setQuery(value);
  };
  
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };
  
  const getSuggestionValue = suggestion => suggestion.nom_produit;
  const renderSuggestion = suggestion => <div style={{ display: 'none' }}>{suggestion.nom_produit}</div>;

  const inputProps = {
    placeholder: 'Entrez votre recherche...',
    value: query,
    onChange: (event, { newValue }) => setQuery(newValue),
    className: 'modern-search-bar'
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const resetCart = () => {
    setCart([]);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    resetCart();
  };

  const offset = currentPage * itemsPerPage;

  // Apply filters and sort before applying pagination
  const filteredResults = results
    .filter(result => (genreFilter ? result.genre === genreFilter : true)) // Filter by genre
    .filter(result => {
      if (!prixFilter) return true;
      const [min, max] = prixFilter.split('-').map(Number);
      const price = Math.min(result.prix_30ml || Infinity, result.prix_50ml || Infinity, result.prix_70ml || Infinity);
      return price >= min && price <= max;
    }) // Filter by price range
    .filter(result => (marqueFilter ? result.nom_marque === marqueFilter : true)) // Filter by brand
    .sort((a, b) => {
      if (sortOption === 'price-asc') {
        return Math.min(a.prix_30ml || Infinity, a.prix_50ml || Infinity, a.prix_70ml || Infinity) - Math.min(b.prix_30ml || Infinity, b.prix_50ml || Infinity, b.prix_70ml || Infinity);
      } else if (sortOption === 'price-desc') {
        return Math.min(b.prix_30ml || Infinity, b.prix_50ml || Infinity, b.prix_70ml || Infinity) - Math.min(a.prix_30ml || Infinity, a.prix_50ml || Infinity, a.prix_70ml || Infinity);
      }
      return 0;
    });

  const currentPageData = filteredResults.slice(offset, offset + itemsPerPage);

  // Add a product to the cart with selected size and quantity
  const addToCart = (product, size, prix) => {
    if (!size) {
      // Gestion de l'erreur si la taille n'est pas sélectionnée
      setTooltipMessage('Veuillez sélectionner une contenance!');
      setShowTooltip(true);
  
      // Masquer le message après un délai
      setTimeout(() => setShowTooltip(false), 2000); 
      return;
    }
  
    // Calculer la quantité par défaut ou utiliser la valeur entrée par l'utilisateur
    const quantity = quantities[product.id] || 1;
  
    // Vérifier si le produit existe déjà dans le panier
    const existingProductIndex = cart.findIndex(item => item.id === product.id && item.size === size);
  
    if (existingProductIndex !== -1) {
      // Si le produit existe déjà, on met à jour la quantité
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Sinon, on ajoute le nouveau produit au panier
      setCart([...cart, { ...product, size, prix, quantity }]);
    }
  
    // Réinitialiser la carte sélectionnée après l'ajout
    setFocusedCard(null); // Réinitialiser l'état de la carte sélectionnée
    
    // Message de confirmation de l'ajout au panier
    setTooltipMessage('Article ajouté au panier');
    setShowTooltip(true);
  
    // Masquer le message après un délai
    setTimeout(() => setShowTooltip(false), 2000); 
  };

  const updateQuantity = (productId, quantity) => {
    setQuantities({ ...quantities, [productId]: Math.max(quantity, 1) });
  };

  const handleCheckout = () => {
    setShowCart(true);
  };

  const handleClickOutside = (event) => {
    if (cartRef.current && !cartRef.current.contains(event.target)) {
      setShowCart(false);
    }
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.prenom || !form.phone || !form.email) {
      setErrorMessage("Tous les champs obligatoires doivent être renseignés.");
      return;
    }

    const orderData = {
      name: form.name,
      prenom: form.prenom,
      phone: form.phone,
      email: form.email,
      cart: cart,
      total: calculateTotal(),
    };

    try {
      const response = await axios.post('/api/sendMail', orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        setShowConfirmation(true);
        resetCart();
        setShowCart(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la commande", error);
      setErrorMessage("Une erreur est survenue, veuillez réessayer.");
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.prix * item.quantity, 0).toFixed(2);
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes({ ...selectedSizes, [productId]: size });
  };

  const handleRedirectToHome = () => {
    navigate('/');
  };

  return (
    <div className="results-display">
      <h2 className="marble-text">Recherchez le Parfum de Vos Rêves</h2>
      <div className="filter-bar-container">
        <button onClick={handleRedirectToHome} className="btn-home">
          <FontAwesomeIcon icon={faHome} size="1x" />
        </button>
        <Filter
            genreFilter={genreFilter}
            setGenreFilter={setGenreFilter}
            prixFilter={prixFilter}
            setprixFilter={setprixFilter}
            sortOption={sortOption}
            setSortOption={setSortOption}
        />
        <div className="modern-search-bar-container">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>
        <div className="cart-icon" onClick={handleCheckout}>
          <FontAwesomeIcon icon={faShoppingCart} />
          <span className="cart-count">{cart.length}</span>
        </div>
      </div>

      <ProductGrid
        currentPageData={currentPageData}
        focusedCard={focusedCard}
        setFocusedCard={setFocusedCard}
        handleSizeChange={handleSizeChange}
        quantities={quantities}
        updateQuantity={updateQuantity}
        addToCart={addToCart}
        selectedSizes={selectedSizes}
        setTooltipMessage={setTooltipMessage}
      />

      {filteredResults.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={'← Précédent'}
          nextLabel={'Suivant →'}
          pageCount={Math.ceil(filteredResults.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName={'pagination flex justify-center'}
          previousLinkClassName={'pagination__link mx-1 px-3 py-1 border border-gray-300 rounded cursor-pointer'}
          nextLinkClassName={'pagination__link mx-1 px-3 py-1 border border-gray-300 rounded cursor-pointer'}
          disabledClassName={'pagination__link--disabled cursor-not-allowed opacity-50'}
          activeClassName={'pagination__link--active bg-blue-500 text-white'}
        />
      )}     
      {showCart && (
  <div className="cart-popup-overlay">
    <div className="cart-popup" ref={cartRef}>
      <h4 className="popup-title"><strong>Récapitulatif de la commande</strong></h4>          
      
      <div className="cart-items">
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <span className="product-name">
                <strong>{item.nom_produit} {item.nom_marque}</strong>
              </span>
              <span className="cart-popup-details">- {item.size} - {item.prix}€ x {item.quantity}</span>           
              <span className="item-total">
                {item.prix * item.quantity}€
              </span>
              <button className="remove-btn" onClick={() => removeFromCart(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="total">
        <h3 className="total-amount">Total : {calculateTotal()}€</h3>
        <p>(Les frais de livraison ne sont pas inclus)</p>
      </div>
      
      <form onSubmit={handleSubmit} className="order-form">
        <h3>Informations nécessaires</h3>
        
        <div className="form-group">
          <label htmlFor="name">Nom <span className="required">*</span></label>
          <input type="text" id="name" name="name" value={form.name} onChange={handleInputChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="prenom">Prénom <span className="required">*</span></label>
          <input type="text" id="prenom" name="prenom" value={form.prenom} onChange={handleInputChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Téléphone <span className="required">*</span></label>
          <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleInputChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleInputChange} required />
        </div>
        
        <button type="submit" className="confirm-order-btn" disabled={!isFormValid}>
          Confirmer la commande
        </button>
      </form>
    </div>
  </div>
)}


      {showConfirmation && (
        <div className="confirmation-popup">
          <h2>Merci pour votre commande !</h2>
          <p>Votre commande a été enregistrée avec succès. Vous recevrez bientôt un email de confirmation.</p>
          <button className="close-btn" onClick={handleCloseConfirmation}>
            Fermer
          </button>
        </div>
      )}
      {showTooltip && (
          <div className={`tooltip ${!selectedSizes[focusedCard] ? 'tooltip-error' : 'tooltip-succes'} ${showTooltip ? 'show' : ''}`}>
          {tooltipMessage}
        </div>
      )}
    </div>
  );
}

export default SearchParfums;
