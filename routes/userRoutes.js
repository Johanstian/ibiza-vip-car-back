const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

const { signUp, signIn, getUserById } = require('../controllers/userController');

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.get('/get-user/:id', getUserById);

module.exports = router;

