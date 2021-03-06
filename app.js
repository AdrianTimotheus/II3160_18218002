const path = require('path') //untuk path API
const express = require('express') // untuk backend
const mongoose = require('mongoose') // operasi mongoDB
const dotenv = require('dotenv') //untuk config.env
const connectDB = require('./config/db') // connect ke mongoDB
const morgan = require('morgan') //membuat middleware autentikasi
const exphbs = require('express-handlebars') //views + frontend
const passport = require('passport') //autentikasi google+
const session = require('express-session') //menyimpan session agar user tidak ke logout terus
const MongoStore = require('connect-mongo')(session) //untuk session
const methodOverride = require('method-override') //implementasi PUT + DELETE

//load config
dotenv.config({path: './config/config.env'})

//passport config
require('./config/passport')(passport)

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
const { formatDate } = require('./helpers/hbs')

//handlebars, middleware
app.engine(
  '.hbs', 
  exphbs({ 
    helpers: {
      formatDate
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