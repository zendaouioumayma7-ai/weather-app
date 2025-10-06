// Global variables and DOM elements
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

// Initialize the app
function init() {
    // Check if user is logged in (stored in session/localStorage for frontend)
    const u = localStorage.getItem('user');
    if (u) {
        user = JSON.parse(u);
        showApp();
    } else {
        showAuth();
    }
    bindEvents();
}

// Setup event listeners
function bindEvents() {
    document.getElementById('login-btn').onclick = login;
    document.getElementById('signup-btn').onclick = signup;
    document.getElementById('logout').onclick = logout;
    document.getElementById('search').onclick = search;
    document.getElementById('add-fav').onclick = addFav;
    tempFilter.onchange = filter;
    weatherFilter.onchange = filter;
}

// Show/hide functions
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);