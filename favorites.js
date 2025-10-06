// Favorites CRUD functions
async function addFav() {
    if (!weather) return alert('Search first');
    try {
        const response = await fetch(`http://localhost:3000/api/favorites/${user.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(weather)
        });
        const data = await response.json();
        if (data.success) {
            loadFavs();
        }
    } catch (e) {
        console.error('Add favorite error:', e);
        alert('Failed to add favorite');
    }
}

async function loadFavs() {
    try {
        const response = await fetch(`http://localhost:3000/api/favorites/${user.id}`);
        user.favs = await response.json();
        const favs = filterFavs();
        favsDiv.innerHTML = '';
        favs.forEach(f => {
            const div = document.createElement('div');
            div.className = 'fav';
            div.innerHTML = `<p>${f.city}</p><p>${f.temp}°C ${f.desc}</p><button onclick="editFav(${f.id})">Edit</button><button onclick="delFav(${f.id})">Delete</button>`;
            favsDiv.appendChild(div);
        });
    } catch (e) {
        console.error('Load favorites error:', e);
    }
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
    const fav = user.favs.find(f => f.id == id);
    if (!fav) return;
    const newCity = prompt('New city name:', fav.city);
    if (newCity && newCity.trim()) {
        try {
            const response = await fetch(`http://localhost:3000/api/favorites/${user.id}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ city: newCity.trim() })
            });
            const data = await response.json();
            if (data.success) {
                loadFavs();
            }
        } catch (e) {
            console.error('Edit favorite error:', e);
            alert('Failed to edit favorite');
        }
    }
}

async function delFav(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/favorites/${user.id}/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            loadFavs();
        }
    } catch (e) {
        console.error('Delete favorite error:', e);
        alert('Failed to delete favorite');
    }
}