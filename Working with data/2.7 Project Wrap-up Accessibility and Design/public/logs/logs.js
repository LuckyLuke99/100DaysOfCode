            getData();
            async function getData(){
                const response = await fetch('/api');
                const data = await response.json();

                for (item of data){
                    const root = document.createElement('div');
                    const adress = document.createElement('div');
                    const geo = document.createElement('div');
                    const date = document.createElement('div');
                    const image = document.createElement('img');

                    
                    adress.textContent = `adress: ${item.adress}`;
                    geo.textContent = `${item.lat}°, ${item.lon}°`;
                    const dateString = new Date(item.timestamp).toLocaleString();
                    date.textContent = dateString;
                    image.src = item.image64;

                    root.append(adress, geo, date, image);
                    document.body.append(root);
                }
            }