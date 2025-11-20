/**
 * INTERACTIVE FEATURES MODULE
 * Advanced interactivity, animations, and kid-friendly features
 * Features: Animations, notifications, rewards, progress tracking, particle effects
 */

// ============================================================================
// 1. PARTICLE EFFECTS & ANIMATIONS
// ============================================================================

const ParticleEffects = {
    /**
     * Confetti burst animation for achievements
     */
    celebrationConfetti: function (x, y) {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const particles = [];

        for (let i = 0; i < 50; i++) {
            particles.push({
                x: x || canvas.width / 2,
                y: y || canvas.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                life: 1,
                color: ['#ff6b6b', '#ffd166', '#6ee7b7', '#4da6ff', '#ff9da0'][Math.floor(Math.random() * 5)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // Gravity
                p.life -= 0.015;
                p.rotation += 5;

                if (p.life > 0) {
                    alive = true;
                    ctx.save();
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.restore();
                }
            });

            if (alive) {
                requestAnimationFrame(animate);
            } else {
                canvas.remove();
            }
        }

        animate();
    },

    /**
     * Star burst animation
     */
    starBurst: function (element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            const star = document.createElement('div');
            star.innerHTML = '⭐';
            star.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
                pointer-events: none;
                z-index: 999;
                animation: starFloat 1s ease-out forwards;
                --delay: ${i * 0.1}s;
            `;
            const angle = (i / 8) * Math.PI * 2;
            star.style.setProperty('--tx', Math.cos(angle) * 100 + 'px');
            star.style.setProperty('--ty', Math.sin(angle) * 100 - 50 + 'px');
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 1000);
        }
    },

    /**
     * Ripple effect on click
     */
    rippleClick: function (event) {
        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    },

    /**
     * Symbol shoot effect - fires symbols/text to the side on touch
     */
    shootSymbol: function (event, symbol = '✨', direction = 'random') {
        const x = event.clientX || event.touches?.[0]?.clientX || window.innerWidth / 2;
        const y = event.clientY || event.touches?.[0]?.clientY || window.innerHeight / 2;

        const shootEl = document.createElement('div');
        shootEl.innerHTML = symbol;
        shootEl.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9998;
            font-size: 2rem;
            font-weight: bold;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Determine shoot direction
        let endX, endY;
        if (direction === 'left') {
            endX = -200;
            endY = (Math.random() - 0.5) * 100;
        } else if (direction === 'right') {
            endX = 200;
            endY = (Math.random() - 0.5) * 100;
        } else if (direction === 'up') {
            endX = (Math.random() - 0.5) * 100;
            endY = -200;
        } else if (direction === 'down') {
            endX = (Math.random() - 0.5) * 100;
            endY = 200;
        } else {
            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const distance = 200;
            endX = Math.cos(angle) * distance;
            endY = Math.sin(angle) * distance;
        }

        document.body.appendChild(shootEl);

        // Animate the shot symbol
        shootEl.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${endX}px, ${endY}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 700,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => shootEl.remove();
    }
};

// ============================================================================
// 2. NOTIFICATION SYSTEM
// ============================================================================

const NotificationSystem = {
    show: function (message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️',
            'achievement': '🏆',
            'star': '⭐'
        };

        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ff6b6b, #ffd166);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                animation: slideInRight 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                font-family: var(--kidfont);
                font-weight: bold;
                max-width: 90%;
            ">
                ${icons[type] || '📢'} ${message}
            </div>
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
            setTimeout(() => notification.remove(), 500);
        }, duration);
    },

    showAchievement: function (title, description, icon = '🏆') {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #6ee7b7, #4da6ff);
                padding: 30px;
                border-radius: 24px;
                text-align: center;
                z-index: 10001;
                animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                color: white;
                font-family: var(--kidfont);
            ">
                <div style="font-size: 4rem; margin-bottom: 15px; animation: bounce 0.6s infinite;">${icon}</div>
                <h2 style="margin: 0 0 10px 0; font-size: 1.8rem;">🎉 ${title}</h2>
                <p style="margin: 0; font-size: 1.1rem;">${description}</p>
            </div>
        `;
        document.body.appendChild(modal);
        ParticleEffects.celebrationConfetti();
        setTimeout(() => {
            modal.style.animation = 'popOut 0.6s ease-out forwards';
            setTimeout(() => modal.remove(), 600);
        }, 3000);
    }
};

// ============================================================================
// 3. PROGRESS VISUALIZATION
// ============================================================================

const ProgressVisualization = {
    /**
     * Create animated progress bar
     */
    createProgressBar: function (container, current, max, label = '') {
        const wrapper = document.createElement('div');
        const percentage = (current / max) * 100;

        wrapper.innerHTML = `
            <div style="margin-bottom: 8px;">
                <span style="font-weight: bold; color: #333;">${label}</span>
                <span style="float: right; color: #666;">${current}/${max}</span>
            </div>
            <div style="
                width: 100%;
                height: 24px;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                overflow: hidden;
                border: 2px solid #ffd166;
            ">
                <div style="
                    width: 0%;
                    height: 100%;
                    background: linear-gradient(90deg, #ff6b6b, #ffd166);
                    animation: slideIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    font-size: 0.8rem;
                    --width: ${percentage};
                "></div>
            </div>
        `;

        container.appendChild(wrapper);
        const progressDiv = wrapper.querySelector('div > div > div');
        progressDiv.style.width = percentage + '%';

        return wrapper;
    },

    /**
     * Create stats dashboard
     */
    createStatsDashboard: function (stats) {
        const dashboard = document.createElement('div');
        dashboard.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 12px;
            margin: 16px 0;
        `;

        const statIcons = {
            'stars': '⭐',
            'chapters': '📖',
            'score': '🎯',
            'streak': '🔥',
            'achievements': '🏆',
            'time': '⏱️',
            'badges': '🎖️',
            'level': '📈'
        };

        Object.entries(stats).forEach(([key, value]) => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 209, 102, 0.1));
                padding: 16px;
                border-radius: 12px;
                text-align: center;
                border: 2px solid #ffd166;
                transition: all 0.3s;
            `;

            card.innerHTML = `
                <div style="font-size: 2rem; margin-bottom: 8px;">${statIcons[key] || '📊'}</div>
                <div style="font-weight: bold; color: #333;">${value}</div>
                <div style="font-size: 0.8rem; color: #666; text-transform: capitalize; margin-top: 4px;">${key}</div>
            `;

            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-8px) scale(1.05)';
                this.style.boxShadow = '0 10px 25px rgba(255, 107, 107, 0.2)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = 'none';
            });

            dashboard.appendChild(card);
        });

        return dashboard;
    }
};

