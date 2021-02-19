get_data();

async function get_data(){
    item_colletion = [
        'nuke'
    ];
    console.log('Getting data');
    const item_response = await fetch(`/update_items/${item_colletion[0]}`);
    const item_data = await item_response.json();
    
    console.log(item_data);
    console.log('Getting done');

}