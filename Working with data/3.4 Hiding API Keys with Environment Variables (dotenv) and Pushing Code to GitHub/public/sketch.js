function setup(){
    noCanvas();
    document.getElementById('checkin').addEventListener('click', event =>{
        // //Making a map and tiles
        // const mymap = L.map('Map').setView([0, 0], 12);
        // const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        // const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        // const tiles = L.tileLayer(tileUrl, { attribution });
        // tiles.addTo(mymap);
        // //Making the marker
        // const marker = L.marker([0, 0]).addTo(mymap);
        //Getting the location
        if('geolocation' in navigator) {
            console.log("Geolocation is avaliable");
            navigator.geolocation.getCurrentPosition(async (position) => {
                let lat, lon, weather_data, air;
                try{
                lat = position.coords.latitude;
                lon = position.coords.longitude;

                //Changing the marker position and the view of the map
/*              marker.setLatLng([lat, lon]);
                mymap.setView([lat, lon]); */

                document.getElementById('latitude').textContent = lat;
                document.getElementById('longitude').textContent = lon;
                
                //Api Open Weather
                const api_url = `weather/${lat},${lon}`;
                const response = await fetch(api_url);
                const json = await response.json();

                const {air_quality} = json;
                weather_data = json.weather_data;
                const {weather, main} = weather_data;
                const {temp} = main;
                
                document.getElementById('temperature').textContent = temp;
                document.getElementById('summary').textContent = weather[0].description;
                
                
                air = air_quality.results[0].measurements[0];
                console.log(air);

                document.getElementById('aq_parameter').textContent = air.parameter;
                document.getElementById('aq_value').textContent = air.value;
                document.getElementById('aq_units').textContent = air.unit;
                document.getElementById('aq_date').textContent = air.lastUpdated;
            } catch (error){
                document.getElementById('aq_value').textContent = 'NO READING';
                console.log('something went wrong!');
                air = { value: -1 };
                console.log(air);
            }

            //Fetch the data
            const data = {lat, lon, weather_data, air};
            const options = {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
            const db_response = await fetch('/api', options);
            const db_json = await db_response.json();
            console.log(db_json);
            console.log(data);
            });
        } else {
            console.log("Geolocation is not avaliable");
        }
    },);
}