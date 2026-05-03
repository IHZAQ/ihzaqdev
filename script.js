// 1. Theme Logic
const toggleBtn = document.getElementById('theme-toggle');

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    toggleBtn.innerText = document.body.classList.contains('light-mode') ? '☀️' : '🌙';
});

const githubUsername = 'IHZAQ';
const discordId = '657951960397381684';

// 2. Fetch GitHub Profile
fetch(`https://api.github.com/users/${githubUsername}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('github-avatar').src = data.avatar_url;
        document.getElementById('github-username').innerText = data.name || data.login;
        document.getElementById('github-bio').innerText = data.bio || 'No bio available.';
        document.getElementById('github-followers').innerHTML = `<i class="fa-solid fa-users"></i> ${data.followers} Followers`;
        document.getElementById('github-repos').innerHTML = `<i class="fa-solid fa-book-bookmark"></i> ${data.public_repos} Repos`;
    })
    .catch(error => {
        document.getElementById('github-username').innerText = 'GitHub unavailable';
    });

// 3. Fetch GitHub Starred Projects & Initialize Tilt
fetch(`https://api.github.com/users/${githubUsername}/starred`)
    .then(response => response.json())
    .then(data => {
        const myStarredRepos = data.filter(repo => repo.owner.login === githubUsername);
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

// 4. Fetch Discord Profile (Lanyard API)
function updateDiscordStatus() {
    fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const presence = data.data;
                const discordUser = presence.discord_user;
                
                // Set Avatar
                document.getElementById('discord-avatar').src = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`;
                document.getElementById('discord-username').innerText = discordUser.global_name || discordUser.username;
                
                // Set Border Color
                const avatarImg = document.getElementById('discord-avatar');
                avatarImg.className = `profile-avatar ${presence.discord_status}-border`;
                
                // Set Activity Text
                let activityString = "Online";
                
                if (presence.discord_status === "offline") {
                    activityString = "Offline";
                } else if (presence.activities.length > 0) {
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
                
                document.getElementById('discord-status-text').innerText = activityString;
            }
        })
        .catch(error => {
            document.getElementById('discord-status-text').innerText = "Status unavailable";
            document.getElementById('discord-avatar').className = "profile-avatar offline-border";
        });
}

// Fetch Discord status immediately, then refresh every 15 seconds
updateDiscordStatus();
setInterval(updateDiscordStatus, 15000);