const express = require('express');

const {updateProfile, getCurrentUserProfile} = require("../services/users")
const router = express.Router();

router.get('/profile/:id', getCurrentUserProfile);
router.post('/profile/:id', updateProfile);

module.exports = router;