const express = require('express');
const router = express.Router();
const passport = require('passport');

//@desc : Auth with Google
//@router : GET  /google
//cause: we will link /auth in app.js

router.get('/google', 
    passport.authenticate('google', {scope : ['profile']}) ) 

//@desc : Google Auth Callback
//@router : GET /auth/google/callback  
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/dashboard'); //Successful authentication, redirect dashboard.
});

// @desc    Logout user
// @route   /auth/logout
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})
  

module.exports = router;