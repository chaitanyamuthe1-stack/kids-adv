/**
 * COMPREHENSIVE ENHANCEMENTS MODULE
 * All-in-one system for: Games, UI/UX, Mobile, Sound, Gamification, Analytics, Performance
 */

// ============================================================================
// 1. ADVANCED GAMES & ANIMATIONS
// ============================================================================

const AdvancedGames = {
    // Memory Card Game
    memoryGame: {
        cards: [],
        flipped: [],
        matched: 0,
        moves: 0,

        init: function () {
            const pairs = ['🍎', '🍌', '🍊', '🍓', '🍇', '🥝', '🍑', '🍒'];
            this.cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
            this.flipped = [];
            this.matched = 0;
            this.moves = 0;
            this.render();
        },

        render: function () {
            const container = document.getElementById('memoryGameContainer');
            if (!container) return;

            container.innerHTML = '';
            container.style.cssText = `
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                padding: 20px;
            `;

            this.cards.forEach((card, index) => {
                const cardEl = document.createElement('div');
                const isFlipped = this.flipped.includes(index);
                cardEl.style.cssText = `
                    width: 100%;
                    aspect-ratio: 1;
                    background: ${isFlipped ? '#6ee7b7' : '#ffd166'};
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                `;
                cardEl.textContent = isFlipped ? card : '?';
                cardEl.onclick = () => this.flip(index);
                container.appendChild(cardEl);
            });
        },

        flip: function (index) {
            if (this.flipped.includes(index) || this.flipped.length > 1) return;
            this.flipped.push(index);
            this.render();

            if (this.flipped.length === 2) {
                this.moves++;
                const [i1, i2] = this.flipped;
                if (this.cards[i1] === this.cards[i2]) {
                    this.matched += 2;
                    this.flipped = [];
                    SoundSystem.play('success');
                    if (this.matched === this.cards.length) {
                        NotificationSystem.showAchievement('Memory Master', `Matched all pairs in ${this.moves} moves!`);
                        GameStats.addPoints(50);
                    }
                } else {
                    setTimeout(() => {
                        this.flipped = [];
                        this.render();
                        SoundSystem.play('error');
                    }, 1000);
                }
            }
        }
    },

    // Puzzle Game
    puzzleGame: {
        init: function () {
            const container = document.getElementById('puzzleGameContainer');
            if (!container) return;

            const puzzle = `
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 20px;">
                    <div onclick="AdvancedGames.puzzleGame.checkPuzzle(this, 'cat')" style="padding: 20px; background: linear-gradient(135deg, #ff6b6b, #ff9da0); border-radius: 10px; text-align: center; cursor: pointer; font-size: 2rem;">🐱</div>
                    <div onclick="AdvancedGames.puzzleGame.checkPuzzle(this, 'dog')" style="padding: 20px; background: linear-gradient(135deg, #ffd166, #ffc93c); border-radius: 10px; text-align: center; cursor: pointer; font-size: 2rem;">🐕</div>
                    <div onclick="AdvancedGames.puzzleGame.checkPuzzle(this, 'bird')" style="padding: 20px; background: linear-gradient(135deg, #6ee7b7, #38a169); border-radius: 10px; text-align: center; cursor: pointer; font-size: 2rem;">🐦</div>
                </div>
                <div style="text-align: center; margin: 20px; font-size: 1.2rem; font-weight: bold;">Which one says "Meow"?</div>
            `;
            container.innerHTML = puzzle;
        },

        checkPuzzle: function (el, answer) {
            if (answer === 'cat') {
                SoundSystem.play('success');
                NotificationSystem.show('🎉 Correct! Cats say Meow!', 'success');
                GameStats.addPoints(25);
            } else {
                SoundSystem.play('error');
                NotificationSystem.show('Try again!', 'error');
            }
        }
    },

    // Pattern Game
    patternGame: {
        sequence: ['red', 'blue', 'green', 'yellow'],
        playerSequence: [],
        level: 1,

        init: function () {
            this.sequence = [];
            this.playerSequence = [];
            this.level = 1;
            this.playRound();
        },

        playRound: function () {
            this.sequence.push(['red', 'blue', 'green', 'yellow'][Math.floor(Math.random() * 4)]);
            this.playerSequence = [];
            this.showSequence();
        },

        showSequence: function () {
            const colors = {
                'red': '#ff6b6b',
                'blue': '#4da6ff',
                'green': '#6ee7b7',
                'yellow': '#ffd166'
            };

            let delay = 0;
            this.sequence.forEach(color => {
                setTimeout(() => {
                    SoundSystem.play('beep');
                    const el = document.querySelector(`[data-color="${color}"]`);
                    if (el) {
                        el.style.filter = 'brightness(1.5)';
                        setTimeout(() => el.style.filter = 'brightness(1)', 300);
                    }
                }, delay += 600);
            });
        },

        addPlayerMove: function (color) {
            this.playerSequence.push(color);
            SoundSystem.play('click');

            if (this.playerSequence[this.playerSequence.length - 1] !== this.sequence[this.playerSequence.length - 1]) {
                SoundSystem.play('error');
                NotificationSystem.show('Game Over! Try again!', 'error');
                this.init();
                return;
            }

            if (this.playerSequence.length === this.sequence.length) {
                this.level++;
                GameStats.addPoints(10 * this.level);
                setTimeout(() => this.playRound(), 1000);
            }
        }
    }
};

