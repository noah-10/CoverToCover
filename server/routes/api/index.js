const router = require('express').Router();
const searchRoute = require('./search');
const checkImg = require('./checkImg');
const findContent = require('./findContent');

router.use('/search', searchRoute);
router.use('/check', checkImg);
router.use('/content', findContent);

module.exports = router;