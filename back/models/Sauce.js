const mongoose = require('mongoose');

//schema de données pour SAUCE
const sauceSchema = mongoose.Schema({
    name : {type: String, required: true },
    manufacturer : {type: String, required: true },
    description : {type: String, required: true },
    mainPepper : {type: String, required: true }, // le principal ingrédient épicé de la sauce
    imageUrl : {type: String, required: true }, // l'URL de l'image de la sauce téléchargée par l'utilisateur
    heat : {type: Number, required: true },
    likes :{type: Number, required: true },
    // dislikes : {type: Number, required: true },
    // usersLiked : {[ "String <userId>" ]},
    // usersDisliked : {[ "String <userId>" ]},
});

module.exports = mongoose.model('Sauce', sauceSchema);