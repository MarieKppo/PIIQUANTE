const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use((req, res, next) => {
    console.log(`Réponse reçue.`);
    next();
}); 

app.use((req,res, next) => {
    res.json({message: `Votre requête a bien été reçue.`})
});

module.exports = app;

mongoose.connect('mongodb+srv://Marie-C:iohTi3s0zfkc9sDj@cluster0.xdms5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
