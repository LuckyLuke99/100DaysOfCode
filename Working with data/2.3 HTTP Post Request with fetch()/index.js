const { request, response } = require('express');
const express = require('express');
const app = express();
const dataLocation = [];

app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

app.post('/api', (request, response) => {
    const data = request.body;
    dataLocation.push([data.lat, data.lon]);
    
    response.json({
        status: 'sucess',
        latitude: data.lat,
        longtitude: data.lon
    });

    console.log(dataLocation);
    console.log('I got request!');
    console.log(request.body);
});