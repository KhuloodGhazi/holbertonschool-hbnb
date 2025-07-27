// Helpers
function getCookie(name) {
  const v = `; ${document.cookie}`.split(`; ${name}=`).pop();
  return v.includes(';') ? v.split(';')[0] : v;
}
function getPlaceIdFromURL() {
  return new URLSearchParams(window.location.search).get('id');
}

// Pages
document.addEventListener('DOMContentLoaded', () => {
  const token = getCookie('token');
  const path = window.location.pathname;

  // LOGIN page logic
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();

  try {
    const res = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
    });

    if (res.ok) {
      const data = await res.json();
      document.cookie = `token=${data.access_token}; path=/`;
      window.location.href = 'index.html';
    } else {
      // Try to read error message from server
      const errorData = await res.json();
      alert(`Login failed: ${errorData.message || res.statusText}`);
    }
  } catch (error) {
    alert('Login failed: Network error or server is down');
    console.error('Login error:', error);
  }
});


  // INDEX page logic
  if (path.endsWith('index.html') || path === '/') {
    if (!token && document.getElementById('login-link')) {
      document.getElementById('login-link').style.display = 'block';
    }
    fetchPlaces(token);
    document.getElementById('price-filter').addEventListener('change', e => filterPlaces(e.target.value));
  }

  // PLACE DETAILS page logic
  if (path.endsWith('place.html')) {
    const placeId = getPlaceIdFromURL();
    fetchPlaceDetails(placeId, token);
  }

  // ADD REVIEW page logic
  if (path.endsWith('add_review.html')) {
    if (!token) return window.location.href = 'index.html';
    const placeId = getPlaceIdFromURL();
    document.getElementById('review-form').addEventListener('submit', async e => {
      e.preventDefault();
      const res = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          comment: document.getElementById('comment').value,
          rating: document.getElementById('rating').value
        })
      });
      if (res.ok) window.location.href = `place.html?id=${placeId}`;
      else alert('Review failed');
    });
  }
});

// Data functions
async function fetchPlaces(token) {
  const res = await fetch('http://127.0.0.1:5000/api/v1/places', {
    headers: token ? {'Authorization': `Bearer ${token}`} : {}
  });
  const data = await res.json();
  window.placesCache = data;
  filterPlaces(document.getElementById('price-filter').value);
}

function filterPlaces(maxPrice) {
  const container = document.getElementById('places-list');
  container.innerHTML = '';
  (window.placesCache || []).forEach(p => {
    if (maxPrice !== 'All' && p.price_by_night > Number(maxPrice)) return;
    const div = document.createElement('div');
    div.className = 'place-card';
    div.innerHTML = `
      <h2>${p.name}</h2>
      <p>$${p.price_by_night} / night</p>
      <a href="place.html?id=${p.id}" class="details-button">View Details</a>`;
    container.appendChild(div);
  });
}

async function fetchPlaceDetails(placeId, token) {
  const res = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}`, {
    headers: token ? {'Authorization': `Bearer ${token}`} : {}
  });
  const p = await res.json();
  const container = document.getElementById('place-details');
  container.innerHTML = `
    <h2>${p.name}</h2>
    <p>${p.description}</p>
    <p>Price: $${p.price_by_night}</p>
    <ul>${(p.amenities || []).map(a => `<li>${a}</li>`).join('')}</ul>`;
  
  (p.reviews || []).forEach(r => {
    container.innerHTML += `
      <div class="review-card">
        <p>${r.comment}</p>
        <small>— ${r.user} ⭐ ${r.rating}</small>
      </div>`;
  });

  if (token) document.getElementById('add-review').style.display = 'block';
}