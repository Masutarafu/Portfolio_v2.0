
// ── Floating nav toggle
function toggleFab() {
document.getElementById('fabMenu').classList.toggle('open');
}
function closeFab() {
document.getElementById('fabMenu').classList.remove('open');
}
// Close if user taps outside
document.addEventListener('click', e => {
const fab = document.getElementById('fabNav');
if (!fab.contains(e.target)) closeFab();
});
// ── Animate progress bar on scroll into view
const fill = document.getElementById('progress-fill');
const pctEl = document.getElementById('progress-pct');
const TARGET = 15; // ← UPDATE this number as you progress (0–100)

const observer = new IntersectionObserver(entries => {
entries.forEach(e => {
if (e.isIntersecting) {
fill.style.width = TARGET + '%';
pctEl.textContent = TARGET + '%';
observer.disconnect();
}
});
}, { threshold: 0.3 });

observer.observe(document.querySelector('.progress-track'));

// ── Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
let current = '';
sections.forEach(s => {
if (window.scrollY >= s.offsetTop - 80) current = s.getAttribute('id');
});
navLinks.forEach(a => {
a.style.color = a.getAttribute('href') === '#' + current
? 'var(--accent-hi)'
: '';
});
});