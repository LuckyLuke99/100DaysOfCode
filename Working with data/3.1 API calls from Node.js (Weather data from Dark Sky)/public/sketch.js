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
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                //Changing the marker position and the view of the map
/*                 marker.setLatLng([lat, lon]);
                mymap.setView([lat, lon]); */

                document.getElementById('latitude').textContent = lat;
                document.getElementById('longitude').textContent = lon;
                
                //Api Open Weather
                const api_url = `weather/${lat},${lon}`;
                const response = await fetch(api_url);
                const json = await response.json();

                const {name, timezone, weather, main} = json;
                const {feels_like, humidity, temp, temp_max, temp_min} = main;
                console.log(name);
                console.log(timezone);
                console.log(weather[0].description);
                console.log(feels_like, humidity, temp, temp_max, temp_min);
                console.log(main);
                console.log(json);
                //Fetch the data
                // const data = {lat, lon};
                // const options = {
                //     method:'POST',
                //     headers: {
                //         'Content-Type': 'application/json'
                //     },
                //     body: JSON.stringify(data)
                // };
                // const response = await fetch('/api', options);
                // const json = await response.json();
                // console.log(json);
            });
        } else {
            console.log("Geolocation is not avaliable");
        }
    },);
}