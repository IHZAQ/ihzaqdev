// 1. Theme Logic
const toggleBtn = document.getElementById('theme-toggle');

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    toggleBtn.innerText = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

// 2. Dynamic GitHub Portfolio Fetcher & Tilt Initialization
const username = 'IHZAQ';
fetch(`https://api.github.com/users/${username}/starred`)
    .then(response => response.json())
    .then(data => {
        const myStarredRepos = data.filter(repo => repo.owner.login === username);
        const repoContainer = document.getElementById('repo-list');
        
        if (myStarredRepos.length > 0) {
            repoContainer.innerHTML = ''; 
            
            myStarredRepos.forEach(repo => {
                repoContainer.innerHTML += `
                    <div class="card github-card" data-tilt data-tilt-max="10" data-tilt-glare data-tilt-max-glare="0.1">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description provided.'}</p>
                        <a href="${repo.html_url}" target="_blank" class="link-btn">
                            <i class="fa-brands fa-github"></i> View on GitHub
                        </a>
                    </div>
                `;
            });

            // Initialize VanillaTilt for the newly created GitHub cards
            VanillaTilt.init(document.querySelectorAll(".github-card"));
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

// 3. Discord Live Status (Lanyard API)
const discordId = '657951960397381684';
const statusDot = document.querySelector('.status-dot');
const statusText = document.getElementById('discord-status-text');

function updateDiscordStatus() {
    fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const presence = data.data;
                
                // Set the correct color class
                statusDot.className = `status-dot ${presence.discord_status}`;
                
                // Determine what text to show based on priority
                let activityString = "Online";
                
                if (presence.discord_status === "offline") {
                    activityString = "Offline";
                } else if (presence.activities.length > 0) {
                    // Check for specific activities
                    const playingGame = presence.activities.find(a => a.type === 0);
                    const customStatus = presence.activities.find(a => a.type === 4);
                    
                    if (playingGame) {
                        activityString = `Playing ${playingGame.name}`;
                    } else if (customStatus && customStatus.state) {
                        activityString = customStatus.state;
                    } else if (presence.discord_status === "dnd") {
                        activityString = "Do Not Disturb";
                    } else if (presence.discord_status === "idle") {
                        activityString = "Idle";
                    }
                } else {
                    if (presence.discord_status === "dnd") activityString = "Do Not Disturb";
                    if (presence.discord_status === "idle") activityString = "Idle";
                }
                
                statusText.innerText = activityString;
            }
        })
        .catch(error => {
            statusText.innerText = "Status unavailable";
            statusDot.className = "status-dot offline";
        });
}

// Fetch status immediately, then refresh every 15 seconds
updateDiscordStatus();
setInterval(updateDiscordStatus, 15000);