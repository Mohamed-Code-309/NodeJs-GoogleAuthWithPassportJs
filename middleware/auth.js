module.exports = {
    ensureAuth : function(req, res, next){
        if(req.isAuthenticated()){ //isAuthenticated: a method in passport.js will return true if user is logged in
            return next(); //he logged in
        }
        else{
            res.redirect('/')
        }
    },
    //if you logged in, you won't see the login page
    ensureGuest : function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }
        else{
            return next()
        }
    }
}