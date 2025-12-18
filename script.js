const api = {
    key: "88c739c6cca1ca685e4d03c9172684fe", 
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
        getResults(searchbox.value);
    }
}

async function getResults(query) {
    const errorMsg = document.querySelector('.error-msg');
    const mainSection = document.querySelector('.current');
    
    // Reset display
    errorMsg.style.display = 'none';
    mainSection.style.display = 'none';

    try {
        const response = await fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`);
        
        // Handle Errors Specificially
        if (response.status === 404) {
            throw new Error("City not found");
        }
        if (response.status === 401) {
            throw new Error("Invalid API Key");
        }
        if (!response.ok) {
            throw new Error("HTTP Error");
        }

        const weather = await response.json();
        displayResults(weather);
        
        // Show result
        mainSection.style.display = 'flex';
        
    } catch (error) {
        console.error("Error:", error);
        
        if (error.message === "City not found") {
            errorMsg.innerText = "City not found! Please check spelling.";
        } else if (error.message === "Invalid API Key") {
            errorMsg.innerText = "API Key error. Please wait for activation.";
        } else {
            errorMsg.innerText = "Something went wrong. Check connection.";
        }
        
        errorMsg.style.display = 'block';
    }
}

function displayResults(weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].description;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

    // Dynamic Icon
    let iconCode = weather.weather[0].icon;
    let iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    let iconImg = document.querySelector('.weather-icon');
    iconImg.src = iconUrl;
    iconImg.style.display = 'block';
    
    // Change Background
    changeBackground(weather.weather[0].main);
}

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}

function changeBackground(weatherType) {
    const body = document.querySelector('body');
    let bgImage = '';

    switch (weatherType) {
        case 'Clear':
            bgImage = 'url(https://images.unsplash.com/photo-1506505708829-414cf29b7156?q=80&w=1600&auto=format&fit=crop)'; // Sunny
            break;
        case 'Clouds':
            bgImage = 'url(https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?q=80&w=1600&auto=format&fit=crop)'; // Cloudy
            break;
        case 'Rain':
        case 'Drizzle':
        case 'Thunderstorm':
            bgImage = 'url(https://images.unsplash.com/photo-1486016006115-74a41448aea2?q=80&w=1600&auto=format&fit=crop)'; // Rainy
            break;
        case 'Snow':
            bgImage = 'url(https://images.unsplash.com/photo-1478265868099-416108dbe50a?q=80&w=1600&auto=format&fit=crop)'; // Snow
            break;
        default:
            bgImage = 'url(https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=1600&auto=format&fit=crop)'; // Default
            break;
    }
    
    body.style.backgroundImage = bgImage;
}