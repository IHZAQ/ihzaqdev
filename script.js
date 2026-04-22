// 1. Theme Logic (Keep this from before)
const toggleBtn = document.getElementById('theme-toggle');

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    toggleBtn.innerText = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

// 2. Dynamic GitHub Portfolio Fetcher
const username = 'IHZAQ';
fetch(`https://api.github.com/users/${username}/starred`)
    .then(response => response.json())
    .then(data => {
        // Filter: Only keep repos that you actually own
        const myStarredRepos = data.filter(repo => repo.owner.login === username);
        const repoContainer = document.getElementById('repo-list');
        
        if (myStarredRepos.length > 0) {
            repoContainer.innerHTML = ''; // Clear the "Fetching..." text
            
            // Loop through each repo and build a card
            myStarredRepos.forEach(repo => {
                repoContainer.innerHTML += `
                    <div class="card">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description provided.'}</p>
                        <a href="${repo.html_url}" target="_blank" class="link-btn">
                            <i class="fa-brands fa-github"></i> View on GitHub
                        </a>
                    </div>
                `;
            });
        } else {
            repoContainer.innerHTML = `
                <div class="card">
                    <p>No featured projects found right now. Check back later!</p>
                </div>
            `;
        }
    })
    .catch(error => {
        document.getElementById('repo-list').innerHTML = `
            <div class="card">
                <p>Failed to load repositories from GitHub.</p>
            </div>
        `;
    });
