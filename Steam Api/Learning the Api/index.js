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
app.get('/update_items/:colletion', (request, response) => {
    let interval = setInterval(() => {
        const data = createData('community_27');
        response.json(data);
/*             console.log(results.length);
        if(!temp_data){
            console.log('temp_data is null');
            clearInterval(interval);
            response.json(temp_data);
        }
        else{
            for(let i = 0; length == results.length; i+=count){
                temp_data = await getItems(count, i, 'community_27');
                results = await temp_data.results;
                data = await addItems(results, data);
                console.log(i);
            }
            if(results.length != count){
                clearInterval(interval);
                addDatabase(data);
                response.json(data);
            }
        } */
    }, 1000);
});

async function createData(colletion){
    let count = 100;
    let start = 0;
    let length = count;
    let data = [];
    for(let i = 0; length !== count; start+=count, i++){
        data[i] = await getItems(count, start, colletion);
        console.log(data);
        if(data[i].results.length !== count){
            length = data[i].results.length;
        }
    }
    console.log(data);
    return data;
}

// Getting items from steam market, can only request 100 items 
async function getItems(count, start, colletion){
    const response = await fetch(`https://steamcommunity.com/market/search/render/?&currency=7&search_descriptions=0&sort_column=name&sort_dir=desc&appid=730&norender=1&count=${count}&start=${start}&category_730_ItemSet%5B%5D=tag_set_${colletion}`);
    const data = await response.json();
    if(!data){
        console.log("data is null");
    }
    return data;
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
            const responseType = getType(data[i]);
            const type = responseType;
            if(isWorth(item)){
                console.log(type);
                const database = new Datastore(`database/${colletion}/${type}/${item[0]}/${item[1]}`);
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

function addDatabase(data){
        data.forEach(async element =>{
        const responseType = await getType(element);
    })
}

function getType(item){
    const item_temp = item.asset_description.type;
    const types = [
        isCovert(item_temp),
        isClassified(item_temp),      
        isRestricted(item_temp),
        isMilSpec(item_temp),
        isIndustrial(item_temp),
        isConsumer(item_temp)
    ];
    types.forEach(type =>{
        if(type !== false){
            return type;
        }
    });
}
// Check if is...
function isWorth(item){
    if(!(isSouvenir(item[0])) && !(isUndefined(item[1]))){
        return true;
    }
    else{
        return false;
    }
}
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
function isNull(item){
    if(typeof item == 'null'){
        return true;
    }
    else{
        return false;
    }
}
function isStatTrack(item){
    search = item.search('StatTrak™');
    if(search !== -1){
        return true;
    }
    else{
        return false;
    }
}
function isCovert(item){
    search = item.search('Covert');
    if(search !== -1){
        return 'Covert';
    }
    else{
        return false;
    }
}
function isClassified(item){
    search = item.search('Classified');
    if(search !== -1){
        return 'Classified';
    }
    else{
        return false;
    }
}
function isRestricted(item){
    search = item.search('Restricted');
    if(search !== -1){
        return 'Restricted';
    }
    else{
        return false;
    }
}
function isMilSpec(item){
    search = item.search('Mil-Spec');
    if(search !== -1){
        return 'Mil-Spec';
    }
    else{
        return false;
    }
}
function isIndustrial(item){
    search = item.search('Industrial');
    if(search !== -1){
        return 'Industrial';
    }
    else{
        return false;
    }
}
function isConsumer(item){
    search = item.search('Consumer');
    if(search !== -1){
        return 'Consumer';
    }
    else{
        return false;
    }
}