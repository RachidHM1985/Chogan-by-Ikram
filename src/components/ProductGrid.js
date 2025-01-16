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
}) {
  const [currentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Dynamically adjust the number of items per page based on the screen width
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(12);
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
    setFocusedCard(productId);
  };

  const handleAddToCart = (product, selectedSize) => {
    const price = selectedSize === '30ml' ? product.prix_30ml : selectedSize === '50ml' ? product.prix_50ml : product.prix_70ml;

    if (selectedSize === undefined) {
      addToCart(product, selectedSize, price);
      return;
    }

    // Add to cart
    addToCart(product, selectedSize, price);

    // Close the card after adding to the cart
    setFocusedCard(null);
  };

  // Handle closing the product details view when clicking on the overlay
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('product-details-overlay')) {
      setFocusedCard(null); // Close the product details view
    }
  };

  const getPrice = (product) => {
    const price = product.prix_30ml || product.prix_50ml || product.prix_70ml;
    return price ? price.toFixed(2) : "N/A";
  };

  return (
    <div className="product-grid-container">
      {focusedCard ? (
        <div className="product-details-overlay" onClick={handleOverlayClick}>
          <div className="product-details">
            <div className="product-details-close" onClick={() => setFocusedCard(null)}>
              X
            </div>
            {currentPageData.map((product) =>
              product.id === focusedCard ? (
                <div key={product.id} className="product-details-content">
                  {/* Dynamically generate the image URL */}
                  <img
                    src={`./photos/products/${product.genre.toLowerCase()}.png`}
                    alt={product.nom_produit}
                    className="product-details-image"
                    onError={(e) => e.target.src = "/default-image.jpg"} // Fallback if image not found
                  />
                  <div className="product-details-info">
                    <p>Inspiré de</p>
                    <h2>{product.nom_produit}</h2>
                    <h2>{product.nom_marque}</h2>
                    <p>Réf: {product.code}</p>
                    <p>Choisissez une contenance :</p>
                    <div className="size-selection">                     
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
                          {product.prix_30ml && <p>30ml - {product.prix_30ml.toFixed(2)}€</p>}
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
                        {product.prix_50ml && <p>50ml - {product.prix_50ml.toFixed(2)}€</p>}
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
                           {product.prix_70ml && <p>70ml - {product.prix_70ml.toFixed(2)}€</p>}
                        </div>
                      )}
                    </div>

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
              ) : null
            )}
          </div>
        </div>
      ) : (
        <div className="product-grid">
          {currentItems.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleCardClick(product.id)}
            >
              {/* Dynamically generate the image URL */}
              <img
                src={`./photos/products/${product.genre.toLowerCase()}.png`}
                alt={product.nom_produit}
                className="product-card-image"
                onError={(e) => e.target.src = "/default-image.jpg"}  // Fallback if image not found
                />

              <div className="product-card-content">
                <p>Inspiré de</p>
                <h1><strong>{product.nom_produit}</strong></h1>
                <h2><strong>{product.nom_marque}</strong></h2>
                <p>Réf: {product.code}</p>
                À partir de {getPrice(product)}€
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGrid;
