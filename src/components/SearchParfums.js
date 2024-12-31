import React, { useState, useEffect, useRef } from 'react';
import Autosuggest from 'react-autosuggest';
import ReactPaginate from 'react-paginate';
import supabase from './supabaseClient.js';
import './SearchParfums.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash, faPlus, faMinus, faHome } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const [priceFilter, setPriceFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const itemsPerPage = 10;
  const cartRef = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

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

  useEffect(() => {
    const { name, prenom, phone, email } = form;
    setIsFormValid(name && prenom && phone && email);
  }, [form]);

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

  // Fonction pour réinitialiser le panier
const resetCart = () => {
  setCart([]); // Vide le panier
};


// Fonction pour fermer la popup de confirmation et réinitialiser le panier
const handleCloseConfirmation = () => {
  setShowConfirmation(false);
  resetCart(); // Réinitialiser le panier
};
  const offset = currentPage * itemsPerPage;
  const filteredResults = results
    .filter(result => (genreFilter ? result.genre === genreFilter : true))
    .filter(result => {
      if (!priceFilter) return true;
      const [min, max] = priceFilter.split('-').map(Number);
      const price = Math.min(result.prix_30ml || Infinity, result.prix_50ml || Infinity, result.prix_70ml || Infinity);
      return price >= min && price <= max;
    })
    .sort((a, b) => {
      if (sortOption === 'price-asc') {
        return Math.min(a.prix_30ml || Infinity, a.prix_50ml || Infinity, a.prix_70ml || Infinity) - Math.min(b.prix_30ml || Infinity, b.prix_50ml || Infinity, b.prix_70ml || Infinity);
      } else if (sortOption === 'price-desc') {
        return Math.min(b.prix_30ml || Infinity, b.prix_50ml || Infinity, b.prix_70ml || Infinity) - Math.min(a.prix_30ml || Infinity, a.prix_50ml || Infinity, a.prix_70ml || Infinity);
      }
      return 0;
    });
  const currentPageData = filteredResults.slice(offset, offset + itemsPerPage);

  const addToCart = (product, size, price) => {
    if (!size) {
      setTooltipMessage('Veuillez sélectionner une contenance!');
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 1000);
      return;
    }

    const quantity = quantities[product.id] || 1;
    const existingProductIndex = cart.findIndex(item => item.id === product.id && item.size === size);
    if (existingProductIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, size, price, quantity }]);
    }

    setTooltipMessage('Article ajouté au panier');
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1000);
  };

  const updateQuantity = (productId, quantity) => {
    setQuantities({ ...quantities, [productId]: Math.max(quantity, 1) });
  };

  const incrementCounter = (productId) => {
    const quantity = quantities[productId] || 1;
    updateQuantity(productId, quantity + 1);
  };

  const decrementCounter = (productId) => {
    const quantity = quantities[productId] || 1;
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    }
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
  
    // Vérification des champs du formulaire
    if (!form.name || !form.prenom || !form.phone || !form.email) {
      setErrorMessage("Tous les champs obligatoires doivent être renseignés.");
      return;
    }
  
    // Préparer les données à envoyer
    const orderData = {
      name: form.name,
      prenom: form.prenom,
      phone: form.phone,
      email: form.email,
      cart: cart, // Le panier de commande
      total: calculateTotal(), // Calcul du total
    };
  
    // Envoi des données à l'API backend
    try {
      const response = await axios.post('/api/sendMail', orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
  
      if (response.status === 200) {
        setShowConfirmation(true);  // Afficher la popup de confirmation
        resetCart();  // Réinitialiser le formulaire
        setShowCart(false);  // Fermer la popup du panier après la confirmation de commande
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
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes({ ...selectedSizes, [productId]: size });
  };

  const handleRedirectToHome = () => {
    navigate('/'); // Navigue vers la page d'accueil (assurez-vous que '/' est la route de votre page d'accueil)
  };

  return (
    <div className="results-display">
      <button onClick={handleRedirectToHome} className="btn-home">
      <FontAwesomeIcon icon={faHome} size="1x" />
      </button>
      <h2 className="marble-text">Recherchez le Parfum de Vos Rêves</h2>
      <div className="search-and-filters">
        <div className="search-bar-container">
        <div className="filters">
          <select onChange={(e) => setGenreFilter(e.target.value)} value={genreFilter}>
            <option value="">Tous les catégories</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Unisexe">Unisexe</option>            
            <option value="Luxe">Luxe</option>
          </select>
          <select onChange={(e) => setPriceFilter(e.target.value)} value={priceFilter}>
            <option value="">Tous les prix</option>
            <option value="0-50">0€ - 50€</option>
            <option value="50-100">50€ - 100€</option>
          </select>
          <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
            <option value="">Trier par</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
          />
        </div>
        
      </div>
      <div className="cart-icon" onClick={handleCheckout}>
        <FontAwesomeIcon icon={faShoppingCart} />
        <span className="cart-count">{cart.length}</span>
      </div>
      <div className="product-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {currentPageData.map(result => (
          <div
            className="product-card bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
            key={result.id}
            onMouseEnter={() => setFocusedCard(result.id)}
            onMouseLeave={() => setFocusedCard(null)}
          >
            <div className="p-4">
              <h3 className="text-gray-700 mb-1">INSPIRÉ DE</h3>
              <h4 className="text-lg font-semibold">{result.nom_marque}</h4>
              <p className="text-lg font-semibold">{result.nom_produit}</p>
              <label>Prix :</label><br />
              <div className="select-options">
                {result.prix_30ml !== null && (
                  <div>
                    <input
                      type="radio"
                      id={`size-30ml-${result.id}`}
                      name={`size-${result.id}`}
                      value="30ml"
                      onChange={() => handleSizeChange(result.id, '30ml')}
                    />
                    <label htmlFor={`size-30ml-${result.id}`}>{result.prix_30ml.toFixed(2)}€/30ml</label>
                  </div>
                )}
                {result.prix_50ml !== null && (
                  <div>
                    <input
                      type="radio"
                      id={`size-50ml-${result.id}`}
                      name={`size-${result.id}`}
                      value="50ml"
                      onChange={() => handleSizeChange(result.id, '50ml')}
                    />
                    <label htmlFor={`size-50ml-${result.id}`}>{result.prix_50ml.toFixed(2)}€/50ml</label>
                  </div>
                )}
                {result.prix_70ml !== null && (
                  <div>
                    <input
                      type="radio"
                      id={`size-70ml-${result.id}`}
                      name={`size-${result.id}`}
                      value="70ml"
                      onChange={() => handleSizeChange(result.id, '70ml')}
                    />
                    <label htmlFor={`size-70ml-${result.id}`}>{result.prix_70ml.toFixed(2)}€/70ml</label>
                  </div>
                )}
              </div><br />
              <label htmlFor="quantity">Quantité:</label>
              <div className="quantity-input">
                <button type="button" onClick={() => decrementCounter(result.id)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantities[result.id] || 1}
                  onChange={(e) => updateQuantity(result.id, Number(e.target.value))}
                  min="1"
                />
                <button type="button" onClick={() => incrementCounter(result.id)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
              {focusedCard === result.id && (
                <div className="add-to-cart-container">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(result, selectedSizes[result.id], result[`prix_${selectedSizes[result.id]}`])}
                    onMouseEnter={() => !selectedSizes[result.id] && setTooltipMessage('Veuillez sélectionner une contenance!')}
                    
                  >
                    <FontAwesomeIcon icon={faShoppingCart} /> Ajouter au panier
                  </button>
                  
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredResults.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={'← Précédent'}
          nextLabel={'Suivant →'}
          pageCount={Math.ceil(filteredResults.length / itemsPerPage)}
          onPageChange={handlePageClick}
          containerClassName={'pagination flex justify-center mt-6'}
          previousLinkClassName={'pagination__link mx-1 px-3 py-1 border border-gray-300 rounded cursor-pointer'}
          nextLinkClassName={'pagination__link mx-1 px-3 py-1 border border-gray-300 rounded cursor-pointer'}
          disabledClassName={'pagination__link--disabled cursor-not-allowed opacity-50'}
          activeClassName={'pagination__link--active bg-blue-500 text-white'}
        />
      )}
      {showCart && (
  <div className="cart-popup" ref={cartRef}>
    <h4><strong>Récapitulatif de la commande</strong></h4>
    <ul>
      {cart.map((item, index) => (
        <li key={index}>
          <span className="lineNomProduit">
            <strong>{item.nom_produit} {item.nom_marque}</strong>
        </span>
        <span className="linePriceQuantity">- {item.size} - {item.price}€ x {item.quantity}</span>           
          <span className="line-total">
      {item.price * item.quantity}€
    </span>
          <button className="remove-btn" onClick={() => removeFromCart(index)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </li>
      ))}
    </ul>
    <div className="total">
      <h3 className="text-lg font-semibold">Total : {calculateTotal()}€</h3>
      {/* Affichage du total sans les frais de livraison */}
      <p>(Les frais de livraison ne sont pas inclus)</p>
    </div>
    
    {/* Formulaire de commande */}
    <form onSubmit={handleSubmit} className="order-form">
      <h3>Informations nécessaires</h3>
      
      <label>
        <span>Nom <span className="required">*</span></span>
        <input type="text" name="name" value={form.name} onChange={handleInputChange} required />
      </label>
      <label>
        <span>Prénom <span className="required">*</span></span>
        <input type="text" name="prenom" value={form.prenom} onChange={handleInputChange} required />
      </label>
      <label>
        <span>Téléphone <span className="required">*</span></span>
        <input type="tel" name="phone" value={form.phone} onChange={handleInputChange} required />
      </label>
      <label>
        <span>Email <span className="required">*</span></span>
        <input type="email" name="email" value={form.email} onChange={handleInputChange} required />
      </label>
      
      <button type="submit" className="confirm-order-btn" disabled={!isFormValid}>
        Confirmer la commande
      </button>
    </form>
  </div>
)}

{/* Pop-up de confirmation de commande */}
{showConfirmation && (
  <div className="confirmation-popup">
    <h2>Merci pour votre commande !</h2>
    <p>
      Votre commande a été enregistrée avec succès. Vous recevrez bientôt un email de confirmation.
    </p>
    <button className="close-btn" onClick={handleCloseConfirmation}>
      Fermer
    </button>
  </div>
)}

      {showTooltip && <div className={`tooltip ${!selectedSizes[focusedCard] ? 'tooltip-error' : ''}`}>{tooltipMessage}</div>}
      {showConfirmation && (
        <div className="confirmation-message">
          <h2>Merci pour votre commande !</h2>
          <p>Votre commande a été enregistrée. Nous vous contacterons sous peu pour les modalités de paiement et de livraison.</p>
          <button className="close-btn" onClick={() => setShowConfirmation(false)}>Fermer</button>
        </div>
      )}
    </div>
  );
}

export default SearchParfums;