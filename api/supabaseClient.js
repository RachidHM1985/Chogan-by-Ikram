require('dotenv').config();  // Charger les variables d'environnement
const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Récupérer les variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL; // Correct variable for Supabase URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Correct variable for Supabase ANON key
const PORT = process.env.PORT || 5000; // Le port peut être défini par une variable d'environnement

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
