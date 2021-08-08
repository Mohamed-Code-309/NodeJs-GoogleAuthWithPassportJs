const express = require('express')
const dotenv = require('dotenv')

const connectDB = require('./config/db') 
const morgan = require('morgan'); 
const exphbs = require('express-handlebars'); 
const path = require('path'); 
const passport = require('passport');
const session = require('express-session'); 
const MongoStore = require('connect-mongo')(session) 
const mongoose = require('mongoose')
const methodOverride = require('method-override')

//load Config File
dotenv.config({ path: './config/config.env'}) //put our global variables here

//Passport Config
require('./config/passport')(passport) //cause : in passport.js >>> module.exports = function(passport){....}

connectDB(); 

//intilize the app
const app = express();

//Body parser
app.use(express.urlencoded({ extended: false })) //in order to use req.body in a post request like add story
app.use(express.json()) //accept json data but we won't use it

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )


//run morgan in development mode only
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev')) 
    //there are different level of login than 'dev'
    //dev: show http method - response and other stuff in the console
}

const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs') 


//Handlebars
//app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main'})); //extensions hbs not handlebars
app.engine(
    '.hbs', 
    exphbs({
        helpers: { 
            formatDate,
            truncate,
            stripTags,
            editIcon,
            select 
        }, 
        extname: '.hbs', 
        defaultLayout: 'main'
    })
);

app.set('view engine', '.hbs');

//express-session
app.use(
    session({
        secret: 'keyboard cat',
        resave: false, 
        saveUninitialized: false,
        store : new MongoStore({mongooseConnection: mongoose.connection})
    })
)

// Passport MiddleWare
app.use(passport.initialize()) 
app.use(passport.session()) //in order to work we need to import and implement express-session

//Set global var as a middleware
app.use(function (req, res, next) {
    res.locals.user = req.user || null //this allow to access user from within our template
    next()
  })


//static folder
app.use(express.static(path.join(__dirname, 'public'))) //path to folder contains static files(images, css, javascript)

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/story'))




//get the port from the config file
const PORT = process.env.PORT || 5000;
//note: whenever we use (process.env) we can use varibales we store in the config.env file

app.listen(
    PORT, 
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))