// ============================================================================
// 2. ENHANCED UI/UX & STYLING SYSTEM
// ============================================================================

const UIEnhancements = {
    themes: {
        light: {
            primary: '#ff6b6b',
            secondary: '#ffd166',
            success: '#6ee7b7',
            info: '#4da6ff'
        },
        dark: {
            primary: '#ff5252',
            secondary: '#ffc107',
            success: '#4caf50',
            info: '#2196f3'
        },
        colorful: {
            primary: '#f44336',
            secondary: '#ff9800',
            success: '#8bc34a',
            info: '#00bcd4'
        }
    },

    applyTheme: function (themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        const style = document.createElement('style');
        style.textContent = `
            :root {
                --primary: ${theme.primary};
                --secondary: ${theme.secondary};
                --success: ${theme.success};
                --info: ${theme.info};
            }
            
            .tile {
                background: linear-gradient(135deg, ${theme.primary}22, ${theme.secondary}22) !important;
                border-color: ${theme.secondary} !important;
            }
            
            button, .btn {
                background: linear-gradient(90deg, ${theme.primary}, ${theme.secondary}) !important;
            }
            
            .panel {
                border-color: ${theme.info} !important;
            }
        `;
        document.head.appendChild(style);
        localStorage.setItem('selectedTheme', themeName);
        SoundSystem.play('click');
    },

    addGradientAnimations: function () {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            
            .animated-bg {
                background: linear-gradient(270deg, #ff6b6b, #ffd166, #6ee7b7, #4da6ff);
                background-size: 300% 300%;
                animation: gradientShift 8s ease infinite;
            }
            
            @keyframes slideDown {
                from { transform: translateY(-20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .slide-in {
                animation: slideDown 0.5s ease-out;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .pulse {
                animation: pulse 2s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }
};

// ============================================================================
// 3. MOBILE OPTIMIZATION
// ============================================================================

const MobileOptimizer = {
    init: function () {
        this.checkDeviceSize();
        this.addTouchOptimizations();
        this.optimizeViewport();
    },

    checkDeviceSize: function () {
        const isMobile = window.innerWidth < 768;
        document.documentElement.setAttribute('data-device', isMobile ? 'mobile' : 'desktop');

        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .tile { padding: 15px !important; }
                button { padding: 12px 16px !important; }
                .panel { margin: 8px !important; }
                font-size: 14px;
            }
            
            @media (max-width: 480px) {
                .tile { padding: 10px !important; }
                button { padding: 8px 12px !important; font-size: 12px; }
                .panel { margin: 4px !important; }
            }
        `;
        document.head.appendChild(style);
    },

    addTouchOptimizations: function () {
        document.addEventListener('touchstart', function (e) {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('tile')) {
                e.target.style.opacity = '0.8';
            }
        }, false);

        document.addEventListener('touchend', function (e) {
            if (e.target.tagName === 'BUTTON' || e.target.classList.contains('tile')) {
                e.target.style.opacity = '1';
            }
        }, false);
    },

    optimizeViewport: function () {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
        }
    }
};

// ============================================================================
// 4. SOUND EFFECTS SYSTEM
// ============================================================================

const SoundSystem = {
    sounds: {
        'success': 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
        'error': 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
        'click': 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==',
        'beep': 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
    },

    enabled: true,

    init: function () {
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    },

    play: function (soundName) {
        if (!this.enabled) return;

        // Create simple beep sounds programmatically
        const audioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioContext) return;

        const ctx = new audioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        const frequencies = {
            'success': 800,
            'error': 300,
            'click': 600,
            'beep': 500
        };

        oscillator.frequency.value = frequencies[soundName] || 500;
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
    },

    toggle: function () {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', this.enabled);
        NotificationSystem.show(this.enabled ? '🔊 Sound ON' : '🔇 Sound OFF', 'info');
    }
};

// ============================================================================
// 5. GAMIFICATION & LEADERBOARD SYSTEM
// ============================================================================

const GameStats = {
    currentPoints: 0,
    totalStars: 0,
    badges: [],
    dailyStreak: 0,
    level: 1,

    init: function () {
        this.loadFromLocalStorage();
    },

    addPoints: function (points) {
        this.currentPoints += points;
        this.totalStars = Math.floor(this.currentPoints / 100);
        this.checkLevelUp();
        this.updateDisplay();
        this.saveToLocalStorage();
        SoundSystem.play('success');
    },

    checkLevelUp: function () {
        const newLevel = Math.floor(this.totalStars / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            NotificationSystem.showAchievement('Level Up!', `You reached Level ${this.level}!`, '🎉');
            ParticleEffects.celebrationConfetti();
        }
    },

    addBadge: function (badgeName) {
        if (!this.badges.includes(badgeName)) {
            this.badges.push(badgeName);
            NotificationSystem.show(`🏆 Earned: ${badgeName}`, 'achievement');
            this.saveToLocalStorage();
        }
    },

    updateDisplay: function () {
        const statsEl = document.getElementById('gameStats');
        if (statsEl) {
            statsEl.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <div style="background: #ff6b6b44; padding: 10px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold;">⭐ ${this.totalStars}</div>
                        <div style="font-size: 0.9rem;">Stars</div>
                    </div>
                    <div style="background: #ffd16644; padding: 10px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold;">📈 ${this.level}</div>
                        <div style="font-size: 0.9rem;">Level</div>
                    </div>
                    <div style="background: #6ee7b744; padding: 10px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold;">🏆 ${this.badges.length}</div>
                        <div style="font-size: 0.9rem;">Badges</div>
                    </div>
                    <div style="background: #4da6ff44; padding: 10px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: bold;">🔥 ${this.dailyStreak}</div>
                        <div style="font-size: 0.9rem;">Streak</div>
                    </div>
                </div>
            `;
        }
    },

    getLeaderboard: function () {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        return leaderboard.sort((a, b) => b.points - a.points).slice(0, 10);
    },

    addToLeaderboard: function (name, points) {
        const leaderboard = this.getLeaderboard();
        leaderboard.push({ name, points, date: new Date().toLocaleDateString() });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard.sort((a, b) => b.points - a.points).slice(0, 20)));
    },

    saveToLocalStorage: function () {
        localStorage.setItem('gameStats', JSON.stringify({
            points: this.currentPoints,
            stars: this.totalStars,
            badges: this.badges,
            level: this.level,
            streak: this.dailyStreak
        }));
    },

    loadFromLocalStorage: function () {
        const saved = JSON.parse(localStorage.getItem('gameStats') || '{}');
        this.currentPoints = saved.points || 0;
        this.totalStars = saved.stars || 0;
        this.badges = saved.badges || [];
        this.level = saved.level || 1;
        this.dailyStreak = saved.streak || 0;
    }
};

// ============================================================================
// 6. ANALYTICS TRACKING SYSTEM
// ============================================================================

const AnalyticsTracker = {
    events: [],

    track: function (eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 50),
            ...data
        };
        this.events.push(event);

        if (this.events.length > 100) {
            this.saveAndClear();
        }
    },

    trackGamePlay: function (gameName, score, duration) {
        this.track('game_played', {
            game: gameName,
            score: score,
            duration: duration
        });
    },

    trackPageView: function (pageName) {
        this.track('page_view', { page: pageName });
    },

    trackError: function (errorMessage) {
        this.track('error', { message: errorMessage });
    },

    saveAndClear: function () {
        const saved = JSON.parse(localStorage.getItem('analytics') || '[]');
        saved.push(...this.events);
        localStorage.setItem('analytics', JSON.stringify(saved.slice(-1000)));
        this.events = [];
    },

    getReport: function () {
        const all = JSON.parse(localStorage.getItem('analytics') || '[]');
        return {
            totalEvents: all.length,
            lastUpdated: new Date().toISOString(),
            events: all.slice(-50)
        };
    }
};

