let daysArr = [];
let input = document.querySelector('#inputSearch');
input.addEventListener('keyup', (event) => {
    if(event.keyCode == 13){
        getWeather(false, false, input.value);        
        resultScroll();
    }
});
document.getElementById('btnSearch').addEventListener('click', (event) => {
    if(input.value != ''){
        getWeather(false, false, input.value);
        resultScroll();
    }
});
document.getElementById('cities').addEventListener('click', (event) => {
    getWeather(false, false, event.target.id);
    resultScroll();
});
document.getElementById('header-big').addEventListener('mousemove', (event) => {
    let posX = event.clientX;
    let posY = event.clientY;
    let cloud = document.getElementById("cloud");
    cloud.style.top = (posY - 340) + "px";
    cloud.style.left = (posX - 50) + "px";
});
const Day = function(date, temp, humidity, pressure, temp_min, temp_max, description, icon){
    this.date = date;
    this.temp = temp;
    this.humidity = humidity;
    this.pressure = pressure;
    this.temp_min = temp_min;
    this.temp_max = temp_max;
    this.description = description;
    this.icon = icon;
}
const getDayInWeek = (date) => {
    let date1 = new Date(date);
    let dayNumber = date1.getDay();
    let dayName;
    switch(dayNumber){
        case 0: dayName = "Sunday";
            break;
        case 1: dayName = "Monday";
            break;
        case 2: dayName = "Tuesday";
            break;
        case 3: dayName = "Wednesday";
            break;
        case 4: dayName = "Thursday";
            break;
        case 5: dayName = "Friday";
            break;
        case 6: dayName = "Saturday";
    }
    return dayName;
}
const writeDays = function(arr, name){

    document.getElementById('allowLocation').style.height = '0';
    let content2 = document.getElementById('weatherContent2');
     
    //Write to DOM - Weather results for today
    let date = new Date(arr[0].date);
    let newDate = date.toLocaleDateString();
    getDayInWeek(arr[0].date)

    document.getElementById('cityName').innerHTML = name;
    document.getElementById('tempDate').innerHTML = newDate;

    let icon = document.getElementById('icon');
    icon.setAttribute('src', `http://openweathermap.org/img/w/${arr[0].icon}.png`);
    icon.setAttribute('alt', 'Weather Icon');
    document.getElementById('sky').innerHTML = arr[0].description;
    document.getElementById('celsius').innerHTML =`${arr[0].temp}&#8451;`;
    document.getElementById('humidity').innerHTML = `Humidity: ${arr[0].humidity}%`;
    document.getElementById('pressure').innerHTML = `Pressure: ${arr[0].pressure} mb`;
    document.getElementById('temp_min').innerHTML = `Min: ${arr[0].temp_min}&#8451;`;
    document.getElementById('temp_max').innerHTML = `Max: ${arr[0].temp_max}&#8451;`;
    //End - results for today

    //Weather for five days    
    let weekDay = document.createElement('div');
    for(let i=0; i<arr.length; i++){

        let date = new Date(arr[i].date);
        let newDate = date.toLocaleDateString();

        let dayWeek = getDayInWeek(arr[i].date);
        
        let day = document.createElement('div');
        day.setAttribute('class', 'day');
        content2.appendChild(day);

        let dayName = document.createElement('p');
        dayName.innerHTML = dayWeek;
        day.appendChild(dayName);

        let dayIcon = document.createElement('img');
        dayIcon.setAttribute('src', `http://openweathermap.org/img/w/${arr[i].icon}.png`);
        dayIcon.setAttribute('alt', 'Weather Icon');
        day.appendChild(dayIcon);

        let min = document.createElement('h2');
        min.setAttribute('class', 'min');
        min.innerHTML = `Min: ${arr[i].temp_min}&#8451;`;
        day.appendChild(min);

        let max = document.createElement('h2');
        max.setAttribute('class', 'max')
        max.innerHTML = `Max: ${arr[i].temp_max}&#8451;`;
        day.appendChild(max);   
    }
    //End weather for five days    
}

const getWeather = (lat, lon, city) => {
    daysArr = [];
    let coords,
        url;     
    let content = document.getElementById('weatherContent2');
    document.getElementById('inputSearch').value = '';
    if(!lat || !lon){
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=391b37d2f59bc9b8fbe47be6126dcbed&units=metric`;
        coords = true;
    }else {
       url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&APPID=391b37d2f59bc9b8fbe47be6126dcbed&units=metric`;
       coords = false; 
    }  
   while(content.firstChild){
       content.removeChild(content.firstChild)
    }
    fetch(url).then(data => {
        return data.json();
    }).then(res => {
        if(coords){
            initMap(res.city.coord.lat, res.city.coord.lon);
        }
        cityLat = res.city.coord.lat;
        cityLng = res.city.coord.lon;
        let name = res.city.name;
        console.log(res)
        for(let i=0; i<res.list.length; i+=8){

            let date = res.list[i].dt_txt;
            let temp = parseInt(res.list[i].main.temp);
            let humidity = parseInt(res.list[i].main.humidity);
            let pressure = parseInt(res.list[i].main.pressure);
            let temp_min = parseInt(res.list[i].main.temp_min);
            let temp_max = parseInt(res.list[i].main.temp_max);
            let description = res.list[i].weather[0].main;
            let icon = res.list[i].weather[0].icon;
            
            let newDay = new Day(date, temp, humidity, pressure, temp_min, temp_max, description, icon);
            daysArr.push(newDay);
        }
        writeDays(daysArr, name); 
    }).catch(console.log);
}
let map;
const initMap = function(lat, lon){
    let options = {
        center: {lat: lat, lng: lon},
        zoom: 12
    }
    map = new google.maps.Map(document.getElementById('map'), options);
}
const getPosition = function(){
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}
getPosition().then(position => {
    resultScroll();
    let cords = position.coords;
    let lat = cords.latitude;
    let lon = cords.longitude;

    getWeather(lat, lon);
    initMap(lat, lon);
}).catch(err => {
    document.getElementById('weather').style.opacity = '1';
    getWeather(false, false, 'belgrade');
    initMap(44.7866, 20.4489);
});
function resultScroll(){
    document.getElementById('weather').style.opacity = '1';
    document.getElementById('weather').scrollIntoView({
        behavior: 'smooth'
    });
}


