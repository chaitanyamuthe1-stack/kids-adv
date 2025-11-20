// NEW INTERACTIVE GAMES & FEATURES TO ADD

// ========== SPELLING QUIZ ==========
function initSpelling() {
    const spellingQuizzes = [
        { correct: 'cat', wrong: ['catt', 'cta', 'caht'] },
        { correct: 'dog', wrong: ['dgo', 'og', 'dod'] },
        { correct: 'apple', wrong: ['aple', 'apel', 'appel'] },
        { correct: 'book', wrong: ['bok', 'boo', 'boook'] },
        { correct: 'tree', wrong: ['tre', 'tere', 'tere'] }
    ];

    const quiz = spellingQuizzes[Math.floor(Math.random() * spellingQuizzes.length)];
    const options = [quiz.correct, ...quiz.wrong].sort(() => Math.random() - 0.5);

    let html = `<div style="text-align:center;font-size:2rem;margin:20px;color:#ff6b6b">Listen:</div>`;
    html += `<div style="text-align:center;margin:20px"><button class="tab" onclick="speakText('${quiz.correct}')">🔊 Hear Word</button></div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(100px, 1fr));gap:10px">`;

    options.forEach(opt => {
        html += `<button class="tile" onclick="${opt === quiz.correct ? `speakText('Correct! ${opt}'); addStars(5, 'spelling')` : `speakText('Try again'); shakeElement(event.target)`}" style="padding:20px;font-size:1.2rem;cursor:pointer;transition:all 0.3s;border:3px solid #ddd">
            ${opt}
        </button>`;
    });

    html += `</div>`;
    document.getElementById('spellingQuiz').innerHTML = html;
}

// ========== WORD MATCHING ==========
function initWordMatch() {
    const pairs = [
        { emoji: '🐕', word: 'dog' },
        { emoji: '🐈', word: 'cat' },
        { emoji: '🍎', word: 'apple' },
        { emoji: '📚', word: 'book' },
        { emoji: '🌳', word: 'tree' }
    ];

    let html = `<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">`;
    html += `<div style="text-align:center"><div style="font-size:3rem;margin:20px">${pairs[0].emoji}</div></div>`;

    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    html += `<div style="display:grid;gap:10px">`;
    shuffled.forEach(p => {
        html += `<button class="tab" onclick="${p.word === pairs[0].word ? `speakText('Correct!'); addStars(5, 'wordmatch')` : `speakText('Try again')`}" style="padding:15px;font-size:1.1rem">${p.word}</button>`;
    });
    html += `</div></div>`;

    document.getElementById('wordmatchGame').innerHTML = html;
}

// ========== TRUE OR FALSE ==========
function initTrueFalse() {
    const statements = [
        { text: 'A cat is a dog', answer: false },
        { text: 'An apple is a fruit', answer: true },
        { text: 'A tree can fly', answer: false },
        { text: 'A book has words', answer: true },
        { text: 'Fish can swim', answer: true }
    ];

    const statement = statements[Math.floor(Math.random() * statements.length)];
    let html = `<div style="font-size:1.5rem;margin:30px;color:#333;font-weight:700">${statement.text}</div>`;
    html += `<div style="display:flex;gap:20px;justify-content:center">`;
    html += `<button class="tab" onclick="${statement.answer === true ? `speakText('Correct!'); addStars(5, 'truefalse')` : `speakText('Try again')`}" style="padding:20px 30px;font-size:1.3rem;background:#6ee7b7">✓ True</button>`;
    html += `<button class="tab" onclick="${statement.answer === false ? `speakText('Correct!'); addStars(5, 'truefalse')` : `speakText('Try again')`}" style="padding:20px 30px;font-size:1.3rem;background:#ff6b6b;color:white">✗ False</button>`;
    html += `</div>`;

    document.getElementById('truefalseGame').innerHTML = html;
}

// ========== COUNTING GAME ==========
function initCounting() {
    const items = [
        { count: 3, emoji: '🍎' },
        { count: 5, emoji: '🌟' },
        { count: 2, emoji: '🐕' },
        { count: 4, emoji: '🎈' }
    ];

    const item = items[Math.floor(Math.random() * items.length)];
    let html = `<div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:20px">`;

    for (let i = 0; i < item.count; i++) {
        html += `<span style="font-size:2rem">${item.emoji}</span>`;
    }

    html += `</div><p style="text-align:center;font-size:1.2rem;color:#666">How many ${item.emoji}?</p>`;
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(60px, 1fr));gap:10px;max-width:300px;margin:20px auto">`;

    for (let n = 1; n <= 6; n++) {
        html += `<button class="tab" onclick="${n === item.count ? `speakText('Correct!'); addStars(5, 'counting')` : `speakText('Try again')`}" style="padding:15px;font-size:1.2rem">${n}</button>`;
    }

    html += `</div>`;
    document.getElementById('countingGame').innerHTML = html;
}

