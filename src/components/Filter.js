import React, { useState, useEffect, useRef } from 'react';
import './Filter.css';

function Filter({
  genreFilter,
  setGenreFilter,
  priceFilter,
  setprixFilter,
  sortOption,
  setSortOption,
  brandFilter,
  setMarqueFilter,
  results,
}) {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [uniqueBrands, setUniqueBrands] = useState([]); // Stocke les marques uniques extraites des résultats
  const filterRef = useRef(null);

  // Fonction pour extraire les marques uniques des résultats
  const extractUniqueBrands = () => {
    if (results && results.length > 0) {
      const brands = results.map(result => result.nom_marque); // Extrait toutes les marques
      const uniqueBrands = [...new Set(brands)]; // Utilisation de Set pour obtenir des valeurs uniques
      setUniqueBrands(uniqueBrands); // Mise à jour de l'état avec les marques uniques
    }
  };

  useEffect(() => {
    // Si results changent, on met à jour la liste des marques uniques
    extractUniqueBrands();
  }, [results]); // On effectue l'extraction à chaque fois que `results` change

  const toggleFiltersVisibility = (event) => {
    event.stopPropagation();
    setIsFiltersVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFiltersVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Bouton pour afficher ou masquer les filtres */}
      {!isFiltersVisible && (
        <button
          className="toggle-filters-button"
          onClick={toggleFiltersVisibility}
          aria-label="Toggle filters visibility"
        >
          Filtres / Tri
        </button>
      )}

      {/* Lorsque les filtres sont visibles */}
      {isFiltersVisible && (
        <div className="overlay">
          <div className="filters" ref={filterRef}>
            {/* Filtre Genre */}
            <div className="filter-item">
              <label htmlFor="genre-filter">Genre</label>
              <select
                id="genre-filter"
                onChange={(e) => setGenreFilter(e.target.value)}
                value={genreFilter}
                aria-label="Filter by genre"
              >
                <option value="">Tous les genres</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Unisexe">Unisexe</option>
                <option value="Luxe">Luxe</option>
              </select>
            </div>

            {/* Filtre Prix */}
            <div className="filter-item">
              <label htmlFor="price-filter">Prix</label>
              <select
                id="price-filter"
                onChange={(e) => setprixFilter(e.target.value)}
                value={priceFilter}
                aria-label="Filter by price"
              >
                <option value="">Tous les prix</option>
                <option value="0-50">0€ - 50€</option>
                <option value="50-100">50€ - 100€</option>
              </select>
            </div>

            {/* Filtre Marque */}
         {/*   <div className="filter-item">
              <label htmlFor="brand-filter">Marque</label>
              <select
                id="brand-filter"
                onChange={(e) => setMarqueFilter(e.target.value)}
                value={brandFilter}
                aria-label="Filter by brand"
              >
                <option value="">Toutes les marques</option>
                {uniqueBrands.length > 0 ? (
                  uniqueBrands.map((brand, index) => (
                    <option key={index} value={brand}>
                      {brand}
                    </option>
                  ))
                ) : (
                  <option value="">Aucune marque disponible</option>
                )}
              </select>
            </div>*/}

            {/* Tri par prix */}
            <div className="filter-item">
              <label htmlFor="sort-option">Trier par</label>
              <select
                id="sort-option"
                onChange={(e) => setSortOption(e.target.value)}
                value={sortOption}
                aria-label="Sort options"
              >
                <option value="">Aucun tri</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filter;
