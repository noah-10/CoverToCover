const router = require('express').Router();
const searchRoute = require('./search');
const checkImg = require('./checkImg');
const findContent = require('./findContent');
const compareImgs = require('./compareImgs');
const checkUnavailable = require('./unavailable')

router.use('/search', searchRoute);
router.use('/check', checkImg);
router.use('/content', findContent);
router.use('/compare', compareImgs);
router.use('/unavailable', checkUnavailable);

module.exports = router;