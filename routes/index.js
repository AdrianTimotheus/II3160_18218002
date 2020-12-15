const express = require('express')
const router = express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/auth')

const Quotes = require('../models/Quotes')

//desc: login and landing page
//route: GET /
router.get('/', ensureGuest, (req,res) =>{
    res.render('login',{
        layout: 'login',
    })
})

//desc: dashboard
//route: GET / dashboard
router.get('/dashboard', ensureAuth, async (req,res) => {
    try {
        const quotes = await  Quotes.find({ user: req.user.id }).lean()
        res.render('dashboard',{
            name: req.user.firstName,
            quotes
        })
    } catch (error) {
        console.error(error)
        res.render('error/500')
    }
})

module.exports = router