// ============================================================================
// 4. INTERACTIVE GAME ENHANCEMENTS
// ============================================================================

const GameEnhancements = {
    /**
     * Enhanced tile click with feedback
     */
    createInteractiveTile: function (data) {
        const tile = document.createElement('div');
        tile.className = 'interactive-tile';
        tile.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(110, 231, 183, 0.1));
            border: 3px solid #ffd166;
            border-radius: 16px;
            padding: 16px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
            overflow: hidden;
        `;

        tile.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 8px; animation: bounce 1s infinite;">${data.emoji}</div>
            <div style="font-weight: bold; color: #333; margin-bottom: 4px;">${data.title}</div>
            <div style="font-size: 0.85rem; color: #666;">${data.subtitle || ''}</div>
            ${data.badge ? `<div style="
                position: absolute;
                top: 8px;
                right: 8px;
                background: #ffd166;
                color: #333;
                padding: 4px 8px;
                border-radius: 8px;
                font-size: 0.7rem;
                font-weight: bold;
            ">${data.badge}</div>` : ''}
        `;

        // Add interaction effects
        tile.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-12px) scale(1.08)';
            this.style.boxShadow = '0 15px 35px rgba(255, 107, 107, 0.25)';
        });

        tile.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });

        tile.addEventListener('click', function (e) {
            ParticleEffects.rippleClick(e);
            ParticleEffects.starBurst(this);
            if (data.onClick) data.onClick();
        });

        return tile;
    },

    /**
     * Create spinning reward wheel
     */
    createRewardWheel: function (rewards) {
        const container = document.createElement('div');
        const wheelSize = 200;

        container.innerHTML = `
            <div style="
                width: ${wheelSize}px;
                height: ${wheelSize}px;
                margin: 20px auto;
                position: relative;
                animation: spinWheel 20s linear infinite;
            ">
                <svg width="${wheelSize}" height="${wheelSize}" viewBox="0 0 200 200" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                ">
                    ${rewards.map((reward, i) => {
            const angle = (360 / rewards.length) * i;
            const color = ['#ff6b6b', '#ffd166', '#6ee7b7', '#4da6ff'][i % 4];
            return `
                            <circle cx="100" cy="100" r="80" fill="none" stroke="${color}" stroke-width="40"
                                stroke-dasharray="${Math.PI * 160 / rewards.length}, ${Math.PI * 160}"
                                transform="rotate(${angle} 100 100)" opacity="0.7" />
                            <text x="100" y="100" text-anchor="middle" dy=".3em" font-size="20"
                                transform="rotate(${angle + 18} 100 100) translate(60, 0)"
                                style="pointer-events: none;">
                                ${reward.emoji}
                            </text>
                        `;
        }).join('')}
                </svg>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button onclick="this.parentElement.parentElement.style.animationPlayState = 
                    this.parentElement.parentElement.style.animationPlayState === 'paused' ? 'running' : 'paused'"
                    style="
                        padding: 10px 20px;
                        background: linear-gradient(90deg, #ff6b6b, #ffd166);
                        border: none;
                        border-radius: 12px;
                        color: white;
                        font-weight: bold;
                        cursor: pointer;
                        font-family: var(--kidfont);
                    ">
                    Spin for Rewards! 🎡
                </button>
            </div>
        `;

        return container;
    }
};

// ============================================================================
// 5. LEARNING BADGES & ACHIEVEMENTS
// ============================================================================

const AchievementDisplay = {
    badges: {
        'first_star': { icon: '⭐', title: 'First Star', description: 'Earn your first star' },
        'ten_stars': { icon: '✨', title: 'Rising Star', description: 'Earn 10 stars' },
        'speed_demon': { icon: '⚡', title: 'Speed Demon', description: 'Complete 3 lessons in 5 minutes' },
        'perfect_score': { icon: '💯', title: 'Perfect Score', description: 'Score 100% on any lesson' },
        'streak_7': { icon: '🔥', title: '7-Day Streak', description: 'Study 7 days in a row' },
        'helper': { icon: '🤝', title: 'Helper', description: 'Help a friend learn' },
        'explorer': { icon: '🗺️', title: 'Explorer', description: 'Complete all chapters' },
        'champion': { icon: '🏆', title: 'Champion', description: 'Become the top learner' },
        'word_master': { icon: '📚', title: 'Word Master', description: 'Learn 100 words' },
        'math_genius': { icon: '🧮', title: 'Math Genius', description: 'Solve 50 math problems' }
    },

    displayBadge: function (badgeKey, x, y) {
        const badge = this.badges[badgeKey];
        if (!badge) return;

        const modal = document.createElement('div');
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: ${y || '50%'};
                left: ${x || '50%'};
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ffd166, #ff6b6b);
                padding: 40px;
                border-radius: 24px;
                text-align: center;
                z-index: 10002;
                animation: popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
                color: white;
                font-family: var(--kidfont);
                border: 4px solid #ffd166;
            ">
                <div style="font-size: 5rem; margin-bottom: 15px; animation: bounce 0.8s ease-in-out infinite;">
                    ${badge.icon}
                </div>
                <h2 style="margin: 10px 0; font-size: 2rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                    ${badge.title}
                </h2>
                <p style="margin: 0; font-size: 1.1rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
                    🌟 ${badge.description}
                </p>
            </div>
        `;

        document.body.appendChild(modal);
        ParticleEffects.celebrationConfetti();

        setTimeout(() => {
            modal.style.animation = 'popOut 0.6s ease-out forwards';
            setTimeout(() => modal.remove(), 600);
        }, 4000);
    },

    createBadgeCollection: function () {
        const collection = document.createElement('div');
        collection.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 12px;
            margin: 16px 0;
        `;

        Object.entries(this.badges).forEach(([key, badge]) => {
            const badgeEl = document.createElement('div');
            badgeEl.style.cssText = `
                background: linear-gradient(135deg, rgba(255, 209, 102, 0.2), rgba(255, 107, 107, 0.1));
                padding: 12px;
                border-radius: 12px;
                text-align: center;
                border: 2px solid #ffd166;
                cursor: pointer;
                transition: all 0.3s;
                opacity: 0.6;
            `;

            badgeEl.innerHTML = `
                <div style="font-size: 2.5rem;">${badge.icon}</div>
                <div style="font-size: 0.75rem; font-weight: bold; margin-top: 4px; color: #333;">
                    ${badge.title}
                </div>
            `;

            badgeEl.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.1)';
                this.style.opacity = '1';
            });

            badgeEl.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
                this.style.opacity = '0.6';
            });

            badgeEl.addEventListener('click', () => {
                AchievementDisplay.displayBadge(key);
            });

            collection.appendChild(badgeEl);
        });

        return collection;
    }
};

// ============================================================================
// 6. RESPONSIVE ANIMATIONS & STYLES
// ============================================================================

const ResponsiveAnimations = {
    /**
     * Create CSS animations dynamically
     */
    injectAnimations: function () {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(40px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes slideOutRight {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(40px);
                }
            }

            @keyframes popIn {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5);
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.1);
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            @keyframes popOut {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.5);
                }
            }

            @keyframes starFloat {
                0% {
                    opacity: 1;
                    transform: translate(0, 0) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translate(var(--tx), var(--ty)) scale(0);
                }
            }

            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            @keyframes bounce {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-10px);
                }
            }

            @keyframes spinWheel {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }

            @keyframes slideIn {
                from {
                    width: 0%;
                }
                to {
                    width: var(--width);
                }
            }

            .interactive-tile:active {
                transform: scale(0.95) !important;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .interactive-tile {
                    padding: 12px;
                }
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .interactive-tile {
                    background: linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(110, 231, 183, 0.2));
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// ============================================================================
// 7. TOUCH/CLICK ELEMENT ENHANCEMENTS
// ============================================================================

const ElementEnhancer = {
    /**
     * Auto-attach shoot effects to learning elements
     */
    enhanceClickableElements: function () {
        // Configuration for different element types
        const elementConfigs = {
            'span[onclick*="emoji"]': { symbol: '✨', direction: 'random' },
            '.tile': { symbol: '⭐', direction: 'random' },
            'button[onclick*="onclick"]': { symbol: '💫', direction: 'random' },
            'div[onclick*="onclick"]': { symbol: '🌟', direction: 'random' }
        };

        // Enhanced counting game items - shoot numbers/symbols
        document.addEventListener('click', function (e) {
            const target = e.target;

            // Check if it's a counting game item (emoji)
            if (target.style.fontSize === '3rem' || (target.innerHTML && /^[\s\S]*[🍎🌟🐕🎈🐠🎁][\s\S]*$/.test(target.innerHTML))) {
                ParticleEffects.shootSymbol(e, target.innerHTML, 'random');
                ParticleEffects.rippleClick(e);
                return;
            }

            // Check for button clicks in games
            if (target.tagName === 'BUTTON' && target.classList.contains('tile')) {
                ParticleEffects.shootSymbol(e, '⭐', 'random');
            }
        }, true);

        // Add touch events for mobile
        document.addEventListener('touchend', function (e) {
            if (e.target.style.fontSize === '3rem') {
                const touch = e.changedTouches[0];
                const clickEvent = new MouseEvent('click', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
                e.target.dispatchEvent(clickEvent);
            }
        }, true);

        console.log('✅ Element Enhancement Active');
    },

    /**
     * Add symbol effects to custom elements
     */
    attachToElement: function (element, symbol = '✨', direction = 'random') {
        if (!element) return;

        element.addEventListener('click', function (e) {
            ParticleEffects.shootSymbol(e, symbol, direction);
        });

        element.addEventListener('touchend', function (e) {
            const touch = e.changedTouches[0];
            const clickEvent = new MouseEvent('click', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.dispatchEvent(clickEvent);
        });
    }
};

// ============================================================================
// 7. INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
    ResponsiveAnimations.injectAnimations();
    ElementEnhancer.enhanceClickableElements();
    console.log('✅ Interactive Features Module Loaded');
});

// Export to window for global access
window.ParticleEffects = ParticleEffects;
window.NotificationSystem = NotificationSystem;
window.ProgressVisualization = ProgressVisualization;
window.GameEnhancements = GameEnhancements;
window.AchievementDisplay = AchievementDisplay;
window.ResponsiveAnimations = ResponsiveAnimations;
window.ElementEnhancer = ElementEnhancer;

console.log('✨ All Interactive Systems Ready!');