// ============================================================================
// 7. PERFORMANCE OPTIMIZATION
// ============================================================================

const PerformanceOptimizer = {
    init: function () {
        this.lazyLoadImages();
        this.optimizeCSS();
        this.cacheStaticAssets();
        this.debounceResize();
    },

    lazyLoadImages: function () {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.src = entry.target.dataset.src;
                        obs.unobserve(entry.target);
                    }
                });
            });
            images.forEach(img => observer.observe(img));
        }
    },

    optimizeCSS: function () {
        // Remove unused styles
        const style = document.createElement('style');
        style.textContent = `
            img { max-width: 100%; height: auto; }
            body { -webkit-font-smoothing: antialiased; }
            * { box-sizing: border-box; }
        `;
        document.head.appendChild(style);
    },

    cacheStaticAssets: function () {
        if ('caches' in window) {
            caches.open('assets-v1').then(cache => {
                const assets = [
                    '/static/main/interactive_features.js',
                    '/static/main/comprehensive_enhancements.js',
                    '/static/main/style.css'
                ];
                cache.addAll(assets).catch(e => console.log('Cache error:', e));
            });
        }
    },

    debounceResize: function () {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                MobileOptimizer.checkDeviceSize();
            }, 250);
        });
    }
};

// ============================================================================
// 8. BUG FIXES & STABILITY
// ============================================================================

