require('dotenv').config();  // Charger les variables d'environnement
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bodyParser = require('body-parser');

// Charger les variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL;  // URL de Supabase
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;  // Clé Anonyme de Supabase

// Vérifier si les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY doivent être définies');
}

// Initialiser Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware pour cors et parsing JSON
const corsMiddleware = cors();
const bodyParserMiddleware = bodyParser.json();

// Le module exporté est la fonction qui traite les requêtes API
module.exports = async (req, res) => {
  // Gérer le middleware CORS
  corsMiddleware(req, res, async () => {
    // Gérer le parsing du JSON
    bodyParserMiddleware(req, res, async () => {
      if (req.method === 'GET') {
        // Extraire le paramètre de recherche et la pagination
        let { query, page = 1, pageSize = 5 } = req.query;

        // Valider et transformer les paramètres page et pageSize
        page = Math.max(1, parseInt(page));  // Assurez-vous que page est un nombre valide
        pageSize = Math.max(1, Math.min(100, parseInt(pageSize)));  // pageSize limité à 100 pour éviter les grosses requêtes

        // Calculer l'offset pour la pagination
        const offset = (page - 1) * pageSize;

        try {
          // Si la requête est vide, on récupère tous les parfums
          let queryBuilder = supabase
            .from('parfums')
            .select('*')
            .range(offset, offset + pageSize - 1);

          // Si un query est fourni, effectuer la recherche
          if (query && query.trim() !== '') {
            queryBuilder = queryBuilder.or(
              `nom_produit.ilike.%${query}%,code.ilike.%${query}%,genre.ilike.%${query}%,nom_marque.ilike.%${query}%`
            );
          }

          // Exécuter la requête
          const { data, error, count } = await queryBuilder;

          // Si erreur lors de la requête Supabase
          if (error) {
            console.error('Erreur Supabase:', error.message);
            return res.status(500).json({ error: error.message });
          }

          // Retourner les résultats sous forme de JSON
          res.json({
            results: data,
            total: count,
            totalPages: Math.ceil(count / pageSize),  // Calculer les pages avec pageSize dynamique
          });
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
          res.status(500).json({ error: 'Erreur interne du serveur' });
        }
      } else {
        // Si la méthode n'est pas GET, répondre par une erreur 405
        res.status(405).json({ error: 'Method Not Allowed' });
      }
    });
  });
};
