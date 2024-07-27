const apiKey = '43d36f66e9396cf3492ac79c61068e53';
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherInfo = document.getElementById('weather-info');

searchBtn.addEventListener('click', getWeather);

function getWeather() {
    const city = cityInput.value;
    if (city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                displayWeather(data);
            })
            .catch(error => {
                console.error('Error:', error);
                weatherInfo.innerHTML = '<p>An error occurred. Please try again.</p>';
            });
    } else {
        weatherInfo.innerHTML = '<p>Please enter a city name.</p>';
    }
}

function displayWeather(data) {
    if (data.cod === '404') {
        weatherInfo.innerHTML = '<p>City not found. Please try again.</p>';
    } else {
        const { name, main, weather } = data;
        const weatherHtml = `
            <div class="weather-card">
                <h2>${name}</h2>
                <p>Temperature: ${main.temp}°C</p>
                <p>Feels like: ${main.feels_like}°C</p>
                <p>Humidity: ${main.humidity}%</p>
                <p>Weather: ${weather[0].main}</p>
                <p>Description: ${weather[0].description}</p>
            </div>
        `;
        weatherInfo.innerHTML = weatherHtml;
    }
}