const apiKey = '43d36f66e9396cf3492ac79c61068e53';
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

searchBtn.addEventListener('click', getWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
});

function getWeather() {
    const city = cityInput.value;
    if (city) {
        Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`),
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        ])
        .then(([currentResponse, forecastResponse]) => 
            Promise.all([currentResponse.json(), forecastResponse.json()])
        )
        .then(([currentData, forecastData]) => {
            displayCurrentWeather(currentData);
            displayForecast(forecastData);
        })
        .catch(error => {
            console.error('Error:', error);
            currentWeather.innerHTML = '<p>An error occurred. Please try again.</p>';
            forecast.innerHTML = '';
        });
    } else {
        currentWeather.innerHTML = '<p>Please enter a city name.</p>';
        forecast.innerHTML = '';
    }
}

function displayCurrentWeather(data) {
    if (data.cod === '404') {
        currentWeather.innerHTML = '<p> City not found. Please try again.</p>';
        forecast.innerHTML = '';
    } else {
        const { name, main, weather, wind } = data;
        const weatherHtml = `
            <div class="weather-card">
                <div class="weather-info">
                    <h2>${name}</h2>
                    <p>Temperature: ${main.temp.toFixed(1)}°C</p>
                    <p>Feels like: ${main.feels_like.toFixed(1)}°C</p>
                    <p>Humidity: ${main.humidity}%</p>
                    <p>Wind Speed: ${wind.speed.toFixed(1)} m/s</p>
                    <p>Weather: ${weather[0].description}</p>
                </div>
                <div class="weather-icon">
                    <i class="${getWeatherIcon(weather[0].id)}"></i>
                </div>
            </div>
        `;
        currentWeather.innerHTML = weatherHtml;
    }
}

function displayForecast(data) {
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    let forecastHtml = '';

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        forecastHtml += `
            <div class="forecast-day">
                <h3>${date.toLocaleDateString('en-US', { weekday: 'short' })}</h3>
                <div class="forecast-icon">
                    <i class="${getWeatherIcon(day.weather[0].id)}"></i>
                </div>
                <p>${day.main.temp.toFixed(1)}°C</p>
                <p>${day.weather[0].description}</p>
            </div>
        `;
    });

    forecast.innerHTML = forecastHtml;
}

function getWeatherIcon(weatherId) {
    if (weatherId >= 200 && weatherId < 300) {
        return 'fas fa-bolt';
    } else if (weatherId >= 300 && weatherId < 500) {
        return 'fas fa-cloud-rain';
    } else if (weatherId >= 500 && weatherId < 600) {
        return 'fas fa-tint';
    } else if (weatherId >= 600 && weatherId < 700) {
        return 'fas fa-snowflake';
    } else if (weatherId >= 700 && weatherId < 800) {
        return 'fas fa-smog';
    } else if (weatherId === 800) {
        return 'fas fa-sun';
    } else if (weatherId > 800) {
        return 'fas fa-cloud';
    }
}