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

app.get('/update_items/:colletion', async (request, response) => {
    const item_colletion = request.params.colletion;
    const item_count = 50;
    const item_data = [];
    const interval_time = 3000;

    let item_start = 0;
    let item_loop = true;

    while(item_loop){
        const temp_data = await getting_items(item_count, item_start, item_colletion);
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

async function getting_items(item_count, item_start, item_colletion){
    const item_url = `https://steamcommunity.com/market/search/render/?&currency=7&search_descriptions=0&sort_column=name&sort_dir=desc&appid=730&norender=1&count=${item_count}&start=${item_start}&category_730_ItemSet%5B%5D=tag_set_${item_colletion}`
    const item_response = await fetch(item_url);
    temp_data = await item_response.json();

    return temp_data;
}