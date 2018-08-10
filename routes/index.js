// const router = require('express').Router();
// const gallery = require('./gallery');

// const Gallery = require('../db/models/Gallery');

// router.use('/gallery', gallery);

// router.get('/', (req, res) => {
//   return Gallery
//     .fetchAll()
//     .then(gallery => {
//       let firstPic = gallery.models;
//       let remainingPics = gallery.models.splice(1);
//       return res.render('./gallerypages/index', {
//         firstpic: firstPic[0],
//         gallery: remainingPics,
//         username: req.user.username,
//         message: req.flash('msg3')
//       });
//     })
//     .catch(err => {
//       return res.json({ message: err.message });
//     });
// });

// module.exports = router;