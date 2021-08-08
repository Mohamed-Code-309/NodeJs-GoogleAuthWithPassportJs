//we will bring express as we are going to use the express router
const express = require('express');
const router = express.Router();

const { ensureAuth, ensureGuest } = require('../middleware/auth')

const story = require('../models/Story')

//@desc : Login/Landing
//@router : GET/ 

router.get('/', ensureGuest ,(req, res) => {
    res.render('login', {layout: 'login'}) //16
})


router.get('/dashboard', ensureAuth, async (req, res) => {
    try{
        const stories = await story.find({ user: req.user.id }).lean(); 
        //if we didnt use async/await the table will rendered empty (test it)
        //lean: in order to pass data to handelbars template and loop through 
        res.render('dashboard', {
            name : req.user.firstName,
            stories 
        })
    }
    catch(err){
        console.log(err)
        res.render('errors/500')
    }

})


module.exports = router;