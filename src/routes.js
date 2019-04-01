const express = require('express');
const router = express.Router();

router.use('/', require('./routes/index'));
router.use('/users', require('./routes/users'));

module.exports = router;