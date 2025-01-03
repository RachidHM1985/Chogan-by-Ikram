import React, { useState, useEffect, useRef } from 'react';
import ReactPaginate from 'react-paginate';
import './SearchParfums.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTrash, faHome } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Filter from './Filter';
import ProductGrid from './ProductGrid';
import SearchBar from './SearchBar';  // Importer SearchBar

function SearchParfums() {
  const [results, setResults] = useState([]);
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
  const [prixFilter, setPrixFilter] = useState('');
  const [marqueFilter, setMarqueFilter] = useState('');
  const [sortOption, setSortOption] = useState('');
  const itemsPerPage = 12;
  const cartRef = useRef();
  const [errorMessage,setErrorMessage] = useState('');
  const navigate = useNavigate();


  const formFields = [
    {
      name: 'name',
      label: 'Nom',
      type: 'text',
      required: true,
      validation: (value) => value !== '',
      errorMessage: 'Veuillez entrer votre nom.',
    },
    {
      name: 'prenom',
      label: 'Prénom',
      type: 'text',
      required: true,
      validation: (value) => value !== '',
      errorMessage: 'Veuillez entrer votre prénom.',
    },
    {
      name: 'phone',
      label: 'Téléphone',
      type: 'tel',
      required: true,
      validation: (value) => /^\+?[0-9]\d{1,14}$/.test(value),
      errorMessage: 'Numéro de téléphone invalide.',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: (value) => /\S+@\S+\.\S+/.test(value),
      errorMessage: 'Email invalide.',
    },
  ];

  
  // Filtered and sorted results
  const offset = currentPage * itemsPerPage;
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

  const handleInputFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Vérification de la validité du formulaire
  useEffect(() => {
    const isValid = formFields.every((field) => {
      const value = form[field.name];
      return field.validation(value);
    });
    setIsFormValid(isValid);
  }, [form]);

  // Soumettre le formulaire
   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
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

  return (
    <div className="results-display">
      <h2 className="marble-text">Recherchez le Parfum de Vos Rêves</h2>
      <div className="filter-bar-container">
        <button onClick={() => navigate('/')} className="btn-home">
          <FontAwesomeIcon icon={faHome} size="1x" />
        </button>
        <Filter
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          prixFilter={prixFilter}
          setprixFilter={setPrixFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
          <SearchBar setResults={setResults} />        
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
                  <div className="cart-item-details">
                    <span className="product-name">
                      <strong>{item.nom_produit} - {item.nom_marque}</strong>
                    </span>
                    <span className="cart-popup-details">- {item.size} - {item.prix}€ x {item.quantity}</span>
                    <span className="item-total">{item.prix * item.quantity}€</span>
                  </div>
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
            <div>
            <form onSubmit={handleSubmit}>
  {formFields.map((field, index) => (
    <div key={field.name} className="form-group">
      {/* Vérifiez si l'index est pair ou impair pour diviser en 2 inputs par ligne */}
      {index % 2 === 0 && (
        <div className="form-row">
          <div className="input-container">
            <label htmlFor={formFields[index].name}>
              {formFields[index].label} <span className="required">*</span>
            </label>
            <input
              type={formFields[index].type}
              id={formFields[index].name}
              name={formFields[index].name}
              value={form[formFields[index].name]}
              onChange={handleInputFormChange}
              required={formFields[index].required}
            />
            {!formFields[index].validation(form[formFields[index].name]) && form[formFields[index].name] !== '' && (
              <div className="error-message">{formFields[index].errorMessage}</div>
            )}
          </div>
          {formFields[index + 1] && (
            <div className="input-container">
              <label htmlFor={formFields[index + 1].name}>
                {formFields[index + 1].label} <span className="required">*</span>
              </label>
              <input
                type={formFields[index + 1].type}
                id={formFields[index + 1].name}
                name={formFields[index + 1].name}
                value={form[formFields[index + 1].name]}
                onChange={handleInputFormChange}
                required={formFields[index + 1].required}
              />
              {!formFields[index + 1].validation(form[formFields[index + 1].name]) && form[formFields[index + 1].name] !== '' && (
                <div className="error-message">{formFields[index + 1].errorMessage}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  ))}
  <button type="submit" disabled={!isFormValid} className="submit-btn">
    Confirmer la commande
  </button>
</form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
            
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
