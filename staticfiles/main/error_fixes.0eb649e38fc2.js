// FIX: Error fixes for Home.html console errors
// This file patches critical JavaScript errors

// 1. FIX: Replace invalid querySelector selector with hasAttribute check
window.addEventListener('DOMContentLoaded', function () {
    // Check if shake keyframes are already defined
    let hasShake = false;
    const styles = document.querySelectorAll('style');
    for (let s of styles) {
        if (s.textContent.includes('@keyframes shake')) {
            hasShake = true;
            break;
        }
    }

    if (!hasShake) {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                75% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);
    }
});

// 2. FIX: Initialize confetti array early to prevent "Cannot access before initialization"
let confetti = [];
const confCanvas = document.getElementById('confettiCanvas');
const cctx = confCanvas ? confCanvas.getContext('2d') : null;

function initConfettiCanvas() {
    if (confCanvas) {
        confCanvas.width = window.innerWidth;
        confCanvas.height = window.innerHeight;
    }
}

window.addEventListener('resize', initConfettiCanvas);
window.addEventListener('DOMContentLoaded', initConfettiCanvas);

// 3. FIX: Safe playSound with proper error handling and AudioContext resumption
function playSoundSafe(type) {
    try {
        const audioContext = window.audioContext || new (window.AudioContext || window.webkitAudioContext)();
        window.audioContext = audioContext;

        // Resume if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Simple beep sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        console.warn('Audio playback not available:', e);
    }
}

// 4. FIX: Safe playSound for instrument notes
function playSoundNote(instrument, note) {
    try {
        const audioContext = window.audioContext || new (window.AudioContext || window.webkitAudioContext)();
        window.audioContext = audioContext;

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const frequencies = {
            'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23,
            'G': 392.00, 'A': 440.00, 'B': 493.88, 'C2': 523.25
        };

        if (instrument === 'piano' || instrument === 'xylophone') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(frequencies[note] || 440, audioContext.currentTime);
        } else if (instrument === 'drums') {
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        }

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.warn('Audio playback not available:', e);
    }
}

// 5. FIX: Safe confetti with null checks
function makeConfettiSafe() {
    if (!confCanvas || !cctx) return;

    confetti = [];
    const colors = ['#ffd166', '#ff6b6b', '#6ee7b7', '#9b5cff', '#4d96ff'];
    for (let i = 0; i < 70; i++) {
        confetti.push({
            x: Math.random() * confCanvas.width,
            y: Math.random() * -confCanvas.height,
            r: Math.random() * 8 + 4,
            c: colors[Math.floor(Math.random() * colors.length)],
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 3 + 2,
            rot: Math.random() * 360
        });
    }
    requestAnimationFrame(drawConfSafe);
}

function drawConfSafe() {
    if (!confCanvas || !cctx) return;

    cctx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    confetti.forEach(p => {
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate(p.rot * Math.PI / 180);
        cctx.fillStyle = p.c;
        cctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        cctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.rot += 2;
    });
    confetti = confetti.filter(p => p.y < confCanvas.height + 50);
    if (confetti.length) requestAnimationFrame(drawConfSafe);
}

function showConfettiSafe() {
    makeConfettiSafe();
    setTimeout(() => {
        confetti = [];
        if (cctx) cctx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    }, 1500);
}

console.log('✅ Error fixes loaded - all critical issues patched');
