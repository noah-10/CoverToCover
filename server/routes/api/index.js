const router = require('express').Router();
const searchRoute = require('./search');
const findContent = require('./findContent');
const checkUnavailable = require('./unavailable')

router.use('/search', searchRoute);
router.use('/content', findContent);
router.use('/unavailable', checkUnavailable);

module.exports = router;