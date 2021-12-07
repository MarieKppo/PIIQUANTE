//stocke la logique métier : les fonctions/méthodes

//importation du modèle et du package fichier nécessaires aux méthodes/sauces
const Sauce = require('../models/Sauce');
const fs = require('fs'); //package node pour accéder aux opérations liées aux fichiers

//Création d'une sauce
exports.createSauce = (req, res, next) => { //post 
    const sauceObject = JSON.parse(req.body.sauce);
    // console.log(JSON.parse(req.body.sauce));

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    // console.log('sauce : ' + sauce);
    sauce.save() //méthode qui sauvegarde l'objet dans la bdd et retourne une promesse
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        .catch(error => res.status(401).json({
            error
        }));
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce), // si le fichier image existe on le récup et on le modifie si besoin
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }:{ ...req.body};
    Sauce.updateOne({
        _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

//Supprimer une sauce
exports.deleteOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => { //supprime le fichier dont le nom correspond à l'_id
                Sauce.deleteOne({_id: req.params.id})
                .then(() => res.status(200).json({
                    message: 'Sauce supprimée !'
                }))
                .catch(
                    (error) => {
                        res.status(400).json({
                        error: error
                        });
                    }
                );
            })
        }).catch(error => res.status(500).json({error}));
};

//Afficher une seule sauce
exports.getOneSauce =  (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
};

//Afficher le tableau de toutes les sauces indépendamment des utilisateurs qui les ont ajoutées
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};

//Avis sur les sauces
exports.likeSauce = (req, res, next) => {
    const like = req.body.like; // =1, 0 -1
    const idOfUser = req.body.userId;
    const choosenSauce = req.params.id;

    // console.log(like);
    // console.log(idOfUser);
    // console.log(choosenSauce);

    // rechercher la choosenSauce puis modifier ses infos
    Sauce.findOne({_id: choosenSauce})
        .then(sauce => {
            // valeurs de la sauce à modifier = notation
            const newNotes = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 0,
                dislikes: 0
            }
            switch (like) {
                //en cas de pouce vers le bas like = -1 :
                case -1:
                    newNotes.usersDisliked.push(idOfUser);
                    break;
                //en cas de changement d'avis, double clic sur le même pouce, ou retrait d'un avis
                case 0:
                    // si on annule un like 
                    if(newNotes.usersLiked.includes(idOfUser)){
                        const index = newNotes.usersLiked.indexOf(idOfUser);
                        newNotes.usersLiked.splice(index, 1);
                    }
                    else { // si on annule un dislike 
                        const index = newNotes.usersDisliked.indexOf(idOfUser);
                        newNotes.usersDisliked.splice(index, 1);
                    }
                    break; 
                // en cas de pouce vers le haut, like = 1
                case 1:
                    newNotes.usersLiked.push(idOfUser);
                    break;

                default:
                    break;
            }
            //total des likes et dislikes après l'action = nombre d'userId/idOfUser dans chaque tableau
            newNotes.likes = newNotes.usersLiked.length;
            newNotes.dislikes = newNotes.usersDisliked.length;

            //mise à jour de ces valeurs dans la bdd : utilisation de la méthode update
            Sauce.updateOne({_id: choosenSauce}, newNotes)
                .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                .catch(error => res.status(400).json({ error }))
            })
        .catch(error => res.status(404).json({error}));
}