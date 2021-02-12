function setup(){
    noCanvas();
    //Making webcam capture
    const video = createCapture(VIDEO);
    video.size(320, 320)

    document.getElementById('findMe').addEventListener('click', event =>{
        //Getting the name adress
        const adress = document.getElementById('adress').value;
        //Making a map and tiles
        const mymap = L.map('Map').setView([0, 0], 12);
        const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tiles = L.tileLayer(tileUrl, { attribution });
        tiles.addTo(mymap);
        //Making the marker
        const marker = L.marker([0, 0]).addTo(mymap);
        //Getting the location
        if('geolocation' in navigator) {
            console.log("Geolocation is avaliable");
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                video.loadPixels();
                const image64 = video.canvas.toDataURL();
                
                //Changing the marker position and the view of the map
                marker.setLatLng([lat, lon]);
                mymap.setView([lat, lon]);

                document.getElementById('latitude').textContent = lat;
                document.getElementById('longitude').textContent = lon;
                console.log(position);

                //Fetch the data
                const data = {adress, lat, lon, image64};
                const options = {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                };
                const response = await fetch('/api', options);
                const json = await response.json();
                console.log(json);
            });
        } else {
            console.log("Geolocation is not avaliable");
        }
    },  {once:true});
}