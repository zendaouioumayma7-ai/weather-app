const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

let users = [];
let weatherData = {};
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        res.json({ success: false, message: 'User exists' });
    } else {
        const newUser = { id: Date.now(), username, password, favorites: [] };
        users.push(newUser);
        res.json({ success: true, user: newUser });
    }
});

app.get('/api/weather/:city', (req, res) => {
    const city = req.params.city;
    // Mock weather data
    const types = ['sunny', 'rainy'];
    const type = types[Math.floor(Math.random() * types.length)];
    const data = {
        city,
        temp: Math.floor(Math.random() * 20) + 15,
        desc: type,
        forecast: Array(5).fill().map((_, i) => ({
            day: `Day ${i + 1}`,
            temp: Math.floor(Math.random() * 20) + 15
        }))
    };
    weatherData[city] = data;
    res.json(data);
});

app.get('/api/favorites/:userId', (req, res) => {
    const user = users.find(u => u.id == req.params.userId);
    res.json(user ? user.favorites : []);
});

app.post('/api/favorites/:userId', (req, res) => {
    const user = users.find(u => u.id == req.params.userId);
    if (user) {
        const favorite = { ...req.body, id: Date.now() };
        user.favorites.push(favorite);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.put('/api/favorites/:userId/:favId', (req, res) => {
    const user = users.find(u => u.id == req.params.userId);
    if (user) {
        const fav = user.favorites.find(f => f.id == req.params.favId);
        if (fav) {
            Object.assign(fav, req.body);
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } else {
        res.json({ success: false });
    }
});

app.delete('/api/favorites/:userId/:favId', (req, res) => {
    const user = users.find(u => u.id == req.params.userId);
    if (user) {
        user.favorites = user.favorites.filter(f => f.id != req.params.favId);
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});