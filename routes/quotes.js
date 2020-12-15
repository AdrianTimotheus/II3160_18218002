const express = require('express')
const router = express.Router()
const {ensureAuth} = require('../middleware/auth')
const mongoDB = require('mongodb')

const Quotes = require('../models/Quotes')

//desc: show add page
//route: GET /quotes/add
router.get('/add', ensureAuth, (req,res) =>{
    res.render('quotes/add')
})

//desc: process add form
//route: POST /quotes
router.post('/', ensureAuth, async (req,res) =>{
    try {
        req.body.user = req.user.id
        await Quotes.create(req.body)
        res.redirect('/dashboard')
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

//desc: get all quotes from database
//route: GET /quotes
router.get('/', ensureAuth, async(req,res) =>{
    try {
        const quotes = await loadQuotesCollection()
        res.send(await quotes.find({}).toArray());
    } catch (error) {
        console.log(error)
        res.render('error/500')
    }
})

//desc show edit page
//route: GET /quotes/edit/:id
router.get('/edit/:id',ensureAuth, async (req, res) => {
    try {
        const quotes = await Quotes.findOne({
          _id: req.params.id,
        }).lean()
    
        if (!quotes) {
          return res.render('error/404')
        }
    
        if (quotes.user != req.user.id) {
          res.redirect('/quotes')
        } else {
          res.render('quotes/edit', {
            quotes,
          })
        }
      } catch (err) {
        console.error(err)
        return res.render('error/500')
      }
})

// @desc    Update quotes
// @route   PUT /quotes/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try {
      let quotes = await Quotes.findById(req.params.id).lean()
  
      if (!quotes) {
        return res.render('error/404')
      }
  
      if (quotes.user != req.user.id) {
        res.redirect('/quotes')
      } else {
        quotes = await Quotes.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/dashboard')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })
  
// @desc    Delete quotes
// @route   DELETE /quotes/:id
router.delete('/:id', ensureAuth, async (req, res) => {
try {
    let quotes = await Quotes.findById(req.params.id).lean()

    if (!quotes) {
        return res.render('error/404')
    }

    if (quotes.user != req.user.id) {
        res.redirect('/stories')
    } else {
        await Quotes.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    }
    } catch (err) {
    console.error(err)
    return res.render('error/500')
    }
})

//database functions
async function loadQuotesCollection(){
    const client = await mongoDB.MongoClient.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return client.db('ii3160-18218002').collection('quotes');
}

module.exports = router