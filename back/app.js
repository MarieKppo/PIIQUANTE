const express = require('express');
const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');
//connexion BDD
mongoose.connect('mongodb+srv://Marie-C:iohTi3s0zfkc9sDj@cluster0.xdms5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// app.use((req, res, next) => {
//     console.log(`Réponse reçue.`);
//     next();
// }); 

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;


