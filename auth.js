// Authentication functions
async function login() {
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: userInput.value,
                password: passInput.value
            })
        });
        const data = await response.json();
        if (data.success) {
            user = data.user;
            localStorage.setItem('user', JSON.stringify(user));
            showApp();
        } else {
            alert(data.message);
        }
    } catch (e) {
        console.error('Login error:', e);
        alert('Login failed');
    }
}

async function signup() {
    try {
        const response = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: userInput.value,
                password: passInput.value
            })
        });
        const data = await response.json();
        if (data.success) {
            user = data.user;
            localStorage.setItem('user', JSON.stringify(user));
            showApp();
        } else {
            alert(data.message);
        }
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