// ========== PHONICS PRACTICE ==========
function initPhonics() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const sounds = {
        'A': 'Apple', 'B': 'Ball', 'C': 'Cat', 'D': 'Dog', 'E': 'Elephant',
        'F': 'Fish', 'G': 'Giraffe', 'H': 'Hat', 'I': 'Ice cream', 'J': 'Jellyfish',
        'K': 'Kite', 'L': 'Lion', 'M': 'Monkey', 'N': 'Nest', 'O': 'Orange',
        'P': 'Pig', 'Q': 'Queen', 'R': 'Rabbit', 'S': 'Sun', 'T': 'Tiger',
        'U': 'Umbrella', 'V': 'Violin', 'W': 'Watch', 'X': 'Xylophone', 'Y': 'Yo-yo', 'Z': 'Zebra'
    };

    let html = '';
    letters.forEach(letter => {
        html += `<button class="tab" onclick="speakText('${letter}. ${sounds[letter]}'); event.target.style.transform='scale(1.2)'; setTimeout(()=>event.target.style.transform='',200)" style="padding:10px;font-size:1rem;font-weight:700;cursor:pointer;transition:all 0.3s;border:3px solid #ffd166">
            ${letter}
        </button>`;
    });

    document.getElementById('phonicsGame').innerHTML = html;
}

// ========== SHAPE SORTING ==========
function initShapeSorting() {
    let html = `<div style="text-align:center;grid-column:1/-1;margin-bottom:20px;font-weight:700;color:#ff6b6b">Drag shapes to correct category</div>`;
    html += `<div style="border:3px dashed #ff6b6b;padding:20px;text-align:center;min-height:150px"><h4>🔴 Circles</h4><div id="circleTarget" style="min-height:80px"></div></div>`;
    html += `<div style="border:3px dashed #ffd166;padding:20px;text-align:center;min-height:150px"><h4>🟩 Squares</h4><div id="squareTarget" style="min-height:80px"></div></div>`;

    document.getElementById('shapeSortGame').innerHTML = html;

    let html2 = `<div style="grid-column:1/-1;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:20px">`;
    html2 += `<button class="tile" style="font-size:2rem;cursor:move">🔴</button>`;
    html2 += `<button class="tile" style="font-size:2rem;cursor:move">🟩</button>`;
    html2 += `<button class="tile" style="font-size:2rem;cursor:move">⭕</button>`;
    html2 += `<button class="tile" style="font-size:2rem;cursor:move">⬜</button>`;
    html2 += `</div>`;

    document.getElementById('shapeSortGame').innerHTML += html2;
}

// ========== SPOT THE DIFFERENCE ==========
function initSpotDifference() {
    let html = `<div style="text-align:center;padding:20px;border:3px solid #ff6b6b;border-radius:15px">
        <div style="font-size:3rem">🐶🍎🌟</div>
        <p>Left image</p>
    </div>`;
    document.getElementById('spotDiffGame').innerHTML = html;

    let html2 = `<div style="text-align:center;padding:20px;border:3px solid #ffd166;border-radius:15px">
        <div style="font-size:3rem">🐶🍎⭐</div>
        <p>Right image (missing star)</p>
    </div>`;
    document.getElementById('spotDiffGame').innerHTML += html2;
}

// Helper function to add stars
function addStars(amount, source) {
    if (!currentUser || !users[currentUser]) return;
    users[currentUser].stars = (users[currentUser].stars || 0) + amount;
    document.getElementById('pointsBadge').textContent = `Stars: ${users[currentUser].stars}`;
    saveUsers();
    showConfetti();
}

// Initialize all new games on app start
function initNewGames() {
    setTimeout(() => {
        if (document.getElementById('spellingQuiz')) initSpelling();
        if (document.getElementById('wordmatchGame')) initWordMatch();
        if (document.getElementById('truefalseGame')) initTrueFalse();
        if (document.getElementById('countingGame')) initCounting();
        if (document.getElementById('phonicsGame')) initPhonics();
        if (document.getElementById('shapeSortGame')) initShapeSorting();
        if (document.getElementById('spotDiffGame')) initSpotDifference();
    }, 500);
}

// ========== MULTIPLICATION PRACTICE ==========
function initMultiplication() {
    const table = Math.floor(Math.random() * 9) + 2; // 2..10
    const problems = [];
    for (let i = 1; i <= 10; i++) problems.push({ q: `${table} × ${i}`, a: table * i });

    let html = `<div style="text-align:center;margin:10px"><h3>Times Table: ${table}</h3></div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;max-width:700px;margin:10px auto">`;
    problems.forEach(p => {
        html += `<button class="tile" onclick="if(${p.a}===${p.a}){speakText('Answer: ${p.a}'); addStars(1,'multiplication')}" style="padding:12px">${p.q}</button>`;
    });
    html += `</div><div style="text-align:center;margin-top:12px"><button class='tab' onclick='speakText("Practice the times table: say the answer out loud and tap to check")'>🔊 Tip</button></div>`;
    document.getElementById('multiplicationModule').innerHTML = html;
}

