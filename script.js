const toggleBtn = document.getElementById('theme-toggle');

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    toggleBtn.innerText = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

fetch('https://api.github.com/users/IHZAQ/repos?sort=updated&per_page=1')
    .then(response => response.json())
    .then(data => {
        if(data.length > 0) {
            const latest = data[0];
            document.getElementById('github-status').innerHTML = `
                <p><strong>Latest Engineering Update:</strong><br> 
                <a href="${latest.html_url}" target="_blank">${latest.name}</a> - ${latest.description || 'No description available'}</p>
            `;
        }
    });
