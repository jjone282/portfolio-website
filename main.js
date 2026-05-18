// ── CUSTOM CURSOR ────────────────────────────────────────────────
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.className  = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.append(dot, ring);

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.2;
  ringY += (mouseY - ringY) * 0.2;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.addEventListener('mousedown', () => dot.classList.add('clicked'));
document.addEventListener('mouseup',   () => dot.classList.remove('clicked'));

document.querySelectorAll('a, button, .project-card, .timeline-card, .skill-group, .education-card').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('nav ul a');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const active = document.querySelector(`nav ul a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach((s) => observer.observe(s));

// Fade-in on scroll
const animatedEls = document.querySelectorAll('.animate-on-scroll');
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
animatedEls.forEach((el) => fadeObserver.observe(el));

// ── CODE TYPEWRITER ───────────────────────────────────────────────
(function typewriterCode() {
  const codeEl = document.querySelector('.code-body code');
  if (!codeEl) return;

  // Flatten DOM children into {ch, cls} character array
  const chars = [];
  codeEl.childNodes.forEach(node => {
    if (node.classList && node.classList.contains('c-cursor')) return;
    const text = node.nodeType === Node.TEXT_NODE
      ? node.nodeValue
      : node.textContent;
    const cls = node.nodeType === Node.ELEMENT_NODE ? node.className : null;
    for (const ch of text) chars.push({ ch, cls });
  });

  // Build cursor element, clear code area
  const cursorEl = document.createElement('span');
  cursorEl.className = 'c-cursor';
  cursorEl.textContent = ' ';
  codeEl.innerHTML = '';

  let i = 0, currentEl = null, currentCls = Symbol();

  function type() {
    if (i >= chars.length) {
      codeEl.appendChild(cursorEl);
      return;
    }

    const { ch, cls } = chars[i++];

    if (cls !== currentCls) {
      currentCls = cls;
      if (cls === null) {
        currentEl = document.createTextNode(ch);
        codeEl.appendChild(currentEl);
      } else {
        currentEl = document.createElement('span');
        currentEl.className = cls;
        currentEl.textContent = ch;
        codeEl.appendChild(currentEl);
      }
    } else {
      if (currentEl.nodeType === Node.TEXT_NODE) {
        currentEl.nodeValue += ch;
      } else {
        currentEl.textContent += ch;
      }
    }

    // Slight random speed variation for realism; newlines are instant
    const delay = ch === '\n' ? 0 : Math.random() * 1.1 + 0.5;
    setTimeout(type, delay);
  }

  // Small pause before starting so the page feels settled
  setTimeout(type, 600);
})();

// Contact form — swap button text on submit (no real backend)
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Message sent!';
  btn.disabled = true;
  btn.style.background = 'var(--pink-300)';
  setTimeout(() => {
    btn.textContent = 'Send message';
    btn.disabled = false;
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}