// ========== READING MODULE (leveled snippets) ==========
function initReadingModule() {
    const passages = [
        { level: 'K', text: 'The cat sat on a mat.' },
        { level: '1', text: 'Tom has a red ball. He plays with it.' },
        { level: '2', text: 'Birds fly high in the blue sky. They sing songs.' }
    ];
    const p = passages[Math.floor(Math.random() * passages.length)];
    // escape single quotes for inline onclick
    const escaped = p.text.replace(/'/g, "\\'");
    let html = '<div style="text-align:left;max-width:800px;margin:10px auto">';
    html += '<h4>Reading — Level ' + p.level + '</h4>';
    html += '<p style="font-size:1.2rem;">' + p.text + '</p>';
    html += '<div style="display:flex;gap:10px;justify-content:center;">';
    html += '<button class="tab" onclick="speakText(\'' + escaped + '\')">🔊 Read Aloud</button>';
    html += '<button class="tab" onclick="addStars(5,\'reading\');speakText(\'Great reading!\')">✅ I Read</button>';
    html += '</div></div>';
    document.getElementById('readingModule').innerHTML = html;
}

// ========== GRADE MATH: small level selector ==========
function initGradeMath() {
    let html = `<div style=\"text-align:center;margin:10px\"><h3>Grade Math</h3><div style=\"display:flex;gap:8px;justify-content:center;flex-wrap:wrap\">`;
    ['K', '1', '2', '3', '4', '5'].forEach(g => {
        html += `<button class=\"tile\" onclick=\"selectGrade('${g}')\">Grade ${g}</button>`;
    });
    html += `</div><div id=\"gradeMathContent\" style=\"margin-top:12px\"></div></div>`;
    document.getElementById('gradeMathModule').innerHTML = html;
}

function selectGrade(g) {
    const sample = {
        'K': 'Count to 10',
        '1': 'Add simple numbers: 2 + 3 = ?',
        '2': 'Subtraction practice: 7 - 4 = ?',
        '3': 'Multiply: 4 × 3 = ?',
        '4': 'Divide: 12 ÷ 3 = ?',
        '5': 'Fractions: 1/2 of 8 = ?'
    };
    document.getElementById('gradeMathContent').innerHTML = `<div style=\"text-align:center;padding:12px;\">Sample: ${sample[g]}<div style=\"margin-top:8px\"><button class=\"tab\" onclick=\"speakText('Try this activity: '+ '${sample[g]}'); addStars(5,'grademath')\">Start</button></div></div>`;
}

// ========== TIMED QUIZ PROTOTYPE ==========
function initTimedQuiz() {
    const questions = [
        { q: '2 + 2', a: '4' },
        { q: '5 - 3', a: '2' },
        { q: '3 × 3', a: '9' }
    ];
    let idx = 0; let score = 0; let timeLeft = 10; let timerId = null;

    function render() {
        const q = questions[idx];
        document.getElementById('timedQuiz').innerHTML = `<div style=\"text-align:center;\"><h3>Timed Quiz</h3><div style=\"font-size:1.4rem;margin:12px\">${q.q}</div><input id=\"timedAns\" placeholder=\"Answer\" style=\"font-size:1.2rem;padding:8px\" /><div style=\"margin-top:8px\"><button class=\"tab\" onclick=\"submitAns()\">Submit</button></div><div id=\"tTimer\" style=\"margin-top:10px;color:#666\">Time: ${timeLeft}s</div></div>`;
    }

    window.submitAns = function () {
        const val = document.getElementById('timedAns').value.trim();
        if (val === questions[idx].a) { score += 1; speakText('Correct!'); addStars(2, 'timedquiz'); }
        else speakText('Try again');
        idx++;
        if (idx >= questions.length) { clearInterval(timerId); document.getElementById('timedQuiz').innerHTML = `<div style=\"text-align:center\">Quiz over! Score: ${score}/${questions.length}</div>`; }
        else { timeLeft = 10; render(); }
    };

    function startTimer() {
        timerId = setInterval(() => {
            timeLeft -= 1; const el = document.getElementById('tTimer'); if (el) el.textContent = 'Time: ' + timeLeft + 's';
            if (timeLeft <= 0) { clearInterval(timerId); speakText('Time up!'); idx++; if (idx >= questions.length) document.getElementById('timedQuiz').innerHTML = `<div style=\"text-align:center\">Quiz over! Score: ${score}/${questions.length}</div>`; else { timeLeft = 10; render(); startTimer(); } }
        }, 1000);
    }

    render(); startTimer();
}

// Register these with initNewGames if desired (not automatic to avoid performance hit)
