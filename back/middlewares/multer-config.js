//multer pour la gestion des images : stockage, nom et extension
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => { //ds quel dossier enregistrer le dossier
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        //générer le nv nom du fichier
        const name = file.originalname.split(' ').join('_'); //élimine le pb des espaces
        //mime type
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');