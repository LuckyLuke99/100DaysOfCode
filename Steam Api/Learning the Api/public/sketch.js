ge();

async function get_data(){
    console.log('Getting data');
    const csgo_response = await fetch('/csgoitems');
    const csgo_data = await csgo_response.json();
    
    console.log(csgo_data);
    console.log('Getting done');

}