const Sauce = require('../models/Sauce');
const fs = require('fs'); //package node pour accéder aux opérations liées aux fichiers

//stocke la logique métier : les fonctions/actions

exports.createSauce = (req, res, next) => { //post 
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        // usersLiked: [],
        // usersDisliked: []
    });
    // console.log('sauce : ' + sauce)
    sauce.save() //méthode qui sauvegarde l'objet dans la bdd et retourne une promesse
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        .catch(error => res.status(401).json({
            error
        }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauce), // si le fichier image existe on le récup et on le modifie
        imageUrl:
        `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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

exports.getOneSauce =  (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
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

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.likeSauce = (req, res, next) => {
    console.log('cette sauce devrait être likée')
};

exports.dislikeSauce = (req, res, next) => {
    console.log('chemin dislike ajouté')
}