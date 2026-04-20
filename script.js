const toggleBtn = document.getElementById('theme-toggle');

// 1. Theme Logic
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    toggleBtn.innerText = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

// 2. GitHub Activity API (Cool dynamic feature)
fetch('https://api.github.com/users/IHZAQ/repos?sort=updated&per_page=1')
    .then(response => response.json())
    .then(data => {
        if(data.length > 0) {
            const latest = data[0];
            document.getElementById('github-status').innerHTML = `
                <p><strong>Latest Engineering Update:</strong><br> 
                <a href="${latest.html_url}" target="_blank">${latest.name}</a> - ${latest.description || 'No description'}</p>
            `;
        }
    })
    .catch(() => {
        document.getElementById('github-status').innerText = "GitHub status unavailable.";
    });
