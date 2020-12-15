const mongoose = require('mongoose')

const QuotesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Quotes',QuotesSchema)