steamNews();
async function  steamNews(){
    const news_response = await fetch('/news');
    const news_json = await news_response.json();
    const news = news_json.appnews.newsitems;

    console.log(news);
    for (item of news){
        const root = document.createElement('div');
        const title = document.createElement('h3');
        const content = document.createElement('p');
        
        if(item.feed_type == 0){
            title.textContent = `${item.title}`;
            content.innerHTML = `${item.contents}`;
        }
        root.append(title, content);
        document.body.append(root);
    }
}