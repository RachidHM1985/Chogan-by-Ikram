import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = ({ setResults }) => {
  const [query, setQuery] = useState(''); // L'état pour la recherche
  const [loading, setLoading] = useState(false); // L'état de chargement
  const [error, setError] = useState(''); // L'état pour gérer les erreurs

  // Effectuer un SELECT * au démarrage pour obtenir tous les parfums
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('api/search', {
          params: { query: '' }, // Requête vide pour obtenir tous les parfums
        });

        if (response.data) {
          setResults(response.data.results); // Mettre à jour les résultats avec tous les parfums
        }
      } catch (error) {
        setError('Une erreur est survenue lors du chargement initial.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [setResults]); // Effectuer cette requête au démarrage du composant

  // Effectuer une recherche à chaque fois que la query change
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]); // Si la recherche est vide, effacer les résultats
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/search', {
          params: { query },
        });

        if (response.data) {
          setResults(response.data.results); // Envoi des résultats à SearchResults
        }
      } catch (error) {
        setError('Une erreur est survenue, veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query, setResults]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="modern-search-bar-container">
      <input
        className="modern-search-bar"
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Recherchez votre parfum..."
      />
      {loading && <div>Chargement...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default SearchBar;
