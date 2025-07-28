// === LOGIN FORM HANDLER ===
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage (optional, depends on your backend)
        localStorage.setItem('token', data.access_token);
        // Redirect to index.html
        window.location.href = 'index.html';
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    }
  });
}

// === CHECK LOGIN ON index.html ===
if (window.location.pathname.includes('index.html')) {
  const token = localStorage.getItem('token');

  if (!token) {
    // Not logged in, redirect to login page
    window.location.href = 'login.html';
  }
}

// === OPTIONAL LOGOUT FUNCTION ===
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}