# 🛠️ DEVELOPER REFERENCE GUIDE

## Quick API Reference

### 1. Authentication APIs

#### Register New User
```javascript
fetch('/main/api/register/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'student1',
        password: 'pass123',
        character: '👦'
    })
}).then(r => r.json()).then(data => {
    console.log(data);
    // { ok: true, user: {...} }
});
```

#### Login User
```javascript
fetch('/main/api/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'student1',
        password: 'pass123'
    })
}).then(r => r.json()).then(data => {
    if (data.ok) {
        window.currentUser = data.user;
        console.log('Logged in:', data.user.username);
    }
});
```

---

### 2. Progress APIs

#### Get User Progress
```javascript
fetch('/main/api/progress/student1/')
    .then(r => r.json())
    .then(data => {
        console.log('Stars:', data.user.stars);
        console.log('Chapters:', data.statistics.completed_chapters);
        console.log('Achievements:', data.achievements);
    });
```

#### Save Progress
```javascript
fetch('/main/api/progress/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: window.currentUser.username,
        chapter_id: 'alphabet_001',
        chapter_name: 'Alphabet Basics',
        score: 85,
        is_completed: true
    })
}).then(r => r.json()).then(data => {
    console.log('Stars now:', data.user.stars);
});
```

---

### 3. Pronunciation APIs

#### Log Pronunciation Practice
```javascript
// Use PronunciationModule
PronunciationModule.logPractice('A', 'alphabet');
// OR API directly
fetch('/main/api/pronunciation/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: window.currentUser.username,
        item: 'alphabet:A',
        proficiency_level: 2  // 0-4 scale
    })
}).then(r => r.json()).then(data => {
    console.log('Proficiency:', data.proficiency_level);
});
```

---

### 4. Achievement APIs

#### Unlock Achievement
```javascript
fetch('/main/api/achievement/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: window.currentUser.username,
        badge_name: 'Quick Learner',
        badge_icon: '⭐',
        description: 'Reached 50 stars',
        achievement_type: 'stars'
    })
}).then(r => r.json()).then(data => {
    if (data.ok) {
        console.log('Achievement unlocked!');
    }
});
```

---

### 5. Settings APIs

#### Update User Settings
```javascript
fetch('/main/api/settings/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: window.currentUser.username,
        voice_gender: 'girl',    // 'boy' or 'girl'
        voice_pitch: 1.2,        // 0.5 - 2.0
        voice_rate: 0.9,         // 0.5 - 1.5
        theme: 'light'           // 'light' or 'dark'
    })
}).then(r => r.json()).then(data => {
    console.log('Settings updated:', data.settings);
});
```

---

## JavaScript Module Usage

### Pronunciation Module

```javascript
// Access pronunciation database
const data = PronunciationModule.database.alphabet['A'];
// Returns: { word: 'Apple', hint: 'Say like "AYY"', examples: [...] }

// Play pronunciation
PronunciationModule.playPronunciation('A', 'alphabet');

// Text-to-speech with voice customization
PronunciationModule.speak('Hello World', 0.8, 1.0);  // rate, pitch

// Access number pronunciation
const numData = PronunciationModule.database.numbers['5'];
```

---

### Lesson Structure

```javascript
// Get lesson content
const html = LessonStructure.generateLessonContent('alphabet', 'sounds');

// Switch between modules
LessonStructure.switchModule('alphabet', 'sounds');

// Access lessons
console.log(LessonStructure.lessons.alphabet.title);
// "🔤 Alphabet Adventure"
```

---

### Achievement System

```javascript
// Check achievements
AchievementSystem.checkAchievements('student1', 100);  // 100 stars

// Unlock specific achievement
AchievementSystem.unlockAchievement('student1', '100stars');

// Show notification
const badge = AchievementSystem.badges['50stars'];
AchievementSystem.showAchievementNotification(badge);
```

---

### Creative Features

```javascript
// Letter tracing
const html = CreativeFeatures.createLetterTracer('A');
document.getElementById('game-container').innerHTML = html;

// Rhyme game
const html = CreativeFeatures.createRhymeGame();
document.getElementById('game-container').innerHTML = html;

// Word builder
const html = CreativeFeatures.createWordBuilder();
document.getElementById('game-container').innerHTML = html;

// Clear tracer
CreativeFeatures.clearTracer();
```

---

### UI Improvements

```javascript
// Create progress bar
const html = UIImprovements.createProgressBar(5, 10, 'Lessons');
document.getElementById('progress').innerHTML = html;

// Create stats dashboard
const html = UIImprovements.createStatsDashboard({
    stars: 150,
    completed: 8,
    streak: 5
});
document.getElementById('stats').innerHTML = html;
```

---

## Database Models Reference

### UserProgress
```python
user = UserProgress.objects.create(
    username='student1',
    character='👦',
    stars=0,
    voice_gender='boy',
    voice_pitch=1.0,
    voice_rate=1.0,
    theme='light'
)

# Methods
user.set_password('password123')
user.check_password('password123')  # True
user.add_stars(50)  # Returns achievement name if unlocked
user.get_achievement_unlock()  # Check for achievements
```

### ChapterProgress
```python
chapter = ChapterProgress.objects.create(
    user=user,
    chapter_id='alphabet_001',
    chapter_name='Alphabet Basics',
    score=85,
    max_score=100,
    attempts=1,
    is_completed=False
)

# Methods
chapter.mark_completed()  # Marks complete with timestamp
```

### Achievement
```python
achievement = Achievement.objects.create(
    user=user,
    badge_name='Quick Learner',
    badge_icon='⭐',
    achievement_type='stars',
    description='Reached 50 stars'
)

# Query achievements
badges = Achievement.objects.filter(user=user).order_by('-earned_at')
```

