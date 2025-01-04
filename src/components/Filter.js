import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Filter.css';
import { debounce } from 'lodash';  // Importation de lodash.debounce

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
  setResults
}) {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const filterRef = useRef(null);

  // Utilisation de useMemo pour mémoriser les marques uniques
  const uniqueBrands = useMemo(() => {
    console.log(results)
    if (results && results.length > 0) {
      // Extrait toutes les marques
      const brands = results.map(result => result.nom_marque); 
      console.log('Marques extraites :', brands); // Débogage, vérifie les marques extraites
      return [...new Set(brands)]; // Utilisation de Set pour obtenir des valeurs uniques
    }
    return [];
  }, [results]);
  
  console.log('Marques uniques :', uniqueBrands); // Vérifiez les marques uniques après la transformation
   // Cette opération ne sera recalculée que lorsque `results` change

  // Fonction debounce pour gérer les changements de filtre
  const debouncedSetGenreFilter = useMemo(
    () => debounce((value) => setGenreFilter(value), 300),
    [setGenreFilter]
  );

  const debouncedSetPrixFilter = useMemo(
    () => debounce((value) => setprixFilter(value), 300),
    [setprixFilter]
  );

  const debouncedSetSortOption = useMemo(
    () => debounce((value) => setSortOption(value), 300),
    [setSortOption]
  );

  const debouncedSetMarqueFilter = useMemo(
    () => debounce((value) => setMarqueFilter(value), 300),
    [setMarqueFilter]
  );

  const debouncedSetResultFilter = useMemo(
    () => debounce((value) => {
      console.log('Filtre de marque sélectionné :', value);  // Déboguer la valeur
      setResults(value);
    }, 300),
    [setResults]
  );
  


  // Toggle visibility des filtres
  const toggleFiltersVisibility = (event) => {
    event.stopPropagation();
    setIsFiltersVisible((prev) => !prev);
  };

  // Fermeture des filtres si on clique en dehors du composant
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
                onChange={(e) => debouncedSetGenreFilter(e.target.value)} // Utilisation du debounce ici
                value={genreFilter}
                aria-label="Filter by genre"
              >
                <option value="">Tous les genres</option>
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Unisex">Unisexe</option>
                <option value="Luxe">Luxe</option>
              </select>
            </div>

            {/* Filtre Prix */}
            <div className="filter-item">
              <label htmlFor="price-filter">Prix</label>
              <select
                id="price-filter"
                onChange={(e) => debouncedSetPrixFilter(e.target.value)} // Debounce pour prix
                value={priceFilter}
                aria-label="Filter by price"
              >
                <option value="">Tous les prix</option>
                <option value="0-50">0€ - 50€</option>
                <option value="50-100">50€ - 100€</option>
              </select>
            </div>

            {/* Filtre Marque */}
           {/* <div className="filter-item">
              <label htmlFor="brand-filter">Marque</label>
              <select
                id="brand-filter"
                onChange={(e) => debouncedSetResultFilter(e.target.value)} // Utilisation du debounce pour éviter les appels trop fréquents                value={brandFilter}
                value={brandFilter}  // Le filtre de marque actuellement sélectionné
                aria-label="Filter by brand"
              >
                <option value="">Toutes les marques</option>
                {uniqueBrands.length > 0 ? (
                    uniqueBrands.filter(brand => brand !== '').map((brand, index) => (
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
                onChange={(e) => debouncedSetSortOption(e.target.value)} // Debounce pour tri
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
