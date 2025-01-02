import React, { useState, useEffect } from 'react';
import './ProductGrid.css';

function ProductGrid({
  currentPageData,
  focusedCard,
  setFocusedCard,
  handleSizeChange,
  quantities,
  updateQuantity,
  addToCart,
  selectedSizes,
  setTooltipMessage
}) {
  const [currentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12); // Par défaut 12 éléments par page
  
  // Calculer dynamiquement le nombre d'éléments par page selon la taille de l'écran
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(5); // Pour les petits écrans, afficher moins de cartes
      } else {
        setItemsPerPage(12); // Pour les grands écrans, afficher plus de cartes
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);

    return () => {
      window.removeEventListener('resize', updateItemsPerPage);
    };
  }, []);

  if (!currentPageData || currentPageData.length === 0) {
    return <div>Aucun parfum à afficher</div>;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = currentPageData.slice(startIndex, startIndex + itemsPerPage);

  const handleCardClick = (productId) => {
    setFocusedCard(productId); // Focus sur la carte lorsqu'elle est cliquée
  };

  const handleAddToCart = (product, selectedSize) => {
    const price = selectedSize === '30ml' ? product.prix_30ml : selectedSize === '50ml' ? product.prix_50ml : product.prix_70ml;

    if (price === undefined) {
      setTooltipMessage('Veuillez sélectionner une contenance!');
      return;
    }

    addToCart(product, selectedSize, price);
  };
  
  return (
    <div className="product-grid-container">
      <div className="product-grid">
        {currentItems.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => handleCardClick(product.id)}
          >
            <div className="product-card-content">
              {/* Nom produit, marque et tailles */}
              <div className="product-info">
                <h2 className="product-name">{product.nom_produit}</h2>
                <p className="brand-name">{product.nom_marque}</p>

                {/* Sélection de la contenance */}
                <div className="size-selection">
                  <p>Choisissez une contenance :</p>
                  {product.prix_30ml && (
                    <div>
                      <input
                        type="radio"
                        id={`size-30ml-${product.id}`}
                        name={`size-${product.id}`}
                        value="30ml"
                        onChange={() => handleSizeChange(product.id, '30ml')}
                        checked={selectedSizes[product.id] === '30ml'}
                      />
                      <label htmlFor={`size-30ml-${product.id}`}>30ml - {product.prix_30ml.toFixed(2)}€</label>
                    </div>
                  )}
                  {product.prix_50ml && (
                    <div>
                      <input
                        type="radio"
                        id={`size-50ml-${product.id}`}
                        name={`size-${product.id}`}
                        value="50ml"
                        onChange={() => handleSizeChange(product.id, '50ml')}
                        checked={selectedSizes[product.id] === '50ml'}
                      />
                      <label htmlFor={`size-50ml-${product.id}`}>50ml - {product.prix_50ml.toFixed(2)}€</label>
                    </div>
                  )}
                  {product.prix_70ml && (
                    <div>
                      <input
                        type="radio"
                        id={`size-70ml-${product.id}`}
                        name={`size-${product.id}`}
                        value="70ml"
                        onChange={() => handleSizeChange(product.id, '70ml')}
                        checked={selectedSizes[product.id] === '70ml'}
                      />
                      <label htmlFor={`size-70ml-${product.id}`}>70ml - {product.prix_70ml.toFixed(2)}€</label>
                    </div>
                  )}
                </div>

                {/* Quantité */}
                <div className="quantity-input">
                  <label htmlFor="quantity">Quantité :</label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantities[product.id] || 1}
                    onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                    min="1"
                  />
                </div>

                {/* Bouton Ajouter au Panier */}
                <div className="add-to-cart">
                  <button
                    className="btn-add-to-cart"
                    onClick={() => handleAddToCart(product, selectedSizes[product.id])}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
