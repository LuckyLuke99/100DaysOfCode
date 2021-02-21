const { request, response } = require('express');
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Starting server at ${port}`);
})
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

// Creating database
const Datastore = require('nedb');
const database = new Datastore('database.db');
database.loadDatabase();

// Getting the data of database
app.get('/database', (request, response) => {
    database.find({}, (err, data) =>{
        if(err){
            response.end();
            return;
        }
        response.json(data);
    });
});

// Passing the data for the cliente 
app.get('/update_items/:colletion', async (request, response) => {
    try{
        let data = []
        let start = 0;
        let results;
        const count = 100; 
        const interval = setInterval(async () => {
            const temp_data = await getItems(count, start, 'nuke');
            results = await temp_data.results;
            data = await addItems(results, data);
            start += count;
            console.log(start);
            if(results.length != count){
                clearInterval(interval);
                response.json(data);
            }
        }, 12001)
    }catch (error){
        console.log('Erro in the update_items')
        console.error(error);
    }
})

// Getting items from steam market, can only request 100 items 
async function getItems(count, start, colletion){
    try{
        const response = await fetch(`https://steamcommunity.com/market/search/render/?&currency=7&search_descriptions=0&sort_column=name&sort_dir=desc&appid=730&norender=1&count=${count}&start=${start}&category_730_ItemSet%5B%5D=tag_set_${colletion}`);
        const data = await response.json();
        return data;
    }catch (error){
        console.log('Error in the getting_items');
        console.error(error);
    }
}

function addItems(array1, array2){
    if(array1 != null){
        for(item of array1){
            array2.push(item);
        }
        return array2;
    }
    else{
        console.log('Array is nulll!');
    }
}