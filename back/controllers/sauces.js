const Sauce = require('../models/Sauce');
//stocke la logique métier : les fonctions/actions

exports.createSauce = (req, res, next) => { //post 
    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    sauce.save() //méthode qui sauvegardel'objet dans la bdd et retourne une promesse
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

exports.modifySauce = (req, res, next) => {
    Thing.updateOne({
            _id: req.params.id
        }, {
            ...req.body,
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
    Sauce.findOne({ _id: req.params.id}).then(
        (sauce)=>{
            if(!sauce){
                res.status(404).json({
                    error: new Error('Sauce non trouvée !')
                });
            }
            if(sauce.userId !== req.auth.userId){
                return res.status(401).json({
                    error : new Error ('Requête non autorisée !')
                });
            }
            Sauce.deleteOne({
                _id: req.params.id
            })
            .then(() => res.status(200).json({
                message: 'Sauce supprimée !'
            }))
            .catch(error => res.status(400).json({
                error
            }));
        }
    )
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};