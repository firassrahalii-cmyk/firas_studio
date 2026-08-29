document.addEventListener('DOMContentLoaded', () => {

    // ========== Window Controls ==========
    if (window.electronAPI) {
        document.getElementById('winMinimize').addEventListener('click', () => window.electronAPI.minimize());
        document.getElementById('winMaximize').addEventListener('click', () => window.electronAPI.maximize());
        document.getElementById('winClose').addEventListener('click', () => window.electronAPI.close());
    }

    // ========== Particles Background ==========
    const bgParticles = document.getElementById('bgParticles');
    function createParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 20 + 15) + 's';
            particle.style.animationDelay = (Math.random() * 15) + 's';
            particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
            bgParticles.appendChild(particle);
        }
    }
    createParticles();

    // ========== Visitor Counter ==========
    const visitorCountEl = document.getElementById('visitorCount');
    let totalVisitors = parseInt(localStorage.getItem('totalVisitors')) || 0;
    const myVisitorId = localStorage.getItem('myVisitorId');

    if (!myVisitorId) {
        const newId = 'v_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        localStorage.setItem('myVisitorId', newId);
        totalVisitors++;
        localStorage.setItem('totalVisitors', totalVisitors);
    }

    visitorCountEl.textContent = totalVisitors;

    // ========== Navigation ==========
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (targetId === 'coding') animateProgressBars();
        });
    });

    // ========== Learn More Button ==========
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const learnMoreContent = document.getElementById('learnMoreContent');

    learnMoreBtn.addEventListener('click', () => {
        learnMoreContent.classList.toggle('hidden');
        learnMoreBtn.textContent = learnMoreContent.classList.contains('hidden') ? 'Learn More' : 'Show Less';
    });

    // ========== Theme Toggle ==========
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    let currentTheme = localStorage.getItem('theme') || 'dark';

    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // ========== Zoom ==========
    const zoomBtn = document.getElementById('zoomBtn');
    let zoomLevel = 1;
    const zoomBtnIcon = zoomBtn.querySelector('i');

    zoomBtn.addEventListener('click', () => {
        zoomLevel = zoomLevel === 1 ? 1.15 : zoomLevel === 1.15 ? 1.3 : 1;
        document.body.style.transform = `scale(${zoomLevel})`;
        document.body.style.transformOrigin = 'top left';
        document.body.style.width = (100 / zoomLevel) + '%';

        if (zoomLevel === 1) {
            zoomBtnIcon.className = 'fas fa-expand';
        } else {
            zoomBtnIcon.className = 'fas fa-compress';
        }
    });

    // ========== Progress Bars Animation ==========
    function animateProgressBars() {
        const fills = document.querySelectorAll('.progress-fill');
        fills.forEach(fill => {
            fill.style.width = '0';
            setTimeout(() => {
                fill.style.width = fill.getAttribute('data-progress') + '%';
            }, 200);
        });
    }

    // ========== Music Player (Local MP3) ==========
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const currentSongTitle = document.getElementById('currentSongTitle');
    const currentSongArtist = document.getElementById('currentSongArtist');
    const musicIcon = document.getElementById('musicIcon');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const categoriesGrid = document.getElementById('categoriesGrid');
    const filteredSongs = document.getElementById('filteredSongs');
    const filteredCategoryName = document.getElementById('filteredCategoryName');
    const filteredList = document.getElementById('filteredList');
    const backToCategories = document.getElementById('backToCategories');
    
    let allSongs = [];
    let categories = [];
    let currentSongIndex = -1;
    let audio = new Audio();
    let isPlaying = false;

    const musicData = {
        categories: [
            { id: "rap-tunisien", name: "Rap Tunisien (3a9liya)", icon: "fa-microphone", folder: "Rap Tunisien (3a9liya)" },
            { id: "rai-dziri", name: "Rai Dziri", icon: "fa-music", folder: "Rai Dziri" },
            { id: "calm", name: "Calm Music", icon: "fa-cloud", folder: "Sleep Music" },
            { id: "deep", name: "Deep Music", icon: "fa-headphones", folder: "Deep Music" },
            { id: "english", name: "English Music", icon: "fa-language", folder: "English Music" },
            { id: "french", name: "French Music", icon: "fa-flag", folder: "Frensh Music" },
            { id: "hiphop", name: "HipHop", icon: "fa-fire", folder: "HipHop" },
            { id: "sad", name: "Sad Music", icon: "fa-heart-crack", folder: "Sad Music" },
            { id: "love", name: "Love Music", icon: "fa-heart", folder: "Love Music" }
        ],
        songs: [
            { title: "Sanfara - Ghabiya", file: "Rap Tunisien (3a9liya)/Sanfara - Ghabiya (Official Music Video).mp3", category: "rap-tunisien" },
            { title: "Sanfara - J'allume", file: "Rap Tunisien (3a9liya)/Sanfara - J'allume.mp3", category: "rap-tunisien" },
            { title: "Sanfara - Ma7ssoub", file: "Rap Tunisien (3a9liya)/Sanfara - Ma7ssoub  ????.mp3", category: "rap-tunisien" },
            { title: "Sanfara - Sghari", file: "Rap Tunisien (3a9liya)/Sanfara - Sghari (Official Visualizer).mp3", category: "rap-tunisien" },
            { title: "Sanfara - Zayet", file: "Rap Tunisien (3a9liya)/Sanfara - Zayet.mp3", category: "rap-tunisien" },
            { title: "CHEB DIDOU PARISIEN 2022", file: "Rai Dziri/CHEB DIDOU PARISIEN 2022 LIVE SOULAZER  ??? ??????????  ??? ?????????? ???.mp3", category: "rai-dziri" },
            { title: "Jabetli Ljah", file: "Rai Dziri/Jabetli Ljah.mp3", category: "rai-dziri" },
            { title: "2r - COTE PASSAGER", file: "Frensh Music/2r - COTE PASSAGER.mp3", category: "french" },
            { title: "2r - COTE PASSAGER", file: "HipHop/2r - COTE PASSAGER.mp3", category: "hiphop" },
            { title: "BUTRINT IMERI - LEJ KTO RRENA", file: "Sad Music/BUTRINT IMERI - LEJ KTO RRENA.mp3", category: "sad" },
            { title: "BUTRINT IMERI - LEJ KTO RRENA", file: "Love Music/BUTRINT IMERI - LEJ KTO RRENA.mp3", category: "love" }
        ]
    };

    categories = musicData.categories;
    allSongs = musicData.songs;
    renderCategories();

    function renderCategories() {
        categoriesGrid.innerHTML = '';
        categories.forEach(cat => {
            const songCount = allSongs.filter(s => s.category === cat.id).length;
            const div = document.createElement('div');
            div.classList.add('category-card');
            div.innerHTML = `
                <i class="fas ${cat.icon}"></i>
                <h4>${cat.name}</h4>
                <span>${songCount} songs</span>
            `;
            div.addEventListener('click', () => filterByCategory(cat));
            categoriesGrid.appendChild(div);
        });
    }

    function filterByCategory(category) {
        const filtered = allSongs.filter(s => s.category === category.id);
        filteredCategoryName.textContent = category.name;
        filteredList.innerHTML = '';
        
        if (filtered.length === 0) {
            filteredList.innerHTML = '<p class="playlist-empty">No songs in this category yet.</p>';
        } else {
            filtered.forEach((song, index) => {
                const globalIndex = allSongs.indexOf(song);
                const div = document.createElement('div');
                div.classList.add('filtered-song-item');
                if (globalIndex === currentSongIndex) div.classList.add('playing');
                div.innerHTML = `
                    <div class="filtered-song-info">
                        <div class="filtered-song-num">${index + 1}</div>
                        <div class="filtered-song-title">${song.title}</div>
                    </div>
                    <button class="filtered-song-play"><i class="fas fa-play"></i></button>
                `;
                div.addEventListener('click', () => {
                    playSong(globalIndex);
                    updateFilteredSongs();
                });
                filteredList.appendChild(div);
            });
        }
        
        categoriesGrid.classList.add('hidden');
        filteredSongs.classList.remove('hidden');
    }

    function updateFilteredSongs() {
        document.querySelectorAll('.filtered-song-item').forEach((item) => {
            const titleEl = item.querySelector('.filtered-song-title');
            if (titleEl) {
                const song = allSongs.find(s => s.title === titleEl.textContent);
                if (song) {
                    const globalIndex = allSongs.indexOf(song);
                    item.classList.toggle('playing', globalIndex === currentSongIndex);
                }
            }
        });
    }

    backToCategories.addEventListener('click', () => {
        categoriesGrid.classList.remove('hidden');
        filteredSongs.classList.add('hidden');
    });

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function encodeSongPath(path) {
        return path.split('/').map(part => encodeURIComponent(part)).join('/');
    }

    function playSong(index) {
        if (index < 0 || index >= allSongs.length) return;
        
        currentSongIndex = index;
        const song = allSongs[index];
        const encodedPath = encodeSongPath(song.file);
        audio.src = `songs/${encodedPath}`;
        audio.load();
        audio.play().then(() => {
            isPlaying = true;
            playBtn.querySelector('i').className = 'fas fa-pause';
            musicIcon.classList.add('playing');
            currentSongTitle.textContent = song.title;
            currentSongArtist.textContent = `Playing song ${index + 1} of ${allSongs.length}`;
            updateFilteredSongs();
        }).catch(err => {
            console.error('Error playing song:', err);
        });
    }

    function pauseSong() {
        audio.pause();
        isPlaying = false;
        playBtn.querySelector('i').className = 'fas fa-play';
        musicIcon.classList.remove('playing');
    }

    function resumeSong() {
        audio.play();
        isPlaying = true;
        playBtn.querySelector('i').className = 'fas fa-pause';
        musicIcon.classList.add('playing');
    }

    function playNext() {
        if (currentSongIndex < allSongs.length - 1) {
            playSong(currentSongIndex + 1);
        } else {
            playSong(0);
        }
    }

    function playPrev() {
        if (currentSongIndex > 0) {
            playSong(currentSongIndex - 1);
        } else {
            playSong(allSongs.length - 1);
        }
    }

    playBtn.addEventListener('click', () => {
        if (allSongs.length === 0) return;

        if (currentSongIndex === -1) {
            playSong(0);
            return;
        }

        if (isPlaying) {
            pauseSong();
        } else {
            resumeSong();
        }
    });

    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = progress + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
            totalTimeEl.textContent = formatTime(audio.duration);
        }
    });

    audio.addEventListener('ended', playNext);

    progressBar.addEventListener('click', (e) => {
        if (audio.duration) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percent = clickX / width;
            audio.currentTime = percent * audio.duration;
        }
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
    });

    audio.volume = volumeSlider.value / 100;

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (document.getElementById('games').classList.contains('active')) return;
        if (document.getElementById('arena').classList.contains('active')) return;
        
        switch(e.code) {
            case 'ArrowRight':
                nextBtn.click();
                break;
            case 'ArrowLeft':
                prevBtn.click();
                break;
            case 'ArrowUp':
                e.preventDefault();
                volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 5);
                audio.volume = volumeSlider.value / 100;
                break;
            case 'ArrowDown':
                e.preventDefault();
                volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 5);
                audio.volume = volumeSlider.value / 100;
                break;
        }
    });

    // ========== Cursor Glow Effect ==========
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorGlow.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('visible');
    });

    document.addEventListener('mouseenter', () => {
        cursorGlow.classList.add('visible');
    });

    const interactiveElements = document.querySelectorAll('a, button, .glass-card, .nav-link, .feature-card, .cyber-card, .playlist-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorGlow.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorGlow.classList.remove('hover'));
    });

    function animateCursor() {
        const speed = 0.15;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ========== Login / Account System ==========
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const createModal = document.getElementById('createModal');
    const closeCreateModal = document.getElementById('closeCreateModal');
    const showCreateAccount = document.getElementById('showCreateAccount');
    const showLogin = document.getElementById('showLogin');
    const loginSubmit = document.getElementById('loginSubmit');
    const createSubmit = document.getElementById('createSubmit');
    const profileCircle = document.getElementById('profileCircle');
    const viewProfileBtn = document.getElementById('viewProfileBtn');
    const profileModal = document.getElementById('profileModal');
    const closeProfileModal = document.getElementById('closeProfileModal');
    const profileLogoutBtn = document.getElementById('profileLogoutBtn');

    let userAnswers = { dev: null, cyber: null };

    loginBtn.addEventListener('click', () => {
        clearAllErrors();
        loginModal.classList.remove('hidden');
    });

    closeLoginModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
        clearAllErrors();
    });

    showCreateAccount.addEventListener('click', () => {
        loginModal.classList.add('hidden');
        clearAllErrors();
        createModal.classList.remove('hidden');
    });

    closeCreateModal.addEventListener('click', () => {
        createModal.classList.add('hidden');
        clearAllErrors();
    });

    showLogin.addEventListener('click', () => {
        createModal.classList.add('hidden');
        clearAllErrors();
        loginModal.classList.remove('hidden');
    });

    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.getAttribute('data-question');
            const value = btn.getAttribute('data-value');
            userAnswers[question] = value;

            const group = btn.parentElement;
            group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');

            const errEl = document.getElementById('create' + question.charAt(0).toUpperCase() + question.slice(1) + 'Error');
            if (errEl) errEl.classList.add('hidden');
        });
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPassword(password) {
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return hasUpper && hasNumber;
    }

    function showError(id, msg) {
        const el = document.getElementById(id);
        if (el) { el.textContent = msg; el.classList.remove('hidden'); }
    }

    function hideError(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    }

    function clearAllErrors() {
        document.querySelectorAll('.form-error').forEach(e => e.classList.add('hidden'));
    }

    document.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
            const errEl = input.parentElement.querySelector('.form-error');
            if (errEl) errEl.classList.add('hidden');
        });
    });

    loginSubmit.addEventListener('click', () => {
        clearAllErrors();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        let valid = true;

        if (!email) {
            showError('loginEmailError', 'Email is required');
            valid = false;
        } else if (!isValidEmail(email)) {
            showError('loginEmailError', 'Please enter a valid email address');
            valid = false;
        }

        if (!password) {
            showError('loginPasswordError', 'Password is required');
            valid = false;
        }

        if (!valid) return;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            loginModal.classList.add('hidden');
            updateUIForLoggedInUser(user);
        } else {
            showError('loginPasswordError', 'Invalid email or password');
        }
    });

    createSubmit.addEventListener('click', () => {
        clearAllErrors();
        const username = document.getElementById('createUsername').value.trim();
        const name = document.getElementById('createName').value.trim();
        const email = document.getElementById('createEmail').value.trim();
        const password = document.getElementById('createPassword').value;
        const confirmPassword = document.getElementById('createConfirmPassword').value;
        let valid = true;

        if (!username) {
            showError('createUsernameError', 'Username is required');
            valid = false;
        } else if (username.length < 3) {
            showError('createUsernameError', 'Username must be at least 3 characters');
            valid = false;
        }

        if (!name) {
            showError('createNameError', 'Full name is required');
            valid = false;
        }

        if (!email) {
            showError('createEmailError', 'Email is required');
            valid = false;
        } else if (!isValidEmail(email)) {
            showError('createEmailError', 'Please enter a valid email address');
            valid = false;
        }

        if (!password) {
            showError('createPasswordError', 'Password is required');
            valid = false;
        } else if (password.length < 6) {
            showError('createPasswordError', 'Password must be at least 6 characters');
            valid = false;
        } else if (!isValidPassword(password)) {
            showError('createPasswordError', 'Password must contain uppercase letters and numbers');
            valid = false;
        }

        if (!confirmPassword) {
            showError('createConfirmError', 'Please confirm your password');
            valid = false;
        } else if (confirmPassword !== password) {
            showError('createConfirmError', 'Passwords do not match');
            valid = false;
        }

        if (userAnswers.dev === null) {
            showError('createDevError', 'Please answer this question');
            valid = false;
        }

        if (userAnswers.cyber === null) {
            showError('createCyberError', 'Please answer this question');
            valid = false;
        }

        if (!valid) return;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const emailExists = users.some(u => u.email === email);
        if (emailExists) {
            showError('createEmailError', 'This email is already registered');
            return;
        }

        const newUser = {
            username,
            name,
            email,
            password,
            lovesDev: userAnswers.dev === 'yes',
            lovesCyber: userAnswers.cyber === 'yes',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        createModal.classList.add('hidden');
        updateUIForLoggedInUser(newUser);
    });

    function updateUIForLoggedInUser(user) {
        loginBtn.classList.add('hidden');
        profileCircle.innerHTML = `<span style="font-size:14px;font-weight:700;color:white;">${user.username.charAt(0).toUpperCase()}</span>`;
        viewProfileBtn.classList.remove('hidden');
    }

    function openProfileModal() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) return;

        document.getElementById('profileModalAvatar').innerHTML = `<span style="font-size:28px;font-weight:700;color:white;">${user.username.charAt(0).toUpperCase()}</span>`;
        document.getElementById('profileModalUsername').textContent = user.username;
        document.getElementById('profileModalName').textContent = user.name;
        document.getElementById('profileModalEmail').textContent = user.email;
        document.getElementById('profileModalPassword').textContent = '••••••••';

        const date = new Date(user.createdAt);
        document.getElementById('profileModalDate').textContent = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        document.getElementById('modalBadgeDev').classList.toggle('active', user.lovesDev);
        document.getElementById('modalBadgeCyber').classList.toggle('active', user.lovesCyber);

        profileModal.classList.remove('hidden');
    }

    closeProfileModal.addEventListener('click', () => {
        profileModal.classList.add('hidden');
    });

    profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) profileModal.classList.add('hidden');
    });

    profileCircle.addEventListener('click', openProfileModal);
    viewProfileBtn.addEventListener('click', openProfileModal);

    profileLogoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        viewProfileBtn.classList.add('hidden');
        loginBtn.classList.remove('hidden');
        profileCircle.innerHTML = '<i class="fas fa-user"></i>';
        profileModal.classList.add('hidden');
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }

    loginModal.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.classList.add('hidden');
    });

    createModal.addEventListener('click', (e) => {
        if (e.target === createModal) createModal.classList.add('hidden');
    });

    // ========== GAMES SECTION ==========
    const gamesMenu = document.getElementById('gamesMenu');
    const gameContainer = document.getElementById('gameContainer');
    const gameArea = document.getElementById('gameArea');
    const gameCanvas = document.getElementById('gameCanvas');
    const gameTitle = document.getElementById('gameTitle');
    const gameScore = document.getElementById('gameScore');
    const gameHint = document.getElementById('gameHint');
    const backToGames = document.getElementById('backToGames');
    const ctx = gameCanvas.getContext('2d');
    let currentGame = null;
    let gameAnimFrame = null;

    gamesMenu.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', () => {
            const game = card.getAttribute('data-game');
            startGame(game);
        });
    });

    backToGames.addEventListener('click', () => {
        stopCurrentGame();
        gamesMenu.style.display = '';
        gameContainer.classList.add('hidden');
    });

    function startGame(game) {
        stopCurrentGame();
        gamesMenu.style.display = 'none';
        gameContainer.classList.remove('hidden');
        gameArea.innerHTML = '';
        gameArea.appendChild(gameCanvas);
        currentGame = game;
        gameScore.textContent = '0';

        if (game === 'rex') {
            gameTitle.textContent = 'REX';
            gameHint.textContent = 'Press SPACE or Tap to jump over obstacles';
            initRex();
        } else if (game === 'snake') {
            gameTitle.textContent = 'SNAKE';
            gameHint.textContent = 'Use Arrow Keys or WASD to move';
            initSnake();
        } else if (game === 'aim') {
            gameTitle.textContent = 'AIM';
            gameHint.textContent = 'Click the targets as fast as you can!';
            initAim();
        }
    }

    function stopCurrentGame() {
        if (gameAnimFrame) cancelAnimationFrame(gameAnimFrame);
        gameAnimFrame = null;
        document.onkeydown = null;
        document.onkeyup = null;
        gameArea.onclick = null;
        currentGame = null;
    }

    // ==================== REX GAME ====================
    function initRex() {
        const W = 760, H = 250;
        gameCanvas.width = W;
        gameCanvas.height = H;

        const ground = H - 30;
        let rex = { x: 60, y: ground, vy: 0, w: 40, h: 50, grounded: true, jumping: false, ducking: false };
        let obstacles = [];
        let clouds = [];
        let score = 0;
        let speed = 4;
        let frameCount = 0;
        let gameOver = false;
        let started = false;

        function spawnObstacle() {
            const types = ['cactus-small', 'cactus-tall', 'cactus-group', 'bird'];
            const type = types[Math.floor(Math.random() * (speed > 6 ? 4 : 3))];
            let obs = { x: W + 20, type: type };
            if (type === 'cactus-small') { obs.y = ground - 30; obs.w = 16; obs.h = 30; }
            else if (type === 'cactus-tall') { obs.y = ground - 45; obs.w = 20; obs.h = 45; }
            else if (type === 'cactus-group') { obs.y = ground - 35; obs.w = 45; obs.h = 35; }
            else if (type === 'bird') { obs.y = ground - 40 - Math.random() * 40; obs.w = 40; obs.h = 25; }
            obstacles.push(obs);
        }

        function drawRex() {
            ctx.fillStyle = '#535353';
            const rx = rex.x, ry = rex.y, rw = rex.w, rh = rex.h;

            ctx.fillRect(rx + 5, ry, rw - 15, rh - 10);

            ctx.fillRect(rx + rw - 15, ry + 5, 15, 25);

            ctx.fillRect(rx + rw - 15, ry + 5, 10, 8);
            ctx.fillStyle = '#fff';
            ctx.fillRect(rx + rw - 10, ry + 7, 4, 4);

            ctx.fillStyle = '#535353';
            ctx.fillRect(rx + rw - 15, ry + 18, 12, 5);

            if (!rex.ducking) {
                ctx.fillRect(rx + 10, ry - 5, 5, 12);
                ctx.fillRect(rx + 15, ry - 10, 8, 5);
            } else {
                ctx.fillRect(rx, ry + rh - 15, rw, 12);
            }

            const legOffset = (Math.floor(frameCount / 6) % 2 === 0) ? 0 : 8;
            ctx.fillRect(rx + 8, ry + rh - 10, 8, 10);
            ctx.fillRect(rx + rw - 20, ry + rh - 10, 8, 10);
        }

        function drawCactus(obs) {
            ctx.fillStyle = '#2d5a27';
            const cx = obs.x, cy = obs.y, cw = obs.w, ch = obs.h;

            ctx.fillRect(cx + cw / 2 - 4, cy, 8, ch);

            if (obs.type === 'cactus-tall' || obs.type === 'cactus-group') {
                ctx.fillRect(cx + cw / 2 - 12, cy + 8, 10, 5);
                ctx.fillRect(cx + cw / 2 + 4, cy + 15, 10, 5);
            }
            if (obs.type === 'cactus-group') {
                ctx.fillRect(cx, cy + 5, 8, ch - 5);
                ctx.fillRect(cx + cw - 8, cy + 8, 8, ch - 8);
            }
        }

        function drawBird(b) {
            ctx.fillStyle = '#535353';
            const wingUp = Math.floor(frameCount / 8) % 2 === 0;
            ctx.fillRect(b.x, b.y + 8, b.w, 8);
            if (wingUp) {
                ctx.fillRect(b.x + 5, b.y, 20, 8);
            } else {
                ctx.fillRect(b.x + 5, b.y + 16, 20, 8);
            }
        }

        function drawGround() {
            ctx.fillStyle = '#e8e8e8';
            ctx.fillRect(0, ground + 2, W, 2);
            ctx.fillStyle = '#535353';
            for (let i = 0; i < W; i += 4) {
                if (Math.random() > 0.85) {
                    ctx.fillRect(i, ground + 5 + Math.random() * 10, 2, 2);
                }
            }
        }

        function drawCloud() {
            ctx.fillStyle = 'rgba(200,200,200,0.4)';
            clouds.forEach(c => {
                ctx.beginPath();
                ctx.arc(c.x, c.y, 12, 0, Math.PI * 2);
                ctx.arc(c.x + 15, c.y - 5, 16, 0, Math.PI * 2);
                ctx.arc(c.x + 30, c.y, 12, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        function checkCollision(a, b) {
            const margin = 6;
            return a.x + margin < b.x + b.w - margin &&
                   a.x + a.w - margin > b.x + margin &&
                   a.y + margin < b.y + b.h - margin &&
                   a.y + a.h - margin > b.y + margin;
        }

        function rexLoop() {
            if (gameOver) return;
            gameAnimFrame = requestAnimationFrame(rexLoop);
            frameCount++;

            if (frameCount % 90 === 0) { score++; speed = 4 + score * 0.3; }
            if (frameCount % Math.max(60, 150 - Math.floor(speed * 10)) === 0) spawnObstacle();

            rex.vy += 0.6;
            rex.y += rex.vy;
            if (rex.y >= ground) { rex.y = ground; rex.vy = 0; rex.grounded = true; rex.jumping = false; }

            obstacles.forEach(o => o.x -= speed);
            obstacles = obstacles.filter(o => o.x > -60);

            if (Math.random() < 0.005) clouds.push({ x: W + 20, y: 30 + Math.random() * 60 });
            clouds.forEach(c => c.x -= 1);
            clouds = clouds.filter(c => c.x > -50);

            for (const o of obstacles) {
                if (checkCollision(rex, o)) {
                    gameOver = true;
                    gameScore.textContent = score;
                    showRexGameOver();
                    return;
                }
            }

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = 'rgba(255,255,255,0.03)';
            ctx.fillRect(0, 0, W, H);
            drawCloud();
            drawGround();
            obstacles.forEach(o => { o.type.startsWith('bird') ? drawBird(o) : drawCactus(o); });
            drawRex();
            gameScore.textContent = score;
        }

        function showRexGameOver() {
            const div = document.createElement('div');
            div.className = 'rex-game-over';
            div.innerHTML = `
                <h2>GAME OVER</h2>
                <p>Score: ${score}</p>
                <button class="glow-btn" id="rexRestart"><i class="fas fa-redo"></i> Restart</button>
            `;
            gameArea.appendChild(div);
            div.querySelector('#rexRestart').addEventListener('click', () => {
                div.remove();
                initRex();
            });
        }

        document.onkeydown = (e) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                if (!started) { started = true; rexLoop(); }
                if (rex.grounded && !gameOver) {
                    rex.vy = -12;
                    rex.grounded = false;
                    rex.jumping = true;
                }
            }
        };

        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = '#ffffff80';
        ctx.font = '16px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to start', W / 2, H / 2);
    }

    // ==================== SNAKE GAME ====================
    function initSnake() {
        const W = 760, H = 400;
        const cell = 20;
        const cols = Math.floor(W / cell);
        const rows = Math.floor(H / cell);
        gameCanvas.width = W;
        gameCanvas.height = H;

        let snake = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
        let dir = { x: 1, y: 0 };
        let nextDir = { x: 1, y: 0 };
        let food = spawnFood();
        let score = 0;
        let speed = 120;
        let gameOver = false;
        let lastTime = 0;

        function spawnFood() {
            let pos;
            do {
                pos = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
            } while (snake.some(s => s.x === pos.x && s.y === pos.y));
            return pos;
        }

        function snakeLoop(time) {
            if (gameOver) return;
            gameAnimFrame = requestAnimationFrame(snakeLoop);
            if (time - lastTime < speed) return;
            lastTime = time;

            dir = { ...nextDir };
            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

            if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
                gameOver = true;
                showSnakeGameOver();
                return;
            }

            for (let i = 0; i < snake.length; i++) {
                if (snake[i].x === head.x && snake[i].y === head.y) {
                    gameOver = true;
                    showSnakeGameOver();
                    return;
                }
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score++;
                gameScore.textContent = score;
                food = spawnFood();
                if (speed > 50) speed -= 2;
            } else {
                snake.pop();
            }

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = 'rgba(255,255,255,0.02)';
            ctx.fillRect(0, 0, W, H);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    if ((i + j) % 2 === 0) {
                        ctx.fillStyle = 'rgba(255,255,255,0.01)';
                        ctx.fillRect(i * cell, j * cell, cell, cell);
                    }
                }
            }

            snake.forEach((s, i) => {
                const brightness = 1 - (i / snake.length) * 0.5;
                ctx.fillStyle = i === 0
                    ? '#00ff88'
                    : `rgba(0, ${Math.floor(212 * brightness)}, ${Math.floor(136 * brightness)}, ${brightness})`;
                ctx.shadowColor = i === 0 ? '#00ff88' : 'transparent';
                ctx.shadowBlur = i === 0 ? 10 : 0;
                ctx.beginPath();
                const rx = s.x * cell + 1, ry = s.y * cell + 1, rw = cell - 2, rh = cell - 2, rr = 4;
                ctx.moveTo(rx + rr, ry);
                ctx.lineTo(rx + rw - rr, ry);
                ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + rr);
                ctx.lineTo(rx + rw, ry + rh - rr);
                ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rr, ry + rh);
                ctx.lineTo(rx + rr, ry + rh);
                ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - rr);
                ctx.lineTo(rx, ry + rr);
                ctx.quadraticCurveTo(rx, ry, rx + rr, ry);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            ctx.fillStyle = '#ff4444';
            ctx.shadowColor = '#ff4444';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(food.x * cell + cell / 2, food.y * cell + cell / 2, cell / 2 - 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        function showSnakeGameOver() {
            const div = document.createElement('div');
            div.className = 'rex-game-over';
            div.innerHTML = `
                <h2>GAME OVER</h2>
                <p>Score: ${score}</p>
                <button class="glow-btn" id="snakeRestart"><i class="fas fa-redo"></i> Restart</button>
            `;
            gameArea.appendChild(div);
            div.querySelector('#snakeRestart').addEventListener('click', () => {
                div.remove();
                initSnake();
            });
        }

        document.onkeydown = (e) => {
            const key = e.code;
            if ((key === 'ArrowUp' || key === 'KeyW') && dir.y !== 1) { nextDir = { x: 0, y: -1 }; e.preventDefault(); }
            else if ((key === 'ArrowDown' || key === 'KeyS') && dir.y !== -1) { nextDir = { x: 0, y: 1 }; e.preventDefault(); }
            else if ((key === 'ArrowLeft' || key === 'KeyA') && dir.x !== 1) { nextDir = { x: -1, y: 0 }; e.preventDefault(); }
            else if ((key === 'ArrowRight' || key === 'KeyD') && dir.x !== -1) { nextDir = { x: 1, y: 0 }; e.preventDefault(); }
        };

        gameAnimFrame = requestAnimationFrame(snakeLoop);
    }

    // ==================== AIM GAME ====================
    function initAim() {
        const W = 760, H = 400;
        gameCanvas.width = W;
        gameCanvas.height = H;
        gameArea.style.cursor = 'crosshair';

        let score = 0;
        let targetTime = 3000;
        let target = null;
        let timerInterval = null;
        let gameEnded = false;
        let targetSize = 50;

        function spawnTarget() {
            if (gameEnded) return;
            targetSize = Math.max(20, 50 - score * 2);
            const maxX = W - targetSize;
            const maxY = H - targetSize;
            const tx = Math.random() * maxX;
            const ty = Math.random() * maxY;
            target = { x: tx, y: ty, size: targetSize, alive: true };

            targetTime = Math.max(500, 3000 - score * 150);

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = 'rgba(255,255,255,0.02)';
            ctx.fillRect(0, 0, W, H);

            const gradient = ctx.createRadialGradient(tx + targetSize / 2, ty + targetSize / 2, 0, tx + targetSize / 2, ty + targetSize / 2, targetSize / 2);
            gradient.addColorStop(0, '#ff6666');
            gradient.addColorStop(0.5, '#ff4444');
            gradient.addColorStop(0.7, '#cc0000');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(tx + targetSize / 2, ty + targetSize / 2, targetSize / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(tx + targetSize / 2, ty + targetSize / 2, targetSize / 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(tx + targetSize / 2, ty + targetSize / 2, targetSize / 3, 0, Math.PI * 2);
            ctx.stroke();

            let remaining = targetTime;
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                remaining -= 50;
                if (remaining <= 0) {
                    clearInterval(timerInterval);
                    if (!gameEnded && target && target.alive) {
                        endAimGame();
                    }
                }
            }, 50);
        }

        function endAimGame() {
            gameEnded = true;
            clearInterval(timerInterval);
            gameArea.onclick = null;
            gameArea.style.cursor = 'default';
            const div = document.createElement('div');
            div.className = 'aim-result';
            div.innerHTML = `
                <h2>TIME'S UP!</h2>
                <p>Final Score: ${score}</p>
                <button class="glow-btn" id="aimRestart"><i class="fas fa-redo"></i> Play Again</button>
            `;
            gameArea.appendChild(div);
            div.querySelector('#aimRestart').addEventListener('click', () => {
                div.remove();
                initAim();
            });
        }

        gameArea.onclick = (e) => {
            if (gameEnded || !target || !target.alive) return;
            const rect = gameCanvas.getBoundingClientRect();
            const scaleX = W / rect.width;
            const scaleY = H / rect.height;
            const mx = (e.clientX - rect.left) * scaleX;
            const my = (e.clientY - rect.top) * scaleY;
            const cx = target.x + target.size / 2;
            const cy = target.y + target.size / 2;
            const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);

            if (dist <= target.size / 2) {
                target.alive = false;
                clearInterval(timerInterval);
                score++;
                gameScore.textContent = score;
                setTimeout(spawnTarget, 300);
            }
        };

        spawnTarget();
    }

    // ==================== MARKET SECTION ====================
    const marketLocked = document.getElementById('marketLocked');
    const marketContent = document.getElementById('marketContent');
    const marketLoginBtn = document.getElementById('marketLoginBtn');
    const marketCreateBtn = document.getElementById('marketCreateBtn');
    const marketPosts = document.getElementById('marketPosts');
    const marketEmpty = document.getElementById('marketEmpty');
    const createListingModal = document.getElementById('createListingModal');
    const closeListingModal = document.getElementById('closeListingModal');
    const listingSubmit = document.getElementById('listingSubmit');
    const confirmListingModal = document.getElementById('confirmListingModal');
    const confirmListingYes = document.getElementById('confirmListingYes');
    const confirmListingNo = document.getElementById('confirmListingNo');
    const listingPreview = document.getElementById('listingPreview');
    const marketCategories = document.getElementById('marketCategories');

    let marketListings = JSON.parse(localStorage.getItem('marketListings')) || [];
    let pendingListing = null;
    let activeMarketCat = 'all';

    function checkMarketLogin() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            marketLocked.classList.add('hidden');
            marketContent.classList.remove('hidden');
            renderMarketPosts();
        } else {
            marketLocked.classList.remove('hidden');
            marketContent.classList.add('hidden');
        }
    }

    marketLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });

    marketCreateBtn.addEventListener('click', () => {
        createListingModal.classList.remove('hidden');
    });

    closeListingModal.addEventListener('click', () => {
        createListingModal.classList.add('hidden');
        clearAllErrors();
    });

    createListingModal.addEventListener('click', (e) => {
        if (e.target === createListingModal) createListingModal.classList.add('hidden');
    });

    confirmListingNo.addEventListener('click', () => {
        confirmListingModal.classList.add('hidden');
    });

    confirmListingModal.addEventListener('click', (e) => {
        if (e.target === confirmListingModal) confirmListingModal.classList.add('hidden');
    });

    marketCategories.querySelectorAll('.market-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            marketCategories.querySelectorAll('.market-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeMarketCat = btn.getAttribute('data-cat');
            renderMarketPosts();
        });
    });

    listingSubmit.addEventListener('click', () => {
        clearAllErrors();
        const name = document.getElementById('listingName').value.trim();
        const category = document.getElementById('listingCategory').value;
        const desc = document.getElementById('listingDesc').value.trim();
        const price = document.getElementById('listingPrice').value.trim();
        const contact = document.getElementById('listingContact').value.trim();
        let valid = true;

        if (!name) { showError('listingNameError', 'Item name is required'); valid = false; }
        if (!desc) { showError('listingDescError', 'Description is required'); valid = false; }
        if (!price) { showError('listingPriceError', 'Price is required'); valid = false; }
        if (!contact) { showError('listingContactError', 'Contact info is required'); valid = false; }

        if (!valid) return;

        const user = JSON.parse(localStorage.getItem('currentUser'));
        pendingListing = { name, category, desc, price, contact, author: user.username, date: new Date().toISOString() };

        listingPreview.innerHTML = `
            <p><strong>Name:</strong> ${pendingListing.name}</p>
            <p><strong>Category:</strong> ${pendingListing.category}</p>
            <p><strong>Description:</strong> ${pendingListing.desc}</p>
            <p><strong>Price:</strong> ${pendingListing.price}</p>
            <p><strong>Contact:</strong> ${pendingListing.contact}</p>
        `;

        createListingModal.classList.add('hidden');
        confirmListingModal.classList.remove('hidden');
    });

    confirmListingYes.addEventListener('click', () => {
        if (!pendingListing) return;

        marketListings.unshift(pendingListing);
        localStorage.setItem('marketListings', JSON.stringify(marketListings));
        pendingListing = null;

        confirmListingModal.classList.add('hidden');
        renderMarketPosts();

        document.getElementById('listingName').value = '';
        document.getElementById('listingDesc').value = '';
        document.getElementById('listingPrice').value = '';
        document.getElementById('listingContact').value = '';
    });

    // ========== DELETE LISTING ==========
    const deleteListingModal = document.getElementById('deleteListingModal');
    const confirmDeleteYes = document.getElementById('confirmDeleteYes');
    const confirmDeleteNo = document.getElementById('confirmDeleteNo');
    let pendingDeleteIndex = -1;

    confirmDeleteNo.addEventListener('click', () => {
        deleteListingModal.classList.add('hidden');
        pendingDeleteIndex = -1;
    });

    deleteListingModal.addEventListener('click', (e) => {
        if (e.target === deleteListingModal) {
            deleteListingModal.classList.add('hidden');
            pendingDeleteIndex = -1;
        }
    });

    confirmDeleteYes.addEventListener('click', () => {
        if (pendingDeleteIndex === -1) return;

        const user = JSON.parse(localStorage.getItem('currentUser'));
        const listing = marketListings[pendingDeleteIndex];

        if (listing && listing.author === user.username) {
            marketListings.splice(pendingDeleteIndex, 1);
            localStorage.setItem('marketListings', JSON.stringify(marketListings));
            renderMarketPosts();
        }

        deleteListingModal.classList.add('hidden');
        pendingDeleteIndex = -1;
    });

    function renderMarketPosts() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const filtered = activeMarketCat === 'all'
            ? marketListings
            : marketListings.filter(l => l.category === activeMarketCat);

        marketPosts.innerHTML = '';

        if (filtered.length === 0) {
            marketPosts.innerHTML = `
                <p class="market-empty">
                    <i class="fas fa-store-slash"></i><br>
                    No listings yet. Be the first to create one!
                </p>
            `;
            return;
        }

        filtered.forEach(listing => {
            const globalIndex = marketListings.indexOf(listing);
            const card = document.createElement('div');
            card.classList.add('market-post-card');
            const date = new Date(listing.date);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const isAuthor = user && listing.author === user.username;

            card.innerHTML = `
                <div class="market-post-header">
                    <div class="market-post-name">${listing.name}</div>
                    <div class="market-post-price">${listing.price}</div>
                </div>
                <div class="market-post-category">${listing.category}</div>
                <div class="market-post-desc">${listing.desc}</div>
                <div class="market-post-contact"><i class="fas fa-address-card"></i> ${listing.contact}</div>
                <div class="market-post-author"><i class="fas fa-user"></i> ${listing.author}</div>
                <div class="market-post-footer">
                    <div class="market-post-date">${dateStr}</div>
                    ${isAuthor ? `<button class="market-delete-btn" data-index="${globalIndex}"><i class="fas fa-trash"></i> Delete</button>` : ''}
                </div>
            `;
            marketPosts.appendChild(card);
        });

        marketPosts.querySelectorAll('.market-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                pendingDeleteIndex = parseInt(btn.getAttribute('data-index'));
                deleteListingModal.classList.remove('hidden');
            });
        });
    }

    // Re-check market login when navigating to market section
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('data-section') === 'market') {
                checkMarketLogin();
            }
        });
    });

    // Also re-check when user logs in via the login modal
    loginSubmit.addEventListener('click', () => {
        setTimeout(checkMarketLogin, 100);
    });

    createSubmit.addEventListener('click', () => {
        setTimeout(checkMarketLogin, 100);
    });

    profileLogoutBtn.addEventListener('click', () => {
        setTimeout(checkMarketLogin, 100);
    });

    checkMarketLogin();

    // ==================== SUGGESTION SECTION ====================
    const suggestionLocked = document.getElementById('suggestionLocked');
    const suggestionContent = document.getElementById('suggestionContent');
    const suggestionLoginBtn = document.getElementById('suggestionLoginBtn');
    const suggestionSubmit = document.getElementById('suggestionSubmit');
    const suggestionList = document.getElementById('suggestionList');
    const deleteSuggestionModal = document.getElementById('deleteSuggestionModal');
    const confirmDeleteSuggestionYes = document.getElementById('confirmDeleteSuggestionYes');
    const confirmDeleteSuggestionNo = document.getElementById('confirmDeleteSuggestionNo');

    let suggestions = JSON.parse(localStorage.getItem('suggestions')) || [];
    let pendingDeleteSuggestionIndex = -1;

    function checkSuggestionLogin() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            suggestionLocked.classList.add('hidden');
            suggestionContent.classList.remove('hidden');
            renderSuggestions();
        } else {
            suggestionLocked.classList.remove('hidden');
            suggestionContent.classList.add('hidden');
        }
    }

    suggestionLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });

    suggestionSubmit.addEventListener('click', () => {
        clearAllErrors();
        const title = document.getElementById('suggestionTitle').value.trim();
        const text = document.getElementById('suggestionText').value.trim();
        let valid = true;

        if (!title) { showError('suggestionTitleError', 'Title is required'); valid = false; }
        if (!text) { showError('suggestionTextError', 'Suggestion is required'); valid = false; }
        if (!valid) return;

        const user = JSON.parse(localStorage.getItem('currentUser'));
        const suggestion = {
            title,
            text,
            author: user.username,
            date: new Date().toISOString()
        };

        suggestions.unshift(suggestion);
        localStorage.setItem('suggestions', JSON.stringify(suggestions));

        document.getElementById('suggestionTitle').value = '';
        document.getElementById('suggestionText').value = '';

        renderSuggestions();
    });

    confirmDeleteSuggestionNo.addEventListener('click', () => {
        deleteSuggestionModal.classList.add('hidden');
        pendingDeleteSuggestionIndex = -1;
    });

    deleteSuggestionModal.addEventListener('click', (e) => {
        if (e.target === deleteSuggestionModal) {
            deleteSuggestionModal.classList.add('hidden');
            pendingDeleteSuggestionIndex = -1;
        }
    });

    confirmDeleteSuggestionYes.addEventListener('click', () => {
        if (pendingDeleteSuggestionIndex === -1) return;

        const user = JSON.parse(localStorage.getItem('currentUser'));
        const suggestion = suggestions[pendingDeleteSuggestionIndex];

        if (suggestion && suggestion.author === user.username) {
            suggestions.splice(pendingDeleteSuggestionIndex, 1);
            localStorage.setItem('suggestions', JSON.stringify(suggestions));
            renderSuggestions();
        }

        deleteSuggestionModal.classList.add('hidden');
        pendingDeleteSuggestionIndex = -1;
    });

    function renderSuggestions() {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        suggestionList.innerHTML = '';

        if (suggestions.length === 0) {
            suggestionList.innerHTML = `
                <p class="market-empty">
                    <i class="fas fa-lightbulb"></i><br>
                    No suggestions yet. Be the first to share your ideas!
                </p>
            `;
            return;
        }

        suggestions.forEach((suggestion, index) => {
            const card = document.createElement('div');
            card.classList.add('suggestion-card');
            const date = new Date(suggestion.date);
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const isAuthor = user && suggestion.author === user.username;

            card.innerHTML = `
                <div class="suggestion-card-header">
                    <div class="suggestion-card-title">${suggestion.title}</div>
                    ${isAuthor ? `<button class="suggestion-card-delete" data-index="${index}"><i class="fas fa-trash"></i> Delete</button>` : ''}
                </div>
                <div class="suggestion-card-text">${suggestion.text}</div>
                <div class="suggestion-card-footer">
                    <div class="suggestion-card-author"><i class="fas fa-user"></i> ${suggestion.author}</div>
                    <div class="suggestion-card-date">${dateStr}</div>
                </div>
            `;
            suggestionList.appendChild(card);
        });

        suggestionList.querySelectorAll('.suggestion-card-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                pendingDeleteSuggestionIndex = parseInt(btn.getAttribute('data-index'));
                deleteSuggestionModal.classList.remove('hidden');
            });
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.getAttribute('data-section') === 'suggestion') {
                checkSuggestionLogin();
            }
        });
    });

    loginSubmit.addEventListener('click', () => {
        setTimeout(checkSuggestionLogin, 100);
    });

    createSubmit.addEventListener('click', () => {
        setTimeout(checkSuggestionLogin, 100);
    });

    profileLogoutBtn.addEventListener('click', () => {
        setTimeout(checkSuggestionLogin, 100);
    });

    checkSuggestionLogin();

    // ==================== CODING ARENA ====================
    const arenaLangTabs = document.getElementById('arenaLangTabs');
    const arenaChallenges = document.getElementById('arenaChallenges');
    const arenaScoreNum = document.getElementById('arenaScoreNum');
    const arenaScoreMax = document.getElementById('arenaScoreMax');
    const arenaScoreFill = document.getElementById('arenaScoreFill');
    const codeEditorModal = document.getElementById('codeEditorModal');
    const closeCodeEditor = document.getElementById('closeCodeEditor');
    const editorChallengeTitle = document.getElementById('editorChallengeTitle');
    const editorDifficulty = document.getElementById('editorDifficulty');
    const editorDescription = document.getElementById('editorDescription');
    const editorOutputText = document.getElementById('editorOutputText');
    const codeEditor = document.getElementById('codeEditor');
    const runCodeBtn = document.getElementById('runCodeBtn');
    const resetCodeBtn = document.getElementById('resetCodeBtn');
    const editorResult = document.getElementById('editorResult');

    const POINTS = { easy: 5, medium: 10, hard: 15, fire: 20 };
    const DIFF_LABELS = { easy: 'Easy', medium: 'Medium', hard: 'Hard', fire: '🔥 Hard' };
    const DIFF_CLASS = { easy: 'arena-diff-easy', medium: 'arena-diff-medium', hard: 'arena-diff-hard', fire: 'arena-diff-fire' };

    const arenaData = {
        python: {
            icon: '🐍', name: 'Python',
            challenges: [
                { id: 'py1', title: 'Write a program that asks the user for a number and checks whether it is even or odd.', diff: 'easy', points: 5, test: (c) => /input\s*\(/.test(c) && /(even|odd|% *2|mod *2)/i.test(c) && /(if|else)/.test(c) },
                { id: 'py2', title: 'Write a program that asks the user for 3 numbers and prints the largest number.', diff: 'easy', points: 5, test: (c) => /input\s*\(/.test(c) && (/(max\s*\()/.test(c) || /if.*>/.test(c)) },
                { id: 'py3', title: 'Write a program that calculates the sum of all numbers from 1 to N.', diff: 'easy', points: 5, test: (c) => /(for|while|range|sum)\s*\(/.test(c) && (/\bsum\b/.test(c) || /\+=/.test(c) || /sum\s*\(/.test(c)) },
                { id: 'py4', title: 'Write a program that asks the user for a word and counts the number of characters without using len().', diff: 'easy', points: 5, test: (c) => /input\s*\(/.test(c) && !/len\s*\(/.test(c) && (/(for|while)\s+/.test(c) || /\+\=/.test(c) || /count/.test(c)) },
                { id: 'py5', title: 'Write a program that checks whether a word is a palindrome, such as level.', diff: 'medium', points: 10, test: (c) => (/\[::-1\]/.test(c) || /reversed\s*\(/.test(c) || /while|for/.test(c)) && /(palindrome|==|reverse)/i.test(c) },
                { id: 'py6', title: 'Write a program that asks the user for a number and prints its multiplication table from 1 to 10.', diff: 'medium', points: 10, test: (c) => /input\s*\(/.test(c) && /for/.test(c) && (/\*/.test(c) || /print/.test(c)) },
                { id: 'py7', title: 'Given a list of numbers, write a program that finds the second-largest number without using sort().', diff: 'medium', points: 10, test: (c) => !/\.sort\s*\(/.test(c) && (/(second|largest|max)/i.test(c)) && (/(for|while|sorted|remove|pop)/.test(c)) },
                { id: 'py8', title: 'Write a program that counts the number of times each character appears in a sentence.', diff: 'hard', points: 15, test: (c) => (/(count|dict|Counter|frequency)/i.test(c)) && (/(for|while)/.test(c)) },
                { id: 'py9', title: 'Write a program that removes duplicate elements from a list without using set().', diff: 'hard', points: 15, test: (c) => !/set\s*\(/.test(c) && (/(duplicate|remove|unique)/i.test(c)) && (/(for|while|if|in)/.test(c)) },
                { id: 'py10', title: '🔥 Create a Guess the Number game. The computer randomly chooses a number, and the player must guess it. After each guess, display "Too High" or "Too Low" until the player finds the correct number.', diff: 'fire', points: 20, test: (c) => /random/.test(c) && /input\s*\(/.test(c) && /Too (High|Low)/i.test(c) && (/(while|for)/.test(c)) }
            ]
        },
        java: {
            icon: '☕', name: 'Java',
            challenges: [
                { id: 'ja1', title: 'Write a Java program that asks the user for a number and checks whether it is even or odd.', diff: 'easy', points: 5, test: (c) => /Scanner/.test(c) && /System\.out/.test(c) && /(if|else)/.test(c) && /(% *2|even|odd)/i.test(c) },
                { id: 'ja2', title: 'Write a Java program that asks the user for 3 numbers and prints the largest number.', diff: 'easy', points: 5, test: (c) => /Scanner/.test(c) && /System\.out/.test(c) && /(if|else|Math\.max|Collections)/.test(c) },
                { id: 'ja3', title: 'Write a Java program that calculates the sum of all numbers from 1 to N.', diff: 'easy', points: 5, test: (c) => /Scanner/.test(c) && /(for|while)/.test(c) && (/\+=|sum|total/.test(c)) },
                { id: 'ja4', title: 'Write a Java program that asks the user for a word and counts the number of characters without using length().', diff: 'easy', points: 5, test: (c) => /Scanner/.test(c) && !/\.length\s*\(/.test(c) && (/(for|while)/.test(c)) },
                { id: 'ja5', title: 'Write a Java program that checks whether a word is a palindrome, such as level.', diff: 'medium', points: 10, test: (c) => /Scanner/.test(c) && (/(reverse|charAt|==|palindrome)/i.test(c)) && (/(for|while)/.test(c)) },
                { id: 'ja6', title: 'Write a Java program that asks the user for a number and prints its multiplication table from 1 to 10.', diff: 'medium', points: 10, test: (c) => /Scanner/.test(c) && /for/.test(c) && /System\.out/.test(c) },
                { id: 'ja7', title: 'Given an array of numbers, write a Java program that finds the second-largest number without using sorting.', diff: 'medium', points: 10, test: (c) => !/Arrays\.sort|Collections\.sort/.test(c) && /(second|largest|max)/i.test(c) && /(for|while)/.test(c) },
                { id: 'ja8', title: 'Write a Java program that counts the number of times each character appears in a sentence.', diff: 'hard', points: 15, test: (c) => /(HashMap|Map|charAt|frequency)/i.test(c) && /(for|while)/.test(c) },
                { id: 'ja9', title: 'Write a Java program that removes duplicate elements from an array without using a Set.', diff: 'hard', points: 15, test: (c) => !/HashSet|TreeSet|Set/.test(c) && /(duplicate|remove|unique)/i.test(c) && /(for|while|if|ArrayList)/.test(c) },
                { id: 'ja10', title: '🔥 Create a Guess the Number game in Java. The computer randomly chooses a number, and the player must guess it. After each guess, display "Too High" or "Too Low" until the player finds the correct number.', diff: 'fire', points: 20, test: (c) => /Random|Math\.random/.test(c) && /Scanner/.test(c) && /Too (High|Low)/i.test(c) && /(while|for)/.test(c) }
            ]
        },
        javascript: {
            icon: '🟨', name: 'JavaScript',
            challenges: [
                { id: 'js1', title: 'Write a JavaScript program that reverses a string without using reverse().', diff: 'easy', points: 5, test: (c) => !/\.reverse\s*\(/.test(c) && /function|=>/.test(c) && /(split|for|charAt|reduce)/.test(c) },
                { id: 'js2', title: 'Create a function that checks whether a number is prime.', diff: 'easy', points: 5, test: (c) => /function|=>/.test(c) && /(prime|factor|%)/.test(c) && /(for|while|return)/.test(c) },
                { id: 'js3', title: 'Write a program that finds the smallest number in an array.', diff: 'easy', points: 5, test: (c) => /(Math\.min|sort|smallest|min)/i.test(c) && /(function|=>|var|let|const)/.test(c) },
                { id: 'js4', title: 'Create a function that counts how many vowels are in a string.', diff: 'medium', points: 10, test: (c) => /function|=>/.test(c) && /(vowel|[aeiou])/i.test(c) && /(for|match|split|reduce)/.test(c) },
                { id: 'js5', title: 'Write a program that removes duplicate values from an array.', diff: 'medium', points: 10, test: (c) => /function|=>|var|let|const/.test(c) && /(duplicate|filter|indexOf|includes|new Set)/.test(c) },
                { id: 'js6', title: 'Create a digital clock that displays the current time and updates every second.', diff: 'medium', points: 10, test: (c) => /setInterval|setTimeout/.test(c) && /Date|getHours|getMinutes|getSeconds/.test(c) },
                { id: 'js7', title: 'Create a button that changes the background color randomly every time it is clicked.', diff: 'medium', points: 10, test: (c) => /(addEventListener|onclick|click)/.test(c) && /(background|style)/.test(c) && /(Math\.random|random|rgb|hsl|#)/i.test(c) },
                { id: 'js8', title: 'Create a to-do list where users can add, complete, and delete tasks.', diff: 'hard', points: 15, test: (c) => /(addEventListener|onclick|click)/.test(c) && /(createElement|innerHTML|appendChild|append)/.test(c) && /(delete|remove|complete|done|checked)/i.test(c) },
                { id: 'js9', title: 'Create a live character counter for a text input.', diff: 'hard', points: 15, test: (c) => /(addEventListener|oninput|keyup|keydown)/.test(c) && /(length|count|char)/i.test(c) && /(input|textarea)/i.test(c) },
                { id: 'js10', title: '🔥 Create a typing speed test that calculates the user\'s WPM and accuracy.', diff: 'fire', points: 20, test: (c) => /(wpm|words.*per.*minute|speed|typing)/i.test(c) && /(accuracy|correct|wrong|error)/i.test(c) && /(setInterval|setTimeout|Date)/.test(c) }
            ]
        },
        html: {
            icon: '🌐', name: 'HTML',
            challenges: [
                { id: 'ht1', title: 'Create a webpage containing a heading, paragraph, image, and link.', diff: 'easy', points: 5, test: (c) => /<h[1-6]>/i.test(c) && /<p>/i.test(c) && /<img/i.test(c) && /<a\s+href/i.test(c) },
                { id: 'ht2', title: 'Create a personal profile page using semantic HTML elements.', diff: 'easy', points: 5, test: (c) => /<(header|main|section|footer|nav|article|aside)/i.test(c) && /(profile|about|name)/i.test(c) },
                { id: 'ht3', title: 'Create a table displaying student names, ages, and grades.', diff: 'easy', points: 5, test: (c) => /<table/i.test(c) && /<tr/i.test(c) && /<t[dh]/i.test(c) },
                { id: 'ht4', title: 'Create a registration form containing name, email, password, and date of birth.', diff: 'easy', points: 5, test: (c) => /<form/i.test(c) && /<input/i.test(c) && /(email|password|date|name)/i.test(c) },
                { id: 'ht5', title: 'Create a navigation menu using <nav> and an unordered list.', diff: 'medium', points: 10, test: (c) => /<nav/i.test(c) && /<ul/i.test(c) && /<li/i.test(c) },
                { id: 'ht6', title: 'Create a product page containing an image, title, description, price, and button.', diff: 'medium', points: 10, test: (c) => /<img/i.test(c) && /(price|\\$|\$)/i.test(c) && /<button|<input.*submit/i.test(c) },
                { id: 'ht7', title: 'Create a webpage using semantic elements such as <header>, <main>, <section>, <article>, and <footer>.', diff: 'medium', points: 10, test: (c) => /<header/i.test(c) && /<main/i.test(c) && /<section/i.test(c) && /<article/i.test(c) && /<footer/i.test(c) },
                { id: 'ht8', title: 'Create a complete login and registration form with appropriate input types and labels.', diff: 'hard', points: 15, test: (c) => /<form/i.test(c) && /<label/i.test(c) && /(type.*email|type.*password|type.*text)/i.test(c) },
                { id: 'ht9', title: 'Create an FAQ page using HTML elements that allow questions to be expanded and collapsed.', diff: 'hard', points: 15, test: (c) => /<details|<summary|accordion|faq/i.test(c) && /(question|answer|expand|collapse)/i.test(c) },
                { id: 'ht10', title: '🔥 Build the HTML structure for a complete portfolio website with Home, About, Projects, Skills, and Contact sections.', diff: 'fire', points: 20, test: (c) => /(home|about|projects|skills|contact)/i.test(c) && /<nav/i.test(c) && /(section|main)/i.test(c) && (/<h[1-6]>/i.test(c)) }
            ]
        },
        css: {
            icon: '🎨', name: 'CSS',
            challenges: [
                { id: 'cs1', title: 'Create a button with a smooth hover effect.', diff: 'easy', points: 5, test: (c) => /button/i.test(c) && /:hover/.test(c) && /(transition|transform|background)/i.test(c) },
                { id: 'cs2', title: 'Create a card with rounded corners, shadow, and spacing.', diff: 'easy', points: 5, test: (c) => /(border-radius|box-shadow|padding|margin)/i.test(c) && /(card|div|section)/i.test(c) },
                { id: 'cs3', title: 'Center an element perfectly using Flexbox.', diff: 'easy', points: 5, test: (c) => /display\s*:\s*flex/i.test(c) && /(justify-content|align-items|center)/i.test(c) },
                { id: 'cs4', title: 'Create a responsive navigation bar.', diff: 'easy', points: 5, test: (c) => /(nav|navbar|header)/i.test(c) && /(display\s*:\s*flex|flex)/i.test(c) && /(@media|responsive|gap)/i.test(c) },
                { id: 'cs5', title: 'Create a 3-column responsive grid that becomes one column on small screens.', diff: 'medium', points: 10, test: (c) => /(grid|display\s*:\s*grid|grid-template-columns)/i.test(c) && /@media/i.test(c) },
                { id: 'cs6', title: 'Create a CSS loading spinner animation.', diff: 'medium', points: 10, test: (c) => /@keyframes/.test(c) && /(animation|rotate|spin)/i.test(c) && /(border|transform)/i.test(c) },
                { id: 'cs7', title: 'Create a card with a hover animation that slightly moves and scales it.', diff: 'medium', points: 10, test: (c) => /:hover/.test(c) && /(transform|translateY|scale)/i.test(c) && /transition/i.test(c) },
                { id: 'cs8', title: 'Create a responsive login page that works on desktop and mobile.', diff: 'hard', points: 15, test: (c) => /@media/i.test(c) && /(login|form|input)/i.test(c) && /(max-width|min-width|responsive)/i.test(c) },
                { id: 'cs9', title: 'Create a dark/light theme using CSS variables.', diff: 'hard', points: 15, test: (c) => /--[\w-]+\s*:/.test(c) && /var\s*\(--/.test(c) && /(dark|light|theme)/i.test(c) },
                { id: 'cs10', title: '🔥 Build a complete responsive dashboard UI with a sidebar, navbar, cards, buttons, and statistics.', diff: 'fire', points: 20, test: (c) => /(sidebar|navbar|dashboard)/i.test(c) && /@media/i.test(c) && /(grid|flex)/i.test(c) && /(card|stat|button)/i.test(c) }
            ]
        },
        cpp: {
            icon: '⚙️', name: 'C++',
            challenges: [
                { id: 'cp1', title: 'Write a C++ program that checks whether a number is positive, negative, or zero.', diff: 'easy', points: 5, test: (c) => /#include/.test(c) && /(cin|cout|scanf|printf)/.test(c) && /(if|else)/.test(c) },
                { id: 'cp2', title: 'Write a program that calculates the factorial of a number.', diff: 'easy', points: 5, test: (c) => /#include/.test(c) && /(factorial|fact)/i.test(c) && /(for|while|return)/.test(c) },
                { id: 'cp3', title: 'Write a program that finds the largest element in an array.', diff: 'easy', points: 5, test: (c) => /#include/.test(c) && /(array|vector|int\s+\w+\[)/.test(c) && /(max|largest|if)/.test(c) },
                { id: 'cp4', title: 'Write a program that counts the number of even and odd numbers in an array.', diff: 'easy', points: 5, test: (c) => /#include/.test(c) && /(% *2|even|odd)/i.test(c) && /(for|while)/.test(c) },
                { id: 'cp5', title: 'Write a program that reverses an array without using another array.', diff: 'medium', points: 10, test: (c) => /#include/.test(c) && /(reverse|swap|temp)/i.test(c) && /(for|while)/.test(c) },
                { id: 'cp6', title: 'Write a program that checks whether a string is a palindrome.', diff: 'medium', points: 10, test: (c) => /#include/.test(c) && /(string|char)/.test(c) && /(palindrome|reverse|==)/i.test(c) },
                { id: 'cp7', title: 'Write a program that sorts an array using Bubble Sort.', diff: 'medium', points: 10, test: (c) => /#include/.test(c) && /(bubble|sort|swap)/i.test(c) && /(for|while)/.test(c) },
                { id: 'cp8', title: 'Create a simple student management system using structures or classes.', diff: 'hard', points: 15, test: (c) => /#include/.test(c) && /(struct|class)/.test(c) && /(student|name|grade|mark)/i.test(c) },
                { id: 'cp9', title: 'Create a bank account system that allows users to deposit, withdraw, and check their balance.', diff: 'hard', points: 15, test: (c) => /#include/.test(c) && /(deposit|withdraw|balance)/i.test(c) && /(class|struct|void|int|double)/.test(c) },
                { id: 'cp10', title: '🔥 Create a console-based Tic-Tac-Toe game where two players can play against each other.', diff: 'fire', points: 20, test: (c) => /#include/.test(c) && /(tic|tac|toe|board|X|O)/i.test(c) && /(for|while|if|cin|cout)/.test(c) }
            ]
        }
    };

    let currentLang = 'python';
    let solvedChallenges = JSON.parse(localStorage.getItem('arenaSolved')) || [];
    let currentChallenge = null;

    function getLangMaxScore(lang) {
        return arenaData[lang].challenges.reduce((s, c) => s + c.points, 0);
    }

    function getLangScore(lang) {
        return arenaData[lang].challenges
            .filter(c => solvedChallenges.includes(c.id))
            .reduce((s, c) => s + c.points, 0);
    }

    function updateScoreBar() {
        const score = getLangScore(currentLang);
        const max = getLangMaxScore(currentLang);
        arenaScoreNum.textContent = score;
        arenaScoreMax.textContent = max;
        arenaScoreFill.style.width = max > 0 ? ((score / max) * 100) + '%' : '0%';
    }

    function renderChallenges() {
        const data = arenaData[currentLang];
        arenaChallenges.innerHTML = '';

        data.challenges.forEach(ch => {
            const solved = solvedChallenges.includes(ch.id);
            const div = document.createElement('div');
            div.className = 'arena-challenge' + (solved ? ' solved' : '');
            div.innerHTML = `
                <div class="arena-challenge-left">
                    <div class="arena-challenge-title">${ch.title}</div>
                    <div class="arena-challenge-meta">
                        <span class="arena-diff-badge ${DIFF_CLASS[ch.diff]}">${DIFF_LABELS[ch.diff]}</span>
                        <span class="arena-challenge-points">${ch.points} pts</span>
                    </div>
                </div>
                <div class="arena-challenge-right">
                    ${solved ? '<span class="arena-solved-badge"><i class="fas fa-check-circle"></i> Solved</span>' : ''}
                    <button class="arena-solve-btn" data-id="${ch.id}">${solved ? 'Review' : 'Solve'}</button>
                </div>
            `;
            arenaChallenges.appendChild(div);
        });

        arenaChallenges.querySelectorAll('.arena-solve-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const chId = btn.getAttribute('data-id');
                const ch = data.challenges.find(c => c.id === chId);
                if (ch) openEditor(ch);
            });
        });

        updateScoreBar();
    }

    arenaLangTabs.querySelectorAll('.arena-lang-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            arenaLangTabs.querySelectorAll('.arena-lang-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentLang = tab.getAttribute('data-lang');
            renderChallenges();
        });
    });

    function openEditor(ch) {
        currentChallenge = ch;
        editorChallengeTitle.textContent = ch.title;
        editorDifficulty.innerHTML = `<span class="arena-diff-badge ${DIFF_CLASS[ch.diff]}">${DIFF_LABELS[ch.diff]}</span> <span style="font-size:0.75rem;color:var(--text-secondary);">${ch.points} pts</span>`;
        editorDescription.textContent = `Write your ${arenaData[currentLang].name} solution below:`;
        editorOutputText.textContent = 'Write your code and click Run...';
        editorResult.classList.add('hidden');
        editorResult.className = 'editor-result hidden';
        codeEditor.value = '';
        codeEditorModal.classList.remove('hidden');
    }

    closeCodeEditor.addEventListener('click', () => codeEditorModal.classList.add('hidden'));
    codeEditorModal.addEventListener('click', (e) => { if (e.target === codeEditorModal) codeEditorModal.classList.add('hidden'); });

    resetCodeBtn.addEventListener('click', () => {
        codeEditor.value = '';
        editorOutputText.textContent = 'Write your code and click Run...';
        editorResult.classList.add('hidden');
    });

    runCodeBtn.addEventListener('click', () => {
        const code = codeEditor.value.trim();
        if (!code) { editorOutputText.textContent = 'Error: Please write some code first.'; return; }

        editorOutputText.textContent = 'Running...';

        setTimeout(() => {
            try {
                const passed = currentChallenge.test(code);

                if (passed) {
                    if (!solvedChallenges.includes(currentChallenge.id)) {
                        solvedChallenges.push(currentChallenge.id);
                        localStorage.setItem('arenaSolved', JSON.stringify(solvedChallenges));
                    }
                    editorOutputText.textContent = `✓ Test passed! +${currentChallenge.points} points`;
                    editorResult.textContent = '🎉 Solution Correct! Well done!';
                    editorResult.className = 'editor-result success';
                    editorResult.classList.remove('hidden');
                    updateScoreBar();
                    renderChallenges();
                } else {
                    editorOutputText.textContent = '✗ Test failed. Your solution doesn\'t meet the requirements.';
                    editorResult.textContent = '❌ Solution Incorrect. Try again!';
                    editorResult.className = 'editor-result error';
                    editorResult.classList.remove('hidden');
                }
            } catch (err) {
                editorOutputText.textContent = 'Error: ' + err.message;
                editorResult.textContent = '❌ Solution Incorrect. Try again!';
                editorResult.className = 'editor-result error';
                editorResult.classList.remove('hidden');
            }
        }, 500);
    });

    renderChallenges();
});
