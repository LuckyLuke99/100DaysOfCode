const { request, response } = require('express');
const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
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

//Receiving the data and put in the database
app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data);
});

//Getting data from Api Open Weather
app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];

    //APi Open Weather
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=27213ca3a94758456ef6e9a2068714fb`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();
    //API Open AQ
    const openAQ_url = `https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/latest?limit=100&page=1&offset=0&sort=desc&coordinates=${lat}%2C${lon}`;
    const openAQ_response = await fetch(openAQ_url);
    const openAQ_data = await openAQ_response.json();

    const data = {
        weather_data: weather_data,
        air_quality: openAQ_data
    }
    response.json(data);
});