getCsgoData();

async function getCsgoData(){
    console.log('Getting data');
    const csgo_response = await fetch('/csgoitems');
    const csgo_data = await csgo_response.json();
    console.log('Getting done');

    console.log(csgo_data);
}