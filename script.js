const getLeft = document.querySelector('#left-side');
const getRight = document.querySelector('#right-side');
const timeContainer = document.querySelector('#time');
const bottomSide = document.querySelector('#bottom');
const oneOne = "&appid"
const oneTwo = "=a5abf1c6c792b4234"
const oneThree = "55f3e371c67672b"
const twoOne = "&client_id"
const twoTwo = "=X5BNY5eDQeJfo1S68f5"
const twoThree = "WtQpTHfm4LR7Od4V_F500Rvo"
let error = false;

function apiData(city,unit) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}${oneOne}${oneTwo}${oneThree}&units=${unit}`, {mode:'cors'})
        .then((response => {
            return response.json();
        }))
        .then((response => {
            if(response.message){
                if(!error){
                    const errorMessage = document.createElement('div');
                    errorMessage.textContent = `Please enter a valid location...ie.'toronto'(city) or 'toronto,ca'(city,country)`;
                    errorMessage.id = "error";
                    getLeft.appendChild(errorMessage);
                    error = true;
                }
            }else{
                getLeft.innerHTML = "";
                getRight.innerHTML = "";
                timeContainer.innerHTML = "";
                bottomSide.innerHTML = "";            
                let data = {
                    description: upper(response.weather[0].description),
                    city: response.name+','+response.sys.country,
                    temp: response.main.temp.toFixed(),
                    feelsLike: response.main.feels_like.toFixed(),
                    humidity: response.main.humidity+'%',
                    wind: response.wind.speed,
                    main: response.weather[0].main,
                    lon: response.coord.lon,
                    lat: response.coord.lat
                };
                error = false;
                showInfo(data);
            }
        }))
}
apiData('montreal','metric');

function upper(sentence){
    let broken = sentence.split(' ');
    for(let i = 0; i<broken.length;i++){
        broken[i] = broken[i].charAt(0).toUpperCase() + broken[i].slice(1);
        sentence = broken.join(' ');
    }
    return sentence;
}

let degreeText = "°C";
let speedText = "km/h";
let unitDaily = "metric";

function getDayWeek(dayNumber) {
    switch(dayNumber) {
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';    
        case 6:
            return 'Saturday';
    }
}

function showInfo(object){

    let logos = {
        'Clear': '01d',
        'Clouds': object.description === "Few Clouds" ? '02d' : object.description === "Scattered Clouds" ? '03d' : '04d',
        'Drizzle' : '09d',
        'Rain': '10d',
        'Thundersorm': '11d',
        'Snow': '13d',
        'Mist': '50d', 'Smoke': '50d', 'Haze': '50d', 'Dust': '50d', 'Fog': '50d', 'Sand':'50d', 'Ash':'50d', 'Saquall':'50d', 'Tornado':'50d'
    }

    if(speedText === "km/h"){
        object.wind = (object.wind*3.6).toFixed(1);
    }else{
        object.wind = object.wind.toFixed(1);
    }
    const description = document.createElement('div');
    description.textContent = object.description;
    getLeft.appendChild(description);
    description.id = "description";

    const units = document.createElement('div');
    units.id = "units";
    getLeft.appendChild(units);

    const celcius = document.createElement('div');
    celcius.textContent = "°C";
    units.appendChild(celcius);
    celcius.id = "celcius";

    const unitSeparator = document.createElement('div');
    unitSeparator.textContent = '|';
    units.appendChild(unitSeparator);
    unitSeparator.id = "separator";

    const farhenheit = document.createElement('div');
    farhenheit.textContent = "°F";
    units.appendChild(farhenheit);
    farhenheit.id = "farhenheit";

    farhenheit.addEventListener('click' , () => {
        apiData(object.city,'imperial');
        degreeText = "°F";
        speedText = "mph";
        unitDaily = "imperial";
    })

    celcius.addEventListener('click' , () => {
        apiData(object.city,'metric');
        object.wind = (object.wind*3.6).toFixed(1)
        degreeText = "°C";
        speedText = "km/h";
        unitDaily = "metric"
    })

    const city = document.createElement('div');
    city.textContent = object.city;
    getLeft.appendChild(city);
    city.id = "city";

    const tempHolder = document.createElement('div');
    tempHolder.id = "tempHolder",
    getLeft.appendChild(tempHolder);

    const logo = document.createElement('IMG');
    logo.src = `http://openweathermap.org/img/wn/${logos[(object.main)]}@2x.png`;
    logo.title = object.main;
    tempHolder.appendChild(logo);

    const temp = document.createElement('div');
    if(object.temp === '-0'){
        object.temp = '0';
    }
    temp.textContent = `${object.temp}${degreeText}`;
    tempHolder.appendChild(temp);
    temp.id = "temp";

    const userLocation = document.createElement('div');
    userLocation.id = "userLocation";
    getLeft.appendChild(userLocation);

    const userLocationInput = document.createElement('input');
    userLocationInput.placeholder = "Search Location..."
    userLocation.appendChild(userLocationInput);

    const locationBtn = document.createElement('button');
    locationBtn.type = "button";
    locationBtn.id = "userBtn";
    locationBtn.textContent = "Search";
    locationBtn.title = "search city";
    userLocation.appendChild(locationBtn);
    locationBtn.addEventListener('click',() => { 
        apiData(userLocationInput.value,'metric');
        speedText = "km/h";
        degreeText = "°C";       
    });
    userLocationInput.addEventListener('keyup' ,function(event){
        if(event.key === 'Enter'){
            apiData(userLocationInput.value,'metric');
            speedText = "km/h";
            degreeText = "°C";
            unitDaily = "metric";
        }
    });

    const feelsLike = document.createElement('div');
    feelsLike.textContent = `Feels Like: ${object.feelsLike}${degreeText}`;
    getRight.appendChild(feelsLike);

    const humidity = document.createElement('div');
    humidity.textContent = `Humidity: ${object.humidity}`;
    getRight.appendChild(humidity);

    const wind = document.createElement('div');
    wind.textContent = `Wind Speed: ${object.wind} ${speedText}`;
    getRight.appendChild(wind);


    function backgroundImage(){
        fetch(`https://api.unsplash.com/photos/random?${twoOne}${twoTwo}${twoThree}&query=weather`)
            .then(response => {return response.json()})
            .then(response => {document.body.style.backgroundImage = `url('${response.urls.regular}')`})
    }
    const background = document.createElement('div');
    background.textContent = "Change Background Image";
    getRight.appendChild(background);
    background.id = "bgImage";
    background.addEventListener('click', ()=>{
        backgroundImage();
    })


    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${object.lat}&lon=${object.lon}&exclude=hourly,minutely${oneOne}${oneTwo}${oneThree}&units=${unitDaily}`)
        .then(response => {return response.json()})
        .then(response => {
            //time
            let options = {
                timeZone: response.timezone,
                year: 'numeric', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric',
            }
            let currentTime = new Intl.DateTimeFormat('en-CA', options).format(new Date());
            const timeShower = document.createElement('div');
            timeShower.id = "timeShower";
            let frontPageTime = new Date(currentTime.split(',')[0].split('-'));
            timeShower.textContent = `${frontPageTime.toLocaleString('en-US', {weekday: 'long'})}, 
            ${frontPageTime.toLocaleString('en-US', {month: 'long'})} ${frontPageTime.toLocaleString('en-US', {day: 'numeric'})}
            ${frontPageTime.toLocaleString('en-US', {year: 'numeric'})}, ${currentTime.split(', ')[1]}`;
            timeContainer.appendChild(timeShower);

            //7 day forecast
            for(let i = 1; i<response.daily.length;i++){
                const dailyDiv = document.createElement('div');
                dailyDiv.id = "daily";
                let timeFuture = new Intl.DateTimeFormat('en-CA', options).format(new Date(response.daily[i].dt*1000));
                let daySeparator = timeFuture.split(',')[0].split('-');
                // let day = new Date(daySeparator[0], parseInt(daySeparator[1])-1, daySeparator[2]).toLocaleString('en-US', {weekday: 'long'});
                let dayDate = new Date(daySeparator);
                dailyDiv.textContent = getDayWeek(dayDate.getDay());
                bottomSide.appendChild(dailyDiv);

                const maxTemp = document.createElement('div');
                let maxTempValue = response.daily[i].temp.max.toFixed();
                if(maxTempValue === '-0'){
                    maxTempValue = '0';
                };
                maxTemp.textContent = `${maxTempValue} ${degreeText}`;
                maxTemp.id = "maxTemp";
                dailyDiv.appendChild(maxTemp);

                const minTemp = document.createElement('div');
                let minTempValue = response.daily[i].temp.min.toFixed();
                if(minTempValue === '-0'){
                    minTempValue = '0';
                };
                minTemp.textContent = `${minTempValue} ${degreeText}`;
                minTemp.id = "minTemp";
                dailyDiv.appendChild(minTemp);

                const dailyLogos = document.createElement('img');
                dailyLogos.src = `http://openweathermap.org/img/wn/${logos[(response.daily[i].weather[0].main)]}@2x.png`;
                dailyLogos.id = "dailyLogos";
                dailyLogos.title = response.daily[i].weather[0].description;
                dailyDiv.appendChild(dailyLogos);
            }
        })
    
};


