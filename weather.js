// Weather functions
async function search() {
    const city = cityInput.value;
    if (city) await getWeather(city);
}

async function getWeather(city) {
    try {
        const response = await fetch(`http://localhost:5000/api/weather/${city}`);
        weather = await response.json();
        document.getElementById('loc').textContent = weather.city;
        document.getElementById('temp').textContent = weather.temp + '°C';
        document.getElementById('desc').textContent = weather.desc;
        const forecast = document.getElementById('forecast');
        forecast.innerHTML = '';
        weather.forecast.forEach(day => {
            const div = document.createElement('div');
            div.className = 'day';
            div.innerHTML = `<p>${day.day}</p><p>${day.temp}°C</p>`;
            forecast.appendChild(div);
        });
    } catch (e) {
        console.error('Weather error:', e);
        alert('Failed to get weather');
    }
}