const { request, response } = require('express');
const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

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

app.get('/update_Items/:colletion', async (response) => {
    const item_colletion = colletion;
    const item_count = 100;
    const item_data = [];
    
    let temp_data;
    let item_start = 0;
    let item_loop = true;
    while(item_loop){
        const item_url = `https://steamcommunity.com/market/search/render/?search_descriptions=0&sort_column=name&sort_dir=desc&appid=730&norender=1&count=${item_count}&start=${item_start}&category_730_ItemSet%5B%5D=tag_set_${item_colletion}`
        const item_response = fetch(item_url);
        temp_data = item_response.json();
        
        for (item of temp_data.results){
            item_data.push(item);
        }
        item_start += item_count; 
        console.log(item_start);
        if(temp_data.results.length != item_count){
            item_loop = false;
        } 
    }

    const data = {
        item_data: item_data,
        temp_data: temp_data
    }
    response.json(data);
})

async function getting_data(){
    const item_url = `https://steamcommunity.com/market/search/render/?search_descriptions=0&sort_column=name&sort_dir=desc&appid=730&norender=1&count=${item_count}&start=${item_start}&category_730_ItemSet%5B%5D=tag_set_${item_colletion}`
    const item_response = fetch(item_url);
    temp_data = item_response.json();
    for (item of temp_data.results){
        item_data.push(item);
    }
}
/* app.get('/csgoitems', async (request, response) => {
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
}) */