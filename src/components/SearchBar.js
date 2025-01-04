import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './SearchBar.css';
import debounce from 'lodash.debounce';

const SearchBar = ({ setResults }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const fetchResults = async (query) => {
      setLoading(true);
      try {
        const response = await axios.get('/api/search', {
          params: { query, page: 1, pageSize: 100 },
        });
        if (response.data && response.data.results) {
          setResults(response.data.results);  // Remplir directement les résultats
        } else {
          setResults([]); // Aucun résultat
        }
      } catch (err) {
        console.error('Erreur de recherche:', err);
        setError('Erreur lors de la recherche');
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      const debouncedSearch = debounce(fetchResults, 500);
      debouncedSearch(query);
    }, [query, setResults]);
  
    const handleChange = (e) => {
      setQuery(e.target.value);
    };
  
    return (
      <div className='modern-search-bar-container'>
        <input
            className='modern-search-bar'
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Recherchez votre parfum..."
        />
        {loading && <div>Chargement...</div>}
        {error && <div>{error}</div>}
      </div>
    );
  };

export default SearchBar;
