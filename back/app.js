const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');

//importation des routes user et sauces
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces')
const path = require('path');

const app = express();//application d'express

//connexion BDD
mongoose.connect('mongodb+srv://Marie-C:iohTi3s0zfkc9sDj@cluster0.xdms5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());
app.use(helmet());
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;