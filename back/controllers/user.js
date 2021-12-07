//stocke les fonctions utilisateurs
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Création d'un compte utilisateur 
exports.signup = (req, res, next) =>{
    //hash du mot de passe
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

// Connexion utilisateur : vérification de l'adresse email et du mot de passe crypté
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(User => {
        if (!User) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, User.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            // console.log('corps de réponse : ' + res.body);//probleme ici
            res.status(200).json({
              userId: User._id,
              token: jwt.sign(
                { userId: User._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };