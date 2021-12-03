const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const sauceCtrl = require('../controllers/sauces');
const multer = require('../middlewares/multer-config');

//afficher les sauces test
// router.use('/', (req, res, next) => {
//     const sauces = [{
//         name: "Sosskipik",
//         manufacturer:"tibo",
//         description:"miam",
//         mainPepper:"l'amour", "imageUrl":"http://localhost:3000/images/53607344_2057942004287338_75546395972468736_n.jpg1638443948142.undefined",
//         heat: 9,
//         usersLiked: [],
//         usersDisliked:[],
//         _id: "61a8abacb08800898d60d25f"
//         },
//         {
//             _id: 'oeihfzeomoihi',
//             title: 'Mon deuxième objet',
//             description: 'Les infos de mon deuxième objet',
//             imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//             price: 2900,
//             userId: 'qsomihvqios',
//         },
//     ];
//     res.status(200).json(sauces);
// });

router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;