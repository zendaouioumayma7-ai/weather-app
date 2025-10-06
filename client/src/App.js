import React, { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [tempFilter, setTempFilter] = useState('');
  const [weatherFilter, setWeatherFilter] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      setUser(JSON.parse(u));
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user) {
      loadFavs();
      getWeather('Honolulu');
    }
  }, [user]);

  const login = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.error(e);
      alert('Login failed');
    }
  };

  const signup = async () => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.error(e);
      alert('Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const search = async () => {
    if (city) await getWeather(city);
  };

  const getWeather = async (c) => {
    try {
      const response = await fetch(`/api/weather/${c}`);
      const data = await response.json();
      setWeather(data);
    } catch (e) {
      console.error(e);
      alert('Failed to get weather');
    }
  };

  const addFav = async () => {
    if (!weather) return alert('Search first');
    try {
      const response = await fetch(`/api/favorites/${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weather)
      });
      const data = await response.json();
      if (data.success) {
        loadFavs();
      } else {
        alert('Failed to add favorite');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to add favorite');
    }
  };

  const loadFavs = async () => {
    try {
      const response = await fetch(`/api/favorites/${user.id}`);
      const data = await response.json();
      setFavorites(data);
    } catch (e) {
      console.error(e);
    }
  };

  const filterFavs = () => {
    let f = favorites;
    if (tempFilter === 'cold') f = f.filter(x => x.temp < 20);
    if (tempFilter === 'warm') f = f.filter(x => x.temp >= 20);
    if (weatherFilter) f = f.filter(x => x.desc === weatherFilter);
    return f;
  };

  const editFav = async (id) => {
    const fav = favorites.find(f => f.id === id);
    if (!fav) return;
    const newCity = prompt('New city name:', fav.city);
    if (newCity && newCity.trim()) {
      try {
        const response = await fetch(`/api/favorites/${user.id}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: newCity.trim() })
        });
        const data = await response.json();
        if (data.success) {
          loadFavs();
        }
      } catch (e) {
        console.error(e);
        alert('Failed to edit favorite');
      }
    }
  };

  const delFav = async (id) => {
    try {
      const response = await fetch(`/api/favorites/${user.id}/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        loadFavs();
      }
    } catch (e) {
      console.error(e);
      alert('Failed to delete favorite');
    }
  };

  if (!user) {
    return (
      <div id="auth" className="container">
        <h1>Weather App</h1>
        <div id="login">
          <h2>Login</h2>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <button onClick={login}>Login</button>
          <button onClick={signup}>Sign Up</button>
        </div>
      </div>
    );
  }

  return (
    <div id="app" className="container">
      <h1>Weather App <button onClick={logout}>Logout</button></h1>

      <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
      <button onClick={search}>Search</button>
      <button onClick={addFav}>Add Favorite</button>

      {weather && (
        <div id="weather">
          <h2 id="loc">{weather.city}</h2>
          <p id="temp">{weather.temp}°C</p>
          <p id="desc">{weather.desc}</p>
        </div>
      )}

      {weather && (
        <div id="forecast">
          {weather.forecast.map((day, i) => (
            <div key={i} className="day">
              <p>{day.day}</p>
              <p>{day.temp}°C</p>
            </div>
          ))}
        </div>
      )}

      <h3>Favorites</h3>
      <select value={tempFilter} onChange={e => setTempFilter(e.target.value)}>
        <option value="">All Temps</option>
        <option value="cold">Cold</option>
        <option value="warm">Warm</option>
      </select>
      <select value={weatherFilter} onChange={e => setWeatherFilter(e.target.value)}>
        <option value="">All Weather</option>
        <option value="sunny">Sunny</option>
        <option value="rainy">Rainy</option>
      </select>
      <div id="favs">
        {filterFavs().map(fav => (
          <div key={fav.id} className="fav">
            <p>{fav.city}</p>
            <p>{fav.temp}°C {fav.desc}</p>
            <button onClick={() => editFav(fav.id)}>Edit</button>
            <button onClick={() => delFav(fav.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;