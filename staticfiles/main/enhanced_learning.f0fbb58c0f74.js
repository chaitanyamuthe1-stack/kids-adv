/**
 * ENHANCED LEARNING MODULE
 * Comprehensive improvements for student engagement and pronunciation learning
 * Features: Better lesson structure, pronunciation tracking, achievements, creative elements
 */

// ============================================================================
// 1. ENHANCED PRONUNCIATION LEARNING SYSTEM
// ============================================================================

const PronunciationModule = {
    /**
     * Comprehensive pronunciation guide for all learning items
     * Each item includes: audio, visual, practice tips, difficulty
     */
    database: {
        alphabet: {
            'A': { word: 'Apple', hint: 'Say like "AYY"', examples: ['Ant', 'Angel', 'Apple'] },
            'B': { word: 'Ball', hint: 'Say like "BEE"', examples: ['Ball', 'Book', 'Baby'] },
            'C': { word: 'Cat', hint: 'Say like "SEE"', examples: ['Cat', 'Car', 'Cup'] },
            'D': { word: 'Dog', hint: 'Say like "DEE"', examples: ['Dog', 'Duck', 'Door'] },
            'E': { word: 'Elephant', hint: 'Say like "EHH"', examples: ['Egg', 'Elf', 'Elephant'] },
            'F': { word: 'Fish', hint: 'Say like "EFF"', examples: ['Fish', 'Fox', 'Flag'] },
            'G': { word: 'Giraffe', hint: 'Say like "JEE"', examples: ['Giraffe', 'Girl', 'Game'] },
            'H': { word: 'Hat', hint: 'Say like "AYCH"', examples: ['Hat', 'House', 'Happy'] },
            'I': { word: 'Ice cream', hint: 'Say like "EYE"', examples: ['Ice', 'Igloo', 'Insect'] },
            'J': { word: 'Jellyfish', hint: 'Say like "JAY"', examples: ['Jellyfish', 'Jump', 'Jar'] },
            'K': { word: 'Kite', hint: 'Say like "KAY"', examples: ['Kite', 'King', 'Kick'] },
            'L': { word: 'Lion', hint: 'Say like "ELL"', examples: ['Lion', 'Lemon', 'Lamp'] },
            'M': { word: 'Monkey', hint: 'Say like "EMM"', examples: ['Monkey', 'Moon', 'Milk'] },
            'N': { word: 'Nest', hint: 'Say like "ENN"', examples: ['Nest', 'Nose', 'Necklace'] },
            'O': { word: 'Orange', hint: 'Say like "OH"', examples: ['Orange', 'Otter', 'Octopus'] },
            'P': { word: 'Pig', hint: 'Say like "PEE"', examples: ['Pig', 'Penguin', 'Pizza'] },
            'Q': { word: 'Queen', hint: 'Say like "KYOO"', examples: ['Queen', 'Quilt', 'Question'] },
            'R': { word: 'Rabbit', hint: 'Say like "AHR"', examples: ['Rabbit', 'Rainbow', 'Robot'] },
            'S': { word: 'Sun', hint: 'Say like "ESS"', examples: ['Sun', 'Snake', 'Star'] },
            'T': { word: 'Tiger', hint: 'Say like "TEE"', examples: ['Tiger', 'Turtle', 'Train'] },
            'U': { word: 'Umbrella', hint: 'Say like "OOO"', examples: ['Umbrella', 'Up', 'Universe'] },
            'V': { word: 'Violin', hint: 'Say like "VEE"', examples: ['Violin', 'Van', 'Vampire'] },
            'W': { word: 'Watch', hint: 'Say like "DOUBLE-YOO"', examples: ['Watch', 'Wolf', 'Water'] },
            'X': { word: 'Xylophone', hint: 'Say like "ZEX"', examples: ['Xylophone', 'X-ray', 'Xmas'] },
            'Y': { word: 'Yo-yo', hint: 'Say like "WHY"', examples: ['Yo-yo', 'Yak', 'Yarn'] },
            'Z': { word: 'Zebra', hint: 'Say like "ZEE"', examples: ['Zebra', 'Zipper', 'Zoo'] }
        },
        numbers: {
            '1': { word: 'One', hint: 'Single item', examples: ['One apple', 'One cat'] },
            '2': { word: 'Two', hint: 'A pair', examples: ['Two birds', 'Two shoes'] },
            '3': { word: 'Three', hint: 'Triangle has 3 sides', examples: ['Three flowers', 'Three stars'] },
            '4': { word: 'Four', hint: 'Square has 4 sides', examples: ['Four wheels', 'Four legs'] },
            '5': { word: 'Five', hint: 'One hand', examples: ['Five fingers', 'Five colors'] },
            '6': { word: 'Six', hint: 'Hexagon has 6 sides', examples: ['Six legs (insect)', 'Six dots'] },
            '7': { word: 'Seven', hint: 'Days in a week', examples: ['Seven days', 'Seven colors in rainbow'] },
            '8': { word: 'Eight', hint: 'Octopus has 8 arms', examples: ['Eight legs (spider)', 'Eight sides'] },
            '9': { word: 'Nine', hint: 'Before ten', examples: ['Nine planets', 'Nine dots'] },
            '10': { word: 'Ten', hint: 'Complete set', examples: ['Ten fingers', 'Ten toes'] }
        }
    },

    /**
     * Play pronunciation with visual and audio feedback
     */
    playPronunciation: function (item, category = 'alphabet') {
        const data = this.database[category]?.[item];
        if (!data) return;

        // Visual feedback
        const element = event?.target || document.querySelector(`[data-item="${item}"]`);
        if (element) {
            element.classList.add('pronunciation-active');
            setTimeout(() => element.classList.remove('pronunciation-active'), 500);
        }

        // Text-to-speech with pitch and rate
        const text = `${item}. ${data.word}. ${data.hint}`;
        this.speak(text);

        // Log pronunciation practice
        this.logPractice(item, category);
    },

    /**
     * Speak text using Web Speech API with voice settings
     */
    speak: function (text, rate = 0.8, pitch = 1.0) {
        try {
            if (!window.speechSynthesis) {
                console.warn('Speech Synthesis not supported');
                return;
            }

            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = rate;
            utterance.pitch = pitch;
            utterance.volume = 1.0;

            // Get voice based on gender
            const voiceGender = window.currentUser?.voiceGender || 'boy';
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                utterance.voice = voices[voiceGender === 'girl' ? 1 : 0] || voices[0];
            }

            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn('Speech error:', e);
        }
    },

    /**
     * Log pronunciation practice for progress tracking
     */
    logPractice: function (item, category) {
        if (!window.currentUser) return;

        fetch('/main/api/pronunciation/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: window.currentUser.username,
                item: `${category}:${item}`,
                proficiency_level: 1
            })
        }).catch(e => console.warn('Pronunciation log error:', e));
    }
};

