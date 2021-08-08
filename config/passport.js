const GoogleStrategy = require('passport-google-oauth20').Strategy

//dealing with the database here so we need mongoose and user Model
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport){
    //we get this code from github page: https://github.com/jaredhanson/passport-google-oauth2
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback" //wrong: auth/google/callback 
      },
      /* 
        the function can access profile data like your name, google image, ...etc
        and it this function we are going to save the user in our database
      */
      /*function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }*/
      //dealing with mongoose so we will use async and await
      async(accessToken, refreshToken, profile, done) =>{
        //console.log(profile);
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        }
        try{
          let user = await User.findOne({ googleId: profile.id })
          
          if (user) { //user exist
            done(null, user); //null for error
          } else { //user not exist
            user = await User.create(newUser)
            done(null, user)
          }
        }
        catch{
          console.error(err)
        }
      }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
        });
    });
}