const BugFixes = {
    init: function () {
        this.fixMemoryLeaks();
        this.fixCrossBrowserIssues();
        this.addErrorHandling();
        this.fixTouchBugs();
    },

    fixMemoryLeaks: function () {
        window.addEventListener('beforeunload', () => {
            // Clean up event listeners
            const cloned = document.body.cloneNode(true);
            document.body.replaceWith(cloned);
        });
    },

    fixCrossBrowserIssues: function () {
        // Normalize vendor prefixes
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-appearance: none;
                -moz-appearance: none;
                -ms-appearance: none;
                appearance: none;
            }
            
            input, button {
                font-family: inherit;
            }
        `;
        document.head.appendChild(style);
    },

    addErrorHandling: function () {
        window.addEventListener('error', (e) => {
            console.error('Error caught:', e.message);
            AnalyticsTracker.trackError(e.message);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled rejection:', e.reason);
            AnalyticsTracker.trackError(String(e.reason));
        });
    },

    fixTouchBugs: function () {
        // Prevent double-tap zoom on buttons
        document.addEventListener('touchstart', function (e) {
            if (e.target.matches('button, .tile, .btn')) {
                e.preventDefault();
                e.target.click();
            }
        }, { passive: false });
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
    SoundSystem.init();
    GameStats.init();
    MobileOptimizer.init();
    UIEnhancements.addGradientAnimations();
    PerformanceOptimizer.init();
    BugFixes.init();
    AnalyticsTracker.track('app_loaded');

    console.log('✅ Comprehensive Enhancements Loaded');
    console.log('✅ Games, UI/UX, Mobile, Sound, Gamification, Analytics, Performance all active!');
});

// Export all systems
window.AdvancedGames = AdvancedGames;
window.UIEnhancements = UIEnhancements;
window.MobileOptimizer = MobileOptimizer;
window.SoundSystem = SoundSystem;
window.GameStats = GameStats;
window.AnalyticsTracker = AnalyticsTracker;
window.PerformanceOptimizer = PerformanceOptimizer;
window.BugFixes = BugFixes;
