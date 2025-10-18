async function checkAuth() {
  try {
    const response = await fetch('/api/auth/user', {
      credentials: 'include'
    });
    
    const loadingEl = document.getElementById('loading');
    const loggedOutEl = document.getElementById('logged-out');
    const loggedInEl = document.getElementById('logged-in');
    const userGreetingEl = document.getElementById('user-greeting');
    
    loadingEl.style.display = 'none';
    
    if (response.ok) {
      const user = await response.json();
      const name = user.firstName || user.email || 'User';
      userGreetingEl.textContent = `Welcome, ${name}! `;
      loggedInEl.style.display = 'block';
    } else {
      loggedOutEl.style.display = 'block';
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    document.getElementById('loading').style.display = 'none';
    document.getElementById('logged-out').style.display = 'block';
  }
}

checkAuth();
