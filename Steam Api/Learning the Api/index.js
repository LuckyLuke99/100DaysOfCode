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

// Passing the data for the cliente 
app.get('/update_items/:colletion', async (request, response) => {
    try{
        const item_colletion = request.params.colletion;
        const data = await items_loop();
        response.json(data);

    }catch (error){
        console.log('Erro in the update_items')
        console.error(error);
    }
})

// Getting items from steam market, can only request 100 items 
async function getting_items(item_count, item_start, item_colletion){
    try{
        const item_url = `https://steamcommunity.com/market/search/render/?&currency=7&search_descriptions=0&sort_column=name&sort_dir=desc&appid=730&norender=1&count=${item_count}&start=${item_start}&category_730_ItemSet%5B%5D=tag_set_${item_colletion}`
        const item_response = await fetch(item_url);
        temp_data = await item_response.json();
        
        return temp_data;
    }catch (error){
        console.log('Error in the getting_items');
        console.error(error);
    }
}

// Looping for passing temp_data for the item_data
async function items_loop(){
    try{
        const item_colletion = 'nuke';
        const item_count = 1;
        const item_data = [];
    
        let item_start = 0;
        let item_loop = true;
        do {
            const temp_data = await getting_items(item_count, item_start, item_colletion);
            if(temp_data != null){
                for (item of temp_data.results){
                    item_data.push(item);
                }
                item_start += item_count; 
                console.log(item_start);
                if(temp_data.results.length != item_count){
                    item_loop = false;
                }
            }
            else{
                console.log('temp_data is null');
                item_loop = false;
            }
        }
        while(item_loop);
        
        return item_data;
    }catch (error){
        console.log('Error in the items_loop');
        console.error(error);
    }
}