
//Using Event Bubbling to indentify clicked elements and perform action
document.addEventListener('click', (event) => {
    if(event.target.id == 'topButton'){
        if(document.getElementById('topInput').value != ""){
            getData(document.getElementById('topInput').value);
        }
    }else if(event.target.id == 'botButton'){
        if(document.getElementById('botInput').value != ""){
            getData(document.getElementById('botInput').value);
        }
    }else if(event.target.classList.contains('categoryBtn')){
        getData(event.target.id);
    }else if(event.target.id == 'arrow'){
        document.getElementById('header-main').scrollIntoView({
            behavior: 'smooth'
        });
    };
}, false);

//Adding 'keyup' event on multiple 'input' elements
let inp = document.getElementsByClassName('searchInput');
for(let i=0; i<inp.length; i++){
    inp[i].addEventListener('keyup', (event) => {
        if(event.code === "Enter"){
            if(event.target.value != ""){
                getData(event.target.value);
            }
        }
    });
};
window.onscroll = () => {
    document.querySelector('header').style.position = 'fixed';
    if(window.scrollY > 0){
        document.querySelector('header').style.height = '60px';
    }
    if(window.scrollY > 100){
        document.getElementById('arrowUp').style.opacity = '1'
    }else if(window.scrollY == 0) {
        document.getElementById('arrowUp').style.opacity = '0';
        document.querySelector('header').style.height = '80px';
    }     
};
setTimeout(() => {
    document.querySelector('#header-main h1').style.opacity = 1;
    document.querySelector('#head-links').style.opacity = 1;
}, 1000);

//Dynamic DOM update (Writing data from JSON response to DOM)
const write = (res, keyWord) => {    
      
    document.querySelector('#resultHeader').style.opacity = '1';
    document.querySelector('#resultSpan').style.opacity = '1';
    document.querySelector('#resultSpan').innerHTML = keyWord;

    let date = new Date(res.publishedAt).toLocaleDateString();            
    let imageUrl = res.urlToImage;
    if(imageUrl == null){
        imageUrl = 'images/no-photo-available.jpg';        
    }       
    let newDescription ='';    
    if(res.description){
        newDescription = shortnDescription(res.description);
    }else{
        newDescription = 'No description for this article.';
    }   
    let content = document.getElementById('news-header');
    
    let artic = document.createElement('div');
    artic.setAttribute('class', 'article');
    content.appendChild(artic);

    let s1 = document.createElement('div');
    s1.setAttribute('class', 'sect1');
    artic.appendChild(s1);
    let title1 = document.createElement('h1');
    title1.setAttribute('class', 'title');
    title1.innerHTML = res.title;
    s1.appendChild(title1);
    let author1 = document.createElement('p');
    author1.innerHTML = `by ${res.author} | ${date}`;
    s1.appendChild(author1);

    let s2 = document.createElement('div');
    s2.setAttribute('class', 'sect2');
    artic.appendChild(s2);
    let imgUrl = document.createElement('img');
    imgUrl.setAttribute('src', imageUrl)
    s2.appendChild(imgUrl);
    let wrap = document.createElement('div');
    wrap.setAttribute('class', 'wrap');
    s2.appendChild(wrap);
    let sourceName = document.createElement('h2');
    sourceName.setAttribute('class', 'sourceName')
    sourceName.innerHTML = `' ${res.source.name} '`;
    s2.appendChild(sourceName);
    
    let s3 = document.createElement('div');
    s3.setAttribute('class', 'sect3');
    artic.appendChild(s3);
    let descrip = document.createElement('p');
    descrip.setAttribute('class', 'description');
    descrip.innerHTML = newDescription;
    s3.appendChild(descrip);
    let artUrl = document.createElement('a');
    artUrl.setAttribute('class', 'articleUrl');
    artUrl.setAttribute('href', res.url);
    artUrl.innerHTML = 'Read full article..';
    s3.appendChild(artUrl);    
}

//Generating URL by keyword 
const getUrlByKeword = (keyWord) => {
    let apiKey = 'babd0ca3754540a6b89171dfc0681bef';
    let url = `https://newsapi.org/v2/everything?q=${keyWord}&apiKey=${apiKey}`;
    return url
}
//Making shorten descriptino - if description is larger then 200 char.
const shortnDescription = (str) => {    
    if(str.length > 200) {
        str = str.substring(0,200) + "...";        
    }
    return str;
}
//Using Fetch to get data from 'News API' service and writing data to DOM
const getData = (keyWord, cond) => {    
    let url = getUrlByKeword(keyWord);
    if(!cond){
        document.querySelector('#loader').style.display ='block';
        document.querySelector('#result').scrollIntoView({
            behavior: 'smooth'
        });
    };            
    
    //Emptying news container for next search       
    let content = document.getElementById('news-header');
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }     
    fetch(url).then(data => {
        if(data.status !== 200){
            document.querySelector('#resultSpan').innerHTML = "There's a problem retrieving the data";
        }
        return data.json();
    }).then(res => { 
        for(let i=0; i<res.articles.length; i++){
            write(res.articles[i], keyWord)
        }               
        document.getElementById('loader').style.display ='none';
        document.getElementById('topInput').value = "";
        document.getElementById('botInput').value = "";
    });
};

//Using Recursive function for fatching data from 'Weather API'
//to display temperature for Europe main cities and write them to DOM
let cities = ['belgrade', 'london', 'paris', 'madrid', 'berlin']
const getTempForCities = (city) => {
    let divContainer = document.getElementById('temp');
    if(cities.length){
        cities.shift();
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=391b37d2f59bc9b8fbe47be6126dcbed&units=metric`;
        fetch(url).then((data) => {
            return data.json();
        }).then((res) => {            
            let elem = document.createElement('p');
            elem.innerHTML = res.name + ' ' + parseInt(res.main.temp) + '&#8451;'
            divContainer.appendChild(elem);
            getTempForCities(cities[0]);            
        });
    };
};
getData('world news', true);
getTempForCities(cities[0]);