// ============================================================================
// 2. ENHANCED LESSON STRUCTURE & PROGRESS TRACKING
// ============================================================================

const LessonStructure = {
    lessons: {
        alphabet: {
            title: '🔤 Alphabet Adventure',
            description: 'Learn letters A-Z with fun words and pronunciations',
            difficulty: 1,
            modules: [
                { id: 'uppercase', name: 'Uppercase Letters', icon: '📝' },
                { id: 'lowercase', name: 'Lowercase Letters', icon: '🔡' },
                { id: 'sounds', name: 'Letter Sounds', icon: '🔊' },
                { id: 'words', name: 'Words with Letters', icon: '📚' }
            ]
        },
        numbers: {
            title: '🔢 Number Fun',
            description: 'Master counting and numbers 1-10',
            difficulty: 1,
            modules: [
                { id: 'counting', name: 'Counting 1-10', icon: '👆' },
                { id: 'shapes', name: 'Shapes with Numbers', icon: '🔷' },
                { id: 'math', name: 'Simple Math', icon: '➕' }
            ]
        },
        colors: {
            title: '🌈 Color Rainbow',
            description: 'Explore vibrant colors and objects',
            difficulty: 1,
            modules: [
                { id: 'basic', name: 'Basic Colors', icon: '🎨' },
                { id: 'objects', name: 'Objects by Color', icon: '🎯' }
            ]
        }
    },

    /**
     * Generate interactive lesson content dynamically
     */
    generateLessonContent: function (lessonId, moduleId) {
        const lesson = this.lessons[lessonId];
        if (!lesson) return '';

        let html = `
            <div class="lesson-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                 padding: 20px; border-radius: 10px; margin-bottom: 20px; color: white;">
                <h2 style="margin: 0 0 5px 0;">${lesson.title}</h2>
                <p style="margin: 0; opacity: 0.9;">${lesson.description}</p>
            </div>
        `;

        // Module progress indicators
        html += `<div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">`;
        lesson.modules.forEach(mod => {
            html += `<button onclick="LessonStructure.switchModule('${lessonId}', '${mod.id}')" 
                     style="padding: 10px 15px; border: 2px solid #667eea; border-radius: 20px; 
                     background: white; cursor: pointer; transition: all 0.3s; font-weight: 600;">
                ${mod.icon} ${mod.name}
            </button>`;
        });
        html += `</div>`;

        return html;
    },

    switchModule: function (lessonId, moduleId) {
        console.log(`Switching to ${lessonId} - ${moduleId}`);
        // Implementation based on module type
    }
};

