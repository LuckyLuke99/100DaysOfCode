//Steam web api overview https://partner.steamgames.com/doc/webapi_overview#1

const { request, response } = require('express');
const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const api_key = process.env.API_KEY;

app.listen(port, () => {
    console.log(`Starting server at ${port}`);
})
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

//Getting the data of database
app.get('/database', (request, response) => {
    database.find({}, (err, data) =>{
        if(err){
            response.end();
            return;
        }
        response.json(data);
    });
});

app.get('/news', async (request, response) => {
    const appid = 440;
    const news_maxL = 0;
    const news_count = 4;

    const news_URL = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${appid}&${news_maxL}&${news_count}&format=json`;
    const news_response = await fetch(news_URL);
    const news_data = await news_response.json();

    response.json(news_data);
})