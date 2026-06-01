const setup = document.getElementById("setup");
const app = document.getElementById("app");

const nameInput = document.getElementById("name-input");
const cityInput = document.getElementById("city-input");
const startBtn = document.getElementById("startBtn");

const greeting = document.getElementById("greeting");
const chCity = document.getElementById("changeCity");
const updateBtn = document.getElementById("updateBtn");
const weather = document.getElementById("weather");
const resetBtn = document.getElementById("resetBtn");

//load saved data from local storage

let user = localStorage.getItem("userName");
let city = localStorage.getItem("city");

//init app
function init() {
    if(user && city){
        setup.classList.add("hidden");
        app.classList.remove("hidden");

        greeting.textContent = `Hello, ${user}!`;
        getWeather(city);
    }
}

startBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const cityValue = cityInput.value.trim();
    

    if (!name || !cityValue) {
        alert("Please fill in all fields.");
        return;
    }
   localStorage.setItem("userName", name);
   localStorage.setItem("city", cityValue);

   location.reload();   //reload(): is a method of the window object in JavaScript that reloads the current web page. When called, it refreshes the page, causing the browser to re-fetch and re-render the content. This can be useful for updating the displayed information after changes have been made, such as when new data is saved to local storage or when you want to reset the state of the application.
});

updateBtn.addEventListener("click", () => {
    const newCity = chCity.value.trim();

    if (!newCity) return;

    localStorage.setItem("city", newCity);
    getWeather(newCity);
});

resetBtn.addEventListener("click", () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("city");
    location.reload();
});


//weather API

async function getWeather(cityName) {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`);

        const data = await response.json();

        if(!data.results){
            weather.textContent = "City not found.";
            return;
        }

        const { latitude, longitude, name } = data.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const w = weatherData.current_weather;

        weather.innerHTML = `
            <h2>Weather in ${name}</h2>
            <p>Temperature: ${w.temperature}°C</p>
            <p>Wind Speed: ${w.windspeed} km/h</p>
            <p>Time: ${w.time}</p>
        `;
    } catch (error) {
        weather.innerHTML = "Failed to load weather data.";
        console.error("Error fetching weather data:", error);
    }
}

init();