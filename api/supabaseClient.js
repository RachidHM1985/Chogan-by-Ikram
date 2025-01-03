require('dotenv').config();  // Charger les variables d'environnement
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Récupérer les variables d'environnement
const supabaseUrl = 'https://dzwzqcwzbprelibrlinq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6d3pxY3d6YnByZWxpYnJsaW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMDMwOTYsImV4cCI6MjA1MDg3OTA5Nn0.smyNc9XjdbhZUAZhQTnUME1-Qgc-yM9K8y3GuDKlIc8';
const PORT = process.env.PORT || 5000; // Le port peut être défini par une variable d'environnement
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);
// Vérifier que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('SUPABASE_URL et SUPABASE_ANON_KEY sont requis');
}

// Initialisation de Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialisation d'Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());  // Pour parser le JSON dans les requêtes

// Route de recherche avec un SELECT * pour obtenir tous les parfums
app.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    // Si le query est vide, récupérer tous les parfums
    let queryBuilder = supabase.from('parfums').select('*');

    if (query && query.trim() !== '') {
      queryBuilder = queryBuilder.or(`nom_produit.ilike.%${query}%,code.ilike.%${query}%,genre.ilike.%${query}%,nom_marque.ilike.%${query}%`);
    }

    const { data, error, count } = await queryBuilder;

    if (error) throw error;

    // Retourner les résultats avec la pagination si nécessaire
    res.json({
      results: data,
      total: count,
      totalPages: Math.ceil(count / 5),
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});


// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur API démarré sur http://localhost:${PORT}`);
});
