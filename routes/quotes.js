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

//database functions
async function loadQuotesCollection(){
    const client = await mongoDB.MongoClient.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return client.db('ii3160-18218002').collection('quotes');
}

module.exports = router