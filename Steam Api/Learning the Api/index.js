const { request, response } = require('express');
const express = require('express');
const fetch = require('node-fetch');
const Datastore = require('nedb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Starting server at ${port}`);
})
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

// Creating database
/* db = {};
db.loadDatabase(); */

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
        let temp_data;
        const count = 100; 
        let interval = setInterval(async () => {
            temp_data = await getItems(count, start, 'nuke');
            results = await temp_data.results;
            data = await addItems(results, data);
            start += count;
            console.log(start);
            if(results.length != count){
                clearInterval(interval);
                response.json(data);
                updateDatabase(data, 'nuke');
                return;
            }
        }, 1000);
    }catch (error){
        console.log('Erro in the updateItems')
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
        console.log('Error in the getItems');
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

function updateDatabase(data, colletion){
    try{
        console.log('Starting the update of database');
        for(let i = 0; i < data.length; i++){
            const item = data[i].name.split('|');
            if(!(isSouvenir(item[0])) && !(isUndefined(item[1]))){
                const database = new Datastore(`database/${colletion}/${item[0]}/${item[1]}`);
                database.insert(data[i]);
                console.log(`Adding ${item[0]}|${item[1]} to database`);
                database.loadDatabase();
            }
        }
        console.log('Finish');
    }
    catch (error){
        console.log('Error in the updateDatabase');
        console.error(error);
    }
}
//Fazer com que as pastas fiquem separadas  por database/colletionn/rarity
//Colcoar em um arquivo só que fica mais fácil de retornar depois
//Fazer com que só seja colocado armas que sejam possíveis de troca

// Check if is...
function isSouvenir(item){
    search = item.search('Souvenir')
    if(search !== -1){
        return true;
    }
    else{
        return false;
    }
}
function isUndefined(item){
    if(typeof item == 'undefined'){
        return true;
    }
    else{
        return false;
    }
}