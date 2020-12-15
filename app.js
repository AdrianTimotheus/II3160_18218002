const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')
// const requirejs = require('requirejs')

//load config
dotenv.config({path: './config/config.env'})

//passport config
require('./config/passport')(passport)

// //requirejs config
// requirejs.config({
//   //Pass the top-level main.js/index.js require
//   //function to requirejs so that node modules
//   //are loaded relative to the top-level JS file.
//   nodeRequire: require
// });

connectDB()

const app = express()

//Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//method override
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

//logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//handlebars helpers
const { formatDate,generateRandomQuotes } = require('./helpers/hbs')

//handlebars, middleware
app.engine(
  '.hbs', 
  exphbs({ 
    helpers: {
      formatDate,
      generateRandomQuotes
    },
  defaultLayout: 'main', extname: '.hbs' 
  })
)
app.set('view engine','.hbs')

//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection})
  }))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/quotes', require('./routes/quotes'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT, 
    console.log('Server running in '+ process.env.NODE_ENV +' mode on port '+PORT))