### PronunciationLog
```python
log = PronunciationLog.objects.create(
    user=user,
    item='alphabet:A',
    times_heard=1,
    times_practiced=0,
    proficiency_level=1
)

# Query logs
logs = PronunciationLog.objects.filter(
    user=user
).order_by('-last_practiced')
```

---

## Common Implementation Patterns

### Adding a New Game Module

```javascript
function initMyNewGame() {
    // 1. Generate HTML
    let html = `<div style="padding: 20px;">
        <h2>My Game Title</h2>
        <div id="game-content"></div>
    </div>`;
    
    // 2. Update DOM
    document.getElementById('myGamePanel').innerHTML = html;
    
    // 3. Add interactivity
    document.getElementById('myGamePanel').addEventListener('click', (e) => {
        if (e.target.matches('.game-button')) {
            playSound('correct');
            addStars(10);
        }
    });
}

// Register in switchTab function
function switchTab(name) {
    if (name === 'myNewGame') {
        initMyNewGame();
    }
}
```

---

### Saving Progress from a Game

```javascript
function saveGameProgress(chapterName, score, isCompleted) {
    if (!currentUser) return;
    
    fetch('/main/api/progress/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: currentUser.username,
            chapter_id: chapterName.toLowerCase().replace(/ /g, '_'),
            chapter_name: chapterName,
            score: score,
            is_completed: isCompleted
        })
    }).then(r => r.json()).then(data => {
        console.log('Progress saved!');
        console.log('Stars now:', data.user.stars);
        
        // Check for achievements
        AchievementSystem.checkAchievements(
            currentUser.username, 
            data.user.stars
        );
    });
}

// Usage
saveGameProgress('Phonics', 95, true);
```

---

### Adding Pronunciation Hints

```javascript
function createPronunciationButton(letter) {
    const data = PronunciationModule.database.alphabet[letter];
    
    const html = `
        <button onclick="PronunciationModule.playPronunciation('${letter}', 'alphabet')"
                title="${data.hint}">
            🔊 ${letter}
        </button>
        <div class="hint">${data.hint}</div>
        <div class="examples">${data.examples.join(', ')}</div>
    `;
    
    return html;
}
```

---

### Implementing Achievement Detection

```javascript
function checkAndUnlockAchievements(username, stars) {
    const milestones = {
        10: 'First Step',
        50: 'Quick Learner',
        100: 'Super Smart',
        250: 'Genius Mode',
        500: 'Champion'
    };
    
    Object.entries(milestones).forEach(([threshold, badgeName]) => {
        if (stars === parseInt(threshold)) {
            AchievementSystem.unlockAchievement(
                username,
                badgeName,
                AchievementSystem.badges[`${threshold}stars`].icon
            );
        }
    });
}

// Usage in game completion
const finalScore = calculateGameScore();
if (finalScore > 80) {
    user.stars += 10;
    checkAndUnlockAchievements(user.username, user.stars);
}
```

---

## Debugging Tips

### Check Pronunciation Module
```javascript
// Verify module loaded
console.log(typeof PronunciationModule);  // 'object'

// Check pronunciation data
console.log(PronunciationModule.database);

// Test speech
PronunciationModule.speak('Testing voice');

// Check proficiency levels
console.log(PronunciationModule.logPractice);
```

### Check Achievement System
```javascript
// Verify badges defined
console.log(AchievementSystem.badges);

// Test achievement unlock
AchievementSystem.unlockAchievement('testuser', '50stars');

// Check notifications
AchievementSystem.showAchievementNotification(
    AchievementSystem.badges['50stars']
);
```

### API Testing
```javascript
// Test endpoint
fetch('/main/api/progress/testuser/')
    .then(r => r.json())
    .then(d => console.log(d));

// Check response
console.log(response.ok);     // true/false
console.log(response.status); // 200, 404, etc.
```

---

## Performance Optimization

### Caching User Data
```javascript
// Store in memory
let userCache = {};

function getUserData(username) {
    if (userCache[username]) {
        return Promise.resolve(userCache[username]);
    }
    
    return fetch(`/main/api/progress/${username}/`)
        .then(r => r.json())
        .then(data => {
            userCache[username] = data;
            return data;
        });
}
```

### Lazy Loading Modules
```javascript
// Load modules on demand
async function loadGameModule(gameType) {
    if (window[gameType + 'Module']) {
        return;  // Already loaded
    }
    
    const script = document.createElement('script');
    script.src = `/static/main/${gameType}.js`;
    document.head.appendChild(script);
}
```

---

## Security Best Practices

### Input Validation
```javascript
function validateUsername(username) {
    if (username.length < 3) {
        throw new Error('Username too short');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Invalid characters');
    }
    return true;
}

function validatePassword(password) {
    if (password.length < 4) {
        throw new Error('Password too short');
    }
    return true;
}
```

### Error Handling
```javascript
fetch('/api/endpoint', { method: 'POST', body: JSON.stringify(data) })
    .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
    })
    .then(data => {
        if (!data.ok) throw new Error(data.error);
        console.log('Success:', data);
    })
    .catch(e => {
        console.error('Error:', e.message);
        // Show user-friendly error message
    });
```

---

## Testing Checklist

- [ ] All API endpoints respond correctly
- [ ] Pronunciation plays with correct voice
- [ ] Achievements unlock at correct milestones
- [ ] Progress saves correctly
- [ ] Stats update in real-time
- [ ] Mobile layout responsive
- [ ] Touch interactions work
- [ ] Audio plays on first interaction
- [ ] No console errors
- [ ] Database migrations successful

