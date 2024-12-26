const { link } = require('../controllers');
var express = require('express');
var router = express.Router();

router.get('/delete-expired', link.deleteExpiredLinks);
router.get('/:id', link.getLinkById);
router.post('/create', link.createLink);

module.exports = router;
