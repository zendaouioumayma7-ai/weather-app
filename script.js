const auth = document.getElementById('auth');
const app = document.getElementById('app');
const userInput = document.getElementById('user');
const passInput = document.getElementById('pass');
const cityInput = document.getElementById('city');
const tempFilter = document.getElementById('filter-temp');
const weatherFilter = document.getElementById('filter-weather');
const favsDiv = document.getElementById('favs');

let user = null;
let weather = null;

async function init() {
    try {
        const u = localStorage.getItem('user');
        if (u) {
            user = JSON.parse(u);
            showApp();
        } else {
            showAuth();
        }
    } catch (e) {
        console.error('Error loading user:', e);
        showAuth();
    }
    bindEvents();
}

function bindEvents() {
    document.getElementById('login-btn').onclick = login;
    document.getElementById('signup-btn').onclick = signup;
    document.getElementById('logout').onclick = logout;
    document.getElementById('search').onclick = search;
    document.getElementById('add-fav').onclick = addFav;
    document.getElementById('filter-temp').onchange = filter;
    document.getElementById('filter-weather').onchange = filter;
}

function showAuth() {
    auth.style.display = 'block';
    app.style.display = 'none';
}

function showApp() {
    auth.style.display = 'none';
    app.style.display = 'block';
    loadFavs();
    getWeather('Honolulu');
}

async function login() {
    try {
        const u = userInput.value;
        const p = passInput.value;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find(x => x.user === u && x.pass === p);
        if (found) {
            user = found;
            localStorage.setItem('user', JSON.stringify(user));
            showApp();
        } else {
            alert('Wrong login');
        }
    } catch (e) {
        console.error('Login error:', e);
        alert('Login failed');
    }
}

async function signup() {
    try {
        const u = userInput.value;
        const p = passInput.value;
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(x => x.user === u)) {
            alert('User exists');
            return;
        }
        user = { user: u, pass: p, favs: [] };
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('user', JSON.stringify(user));
        showApp();
    } catch (e) {
        console.error('Signup error:', e);
        alert('Signup failed');
    }
}

function logout() {
    user = null;
    localStorage.removeItem('user');
    showAuth();
}

function search() {
    const city = cityInput.value;
    if (city) getWeather(city);
}

function getWeather(city) {
    const types = ['sunny', 'rainy'];
    const type = types[Math.floor(Math.random() * types.length)];
    weather = {
        city: city,
        temp: Math.floor(Math.random() * 20) + 15,
        desc: type
    };
    document.getElementById('loc').textContent = city;
    document.getElementById('temp').textContent = weather.temp + '°C';
    document.getElementById('desc').textContent = type;
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const day = document.createElement('div');
        day.className = 'day';
        day.innerHTML = `<p>Day ${i+1}</p><p>${Math.floor(Math.random() * 20) + 15}°C</p>`;
        forecast.appendChild(day);
    }
}

async function addFav() {
    if (!weather) return alert('Search first');
    user.favs.push({ ...weather, id: Date.now() });
    await saveUser();
    loadFavs();
}

function loadFavs() {
    const favs = filterFavs();
    favsDiv.innerHTML = '';
    favs.forEach(f => {
        const div = document.createElement('div');
        div.className = 'fav';
        div.innerHTML = `<p>${f.city}</p><p>${f.temp}°C ${f.desc}</p><button onclick="editFav(${f.id})">Edit</button><button onclick="delFav(${f.id})">Delete</button>`;
        favsDiv.appendChild(div);
    });
}

function filterFavs() {
    let f = user.favs;
    const t = tempFilter.value;
    if (t === 'cold') f = f.filter(x => x.temp < 20);
    if (t === 'warm') f = f.filter(x => x.temp >= 20);
    const w = weatherFilter.value;
    if (w) f = f.filter(x => x.desc === w);
    return f;
}

function filter() {
    loadFavs();
}

async function editFav(id) {
    const fav = user.favs.find(f => f.id === id);
    if (!fav) return;
    const newCity = prompt('New city name:', fav.city);
    if (newCity && newCity.trim()) {
        fav.city = newCity.trim();
        await saveUser();
        loadFavs();
    }
}

async function delFav(id) {
    user.favs = user.favs.filter(f => f.id !== id);
    await saveUser();
    loadFavs();
}

async function saveUser() {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const idx = users.findIndex(x => x.user === user.user);
        users[idx] = user;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('user', JSON.stringify(user));
    } catch (e) {
        console.error('Save error:', e);
        alert('Failed to save data');
    }
}

document.addEventListener('DOMContentLoaded', init);
