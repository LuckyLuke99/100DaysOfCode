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

app.get('/csgoitems', async (request, response) => {
    let itemStart = 0;
    const csgo_data = [];
    const csgo_colletion = 'nuke';
    const item_count = 1;
    let csgo_loop = true;
    let csgoData;
    let tamanho;

    while(csgo_loop){
        const csgo_URL = `https://steamcommunity.com/market/search/render/?search_descriptions=0&sort_column=name&sort_dir=desc&appid=730&norender=1&count=${item_count}&start=${itemStart}&&category_730_ItemSet%5B%5D=tag_set_${csgo_colletion}`
        while(true){
            const csgo_response = fetch(csgo_URL).then(
                success => {
                    csgoData = csgo_response.json();
                    console.log(csgoData);
                    for (item of csgoData.results){
                        csgo_data.push(item);
                    }
                    itemStart += item_count;
                    console.log(itemStart);
                    if(csgoData.results.length != item_count){
                        csgo_loop = false;
                    }
                },
                fail =>{
                    console.log('Fail');
                    console.log(fail);
                    csgo_loop = false;
                }
            );
        }
    }

    const data = {
        csgo_data: csgo_data,
        csgoData: csgoData
    }
    response.json(data);
})