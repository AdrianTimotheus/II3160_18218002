const mongoDB = require('mongodb')

async function loadQuotesCollection(){
    const client = await mongoDB.MongoClient.connect(process.env.MONGO_URI,{
        useNewUrlParser: true
    });

    return client.db('ii3160-18218002').collection('quotes');
}

var quotes = loadQuotesCollection();
var arrQuotes = quotes.find({}).toArray();
var randomID = Math.floor(Math.random()*arrQuotes.length);
var motivatorQuotes = arrQuotes[randomID].text;

module.exports = motivatorQuotes;