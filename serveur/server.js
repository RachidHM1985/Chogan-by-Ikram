// server.js (Backend Node.js)

const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Configurer SendGrid avec la clé API
sgMail.setApiKey('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');

// Middleware pour parser les données JSON
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',  // Vous pouvez remplacer par '*' pour permettre toutes les origines
  }));

  app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
  });

  app.options('*', cors()); // autoriser les pré-requêtes CORS (OPTIONS)


  app.post('/send-email', async (req, res) => {
    const { email, name, prenom, cart, total } = req.body;
  
    // Email à l'utilisateur
    const userMailOptions = {
      to: email,
      from: 'hachem.rach@gmail.com',  // Utilisez un email validé pour l'envoi
      subject: 'Confirmation de votre commande Chogan',
      text: `Bonjour ${prenom} ${name},\n\nMerci pour votre commande ! Voici les détails :\n\n${cart.map(item => `${item.nom_produit} - ${item.size} - ${item.price}€ x ${item.quantity}`).join('\n')}\n\nTotal : ${total}€.\n\nNous allons traiter votre commande et nous reviendrons vers vous pour vous indiquer les modalités de paiement et de livraison.\n\nCordialement,\n\nIkram B.`,
      html: `
        <h1>Confirmation de votre commande</h1>
        <p>Bonjour ${prenom} ${name},</p>
        <p>Merci pour votre commande ! Voici les détails :</p>
        <ul>
          ${cart.map(item => `<li>${item.nom_produit} - ${item.size} - ${item.price}€ x ${item.quantity}</li>`).join('')}
        </ul>
        <p><strong>Total : ${total}€</strong></p>
        <p>Nous vous confirmons que nous avons enregistré votre commande et que nous allons la traiter.<br>Prochainement, nous allons vous contacter pour vous indiquer les modalités de paiement et de livraison.</p>
        <p>Cordialement,<br>Ikram B.</p>
      `,
    };
  
    // Email à l'administrateur
    const adminMailOptions = {
      to: 'ikram.bakmou@outlook.fr',  // L'email de l'administrateur
      from: 'hachem.rach@gmail.com',
      subject: `Nouvelle commande de ${prenom} ${name}`,
      text: `Nouvelle commande reçue :\n\nNom: ${prenom} ${name}\nTéléphone: ${req.body.phone}\nEmail: ${email}\n\nDétails de la commande:\n${cart.map(item => `${item.code} - ${item.nom_produit} - ${item.size} - ${item.price}€ x ${item.quantity}`).join('\n')}\n\nTotal : ${total}€.\n\nMerci de traiter cette commande.`,
    };
  
    try {
      // Envoi des emails
      await sgMail.send(userMailOptions);
      await sgMail.send(adminMailOptions);
      res.status(200).json({ message: 'Emails envoyés avec succès' });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email', error);
      res.status(500).json({ message: 'Erreur d\'envoi de l\'email' });
    }
  });
// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
