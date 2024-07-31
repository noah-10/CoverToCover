const router = require('express').Router();
const searchRoute = require('./search');
const checkImg = require('./checkImg');

router.use('/search', searchRoute);
router.use('/check', checkImg);

module.exports = router;