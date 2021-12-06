const Sauce = require('../models/Sauce');
const fs = require('fs'); //package node pour accéder aux opérations liées aux fichiers
const { log } = require('console');

//stocke la logique métier : les fonctions/actions

exports.createSauce = (req, res, next) => { //post 
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(JSON.parse(req.body.sauce));

    const sauce = new Sauce({
        ...sauceObject,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    console.log('sauce : ' + sauce);
    sauce.save() //méthode qui sauvegarde l'objet dans la bdd et retourne une promesse
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        .catch(error => res.status(401).json({
            error
        }));
};

exports.modifySauce = (req, res, next) => {
    // console.log('trouver le bouton modifier');
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce), // si le fichier image existe on le récup et on le modifie
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
            // if(!sauce){
            //     res.status(404).json({
            //         error: new Error('Sauce non trouvée !')
            //     });
            // }
            // if(sauce.userId !== req.auth.userId){
            //     return res.status(401).json({
            //         error : new Error ('Requête non autorisée !')
            //     });
            // }
        }).catch(error => res.status(500).json({error}));
};

//afficher une seule sauce
exports.getOneSauce =  (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
};

//afficher le tableau de toutes les sauces indépendamment des utilisateurs qui les ont ajoutées
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.likeSauce = (req, res, next) => {
    // console.log('cette sauce devrait être likée');
    const like = req.body.like; // =1, 0 -1
    const idOfUser = req.body.userId;
    const choosenSauce = req.params.id;

    // console.log(like);
    // console.log(idOfUser);
    // console.log(choosenSauce);

    // rechercher la choosenSauce puis modifier ses infos
    Sauce.findOne({_id: choosenSauce})
        .then(sauce => {
            // console.log(sauce.name + ' likes = ' + sauce.usersLiked.length + ' et dislikes = '+ sauce.usersDisliked.length)
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
                    // console.log("l'utilisateur " + idOfUser + " n'aime pas");
                    newNotes.usersDisliked.push(idOfUser);
                    break;
                //en cas de changement d'avis, double clic sur le même pouce, ou retrait d'un avis
                //2 options : retirer un like ou retirer un disklike like = 0
                case 0:
                    // console.log("l'utilisateur " + idOfUser + " change d'avis");
                    // si on annule un like 
                    if(newNotes.usersLiked.includes(idOfUser)){
                        const index = newNotes.usersLiked.indexOf(idOfUser);
                        // console.log(index)
                        newNotes.usersLiked.splice(index, 1);
                    }else { // si on annule un dislike 
                        const index = newNotes.usersDisliked.indexOf(idOfUser);
                        newNotes.usersDisliked.splice(index, 1);
                    }
                    break; 
                // en cas de pouce vers le haut, like = 1
                case 1:
                    // console.log("l'utilisateur " + idOfUser + " aime");
                    newNotes.usersLiked.push(idOfUser);
                    break;

                default:
                    break;
            }
            //total des likes et dislikes après l'action = nombre d'userId dans chaque tableau
            newNotes.likes = newNotes.usersLiked.length;
            newNotes.dislikes = newNotes.usersDisliked.length;
            // console.log("nouvelles valeurs de notation : ");
            // console.log(newNotes);

            //mise à jour de ces valeurs dans la bdd : méthode update
            Sauce.updateOne({_id: choosenSauce}, newNotes)
                .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                .catch(error => res.status(400).json({ error }))
            })
        .catch(error => res.status(404).json({error}));
}