// ============================================================================
// 3. GAMIFICATION & ACHIEVEMENT SYSTEM
// ============================================================================

const AchievementSystem = {
    badges: {
        '10stars': { name: 'First Step', icon: '🎉', color: '#FFD700' },
        '50stars': { name: 'Quick Learner', icon: '⭐', color: '#FFB700' },
        '100stars': { name: 'Super Smart', icon: '🧠', color: '#FF8C00' },
        '250stars': { name: 'Genius Mode', icon: '🎓', color: '#FF6B6B' },
        '500stars': { name: 'Champion', icon: '👑', color: '#FF1744' },
        'streak7': { name: '7-Day Streak', icon: '🔥', color: '#FF5722' },
        'perfect': { name: 'Perfect Score', icon: '💯', color: '#4CAF50' }
    },

    /**
     * Check and unlock achievements
     */
    checkAchievements: function (username, stars) {
        const milestones = [10, 50, 100, 250, 500];
        milestones.forEach(threshold => {
            if (stars === threshold) {
                this.unlockAchievement(username, `${threshold}stars`);
            }
        });
    },

    unlockAchievement: function (username, badgeId) {
        const badge = this.badges[badgeId];
        if (!badge) return;

        fetch('/main/api/achievement/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                badge_name: badge.name,
                badge_icon: badge.icon,
                description: `Achieved by reaching milestone`,
                achievement_type: 'milestone'
            })
        }).then(r => r.json()).then(data => {
            if (data.ok) {
                this.showAchievementNotification(badge);
            }
        }).catch(e => console.warn('Achievement unlock error:', e));
    },

    showAchievementNotification: function (badge) {
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            background: linear-gradient(135deg, ${badge.color}, #FF1744);
            color: white; padding: 20px 30px; border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0,0,0,0.3); font-weight: 700;
            animation: slideInRight 0.5s ease-out;
        `;
        notif.innerHTML = `${badge.icon} NEW ACHIEVEMENT: ${badge.name}! 🎊`;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.animation = 'fadeOut 0.5s ease-out';
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    }
};

// ============================================================================
// 4. CREATIVE INTERACTIVE FEATURES
// ============================================================================

const CreativeFeatures = {
    /**
     * Interactive letter tracing with visual feedback
     */
    createLetterTracer: function (letter) {
        const html = `
            <div style="text-align: center; padding: 20px; background: #f0f7ff; border-radius: 10px;">
                <div style="font-size: 120px; font-weight: 700; margin: 20px 0; opacity: 0.2;">
                    ${letter}
                </div>
                <p style="color: #666; margin: 10px 0;">Trace the letter ${letter} on the canvas below:</p>
                <canvas id="tracer-canvas" width="300" height="300" style="border: 2px solid #667eea; 
                    border-radius: 8px; cursor: crosshair; background: white; display: block; margin: 10px auto;"></canvas>
                <button onclick="CreativeFeatures.clearTracer()" style="padding: 10px 20px; margin-top: 10px;
                    background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Clear & Try Again
                </button>
            </div>
        `;
        return html;
    },

    clearTracer: function () {
        const canvas = document.getElementById('tracer-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    },

    /**
     * Interactive rhyme matching game
     */
    createRhymeGame: function () {
        const pairs = [
            { word: 'Cat', rhyme: 'Hat' },
            { word: 'Dog', rhyme: 'Log' },
            { word: 'Sun', rhyme: 'Fun' },
            { word: 'Tree', rhyme: 'Bee' }
        ];

        let html = `<div style="padding: 20px;">
            <h3 style="text-align: center; color: #667eea;">Find the Rhyming Pairs!</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">`;

        pairs.forEach((pair, idx) => {
            html += `
                <button class="rhyme-btn" data-pair="${idx}" onclick="CreativeFeatures.selectRhyme(${idx})"
                    style="padding: 20px; font-size: 1.2rem; font-weight: 700; border: 2px solid #667eea; 
                    border-radius: 10px; background: white; cursor: pointer; transition: all 0.3s;">
                    ${pair.word}
                </button>
            `;
        });

        html += `</div></div>`;
        return html;
    },

    selectRhyme: function (idx) {
        // Visual feedback
        event.target.style.background = '#667eea';
        event.target.style.color = 'white';
        event.target.style.transform = 'scale(1.05)';

        setTimeout(() => {
            event.target.style.background = 'white';
            event.target.style.color = 'black';
            event.target.style.transform = 'scale(1)';
        }, 300);
    },

    /**
     * Word building challenge
     */
    createWordBuilder: function () {
        const words = ['CAT', 'DOG', 'APPLE', 'BOOK'];
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        let html = `<div style="padding: 20px;">
            <h3>Build the Word!</h3>
            <div id="word-target" style="font-size: 2rem; text-align: center; margin: 20px 0;
                padding: 20px; border: 2px dashed #667eea; border-radius: 10px; min-height: 60px;">
                Click letters to build: ${words[0]}
            </div>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px;">`;

        letters.forEach(letter => {
            html += `<button onclick="CreativeFeatures.addLetter('${letter}')" style="padding: 15px;
                font-weight: 700; border: 2px solid #667eea; border-radius: 5px; background: white;
                cursor: pointer; transition: all 0.2s;">
                ${letter}
            </button>`;
        });

        html += `</div></div>`;
        return html;
    },

    addLetter: function (letter) {
        console.log('Added letter:', letter);
        event.target.style.background = '#667eea';
        event.target.style.color = 'white';
    }
};

// ============================================================================
// 5. RESPONSIVE UI IMPROVEMENTS
// ============================================================================

const UIImprovements = {
    /**
     * Enhanced progress bar with animation
     */
    createProgressBar: function (current, total, label) {
        const percentage = (current / total) * 100;
        return `
            <div style="margin: 15px 0;">
                <div style="font-size: 0.9rem; color: #666; margin-bottom: 5px; font-weight: 600;">
                    ${label}: ${current}/${total}
                </div>
                <div style="width: 100%; height: 20px; background: #e0e0e0; border-radius: 10px; overflow: hidden;">
                    <div style="width: ${percentage}%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2);
                        transition: width 0.3s ease; display: flex; align-items: center; justify-content: center;
                        color: white; font-size: 0.8rem; font-weight: 700;">
                        ${Math.round(percentage)}%
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Performance stats dashboard
     */
    createStatsDashboard: function (stats) {
        return `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0;">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 20px;
                    border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700;">${stats.stars || 0}</div>
                    <div style="opacity: 0.9;">⭐ Stars</div>
                </div>
                <div style="background: linear-gradient(135deg, #f093fb, #f5576c); color: white; padding: 20px;
                    border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700;">${stats.completed || 0}</div>
                    <div style="opacity: 0.9;">✅ Completed</div>
                </div>
                <div style="background: linear-gradient(135deg, #4facfe, #00f2fe); color: white; padding: 20px;
                    border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 700;">${stats.streak || 0}</div>
                    <div style="opacity: 0.9;">🔥 Day Streak</div>
                </div>
            </div>
        `;
    }
};

// ============================================================================
// 6. EXPORT MODULES FOR USE IN HOME.HTML
// ============================================================================

window.PronunciationModule = PronunciationModule;
window.LessonStructure = LessonStructure;
window.AchievementSystem = AchievementSystem;
window.CreativeFeatures = CreativeFeatures;
window.UIImprovements = UIImprovements;

console.log('✅ Enhanced Learning Modules Loaded');
console.log('Available: PronunciationModule, LessonStructure, AchievementSystem, CreativeFeatures, UIImprovements');
