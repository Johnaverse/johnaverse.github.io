// Homepage behaviour: full-page sections with sideways slides on large screens, plus the language, copy and motion controls.
export {};
const html = document.documentElement;
const body = document.body;

const languageSelect = document.querySelector<HTMLSelectElement>('[data-language-select]');
languageSelect?.addEventListener('change', () => { window.location.assign(languageSelect.value); });

// Copy the email address
const copyBtn = document.getElementById('copy-email') as HTMLButtonElement | null;
const email = document.getElementById('email');
if (copyBtn && email) {
  const label = copyBtn.textContent ?? '';
  copyBtn.addEventListener('click', () => {
    const done = () => { copyBtn.textContent = copyBtn.dataset.copied ?? label; setTimeout(() => { copyBtn.textContent = label; }, 2000); };
    const select = () => {
      const range = document.createRange();
      range.selectNodeContents(email);
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      copyBtn.textContent = copyBtn.dataset.fallback ?? label;
    };
    try { navigator.clipboard.writeText(email.textContent ?? '').then(done, select); } catch { select(); }
  });
}

// Motion preference, shared with the rest of the site
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const motionBtn = document.getElementById('motion-toggle') as HTMLButtonElement | null;
let paused = false;
try { paused = localStorage.getItem('johnaverse-motion') === 'paused'; } catch { /* Storage can be disabled. */ }
const instantMotion = () => paused || reduce.matches;
const applyMotion = () => {
  html.dataset.motion = instantMotion() ? 'paused' : 'running';
  if (!motionBtn) return;
  motionBtn.hidden = reduce.matches;
  motionBtn.textContent = (paused ? motionBtn.dataset.resumeText : motionBtn.dataset.pauseText) ?? '';
};
motionBtn?.addEventListener('click', () => {
  paused = !paused;
  try { localStorage.setItem('johnaverse-motion', paused ? 'paused' : 'running'); } catch { /* The preference still applies for this visit. */ }
  applyMotion();
});
reduce.addEventListener('change', applyMotion);
applyMotion();

// Full-page engine
const wrap = document.querySelector<HTMLElement>('.fp-wrap')!;
const track = document.querySelector<HTMLElement>('.fp-track')!;
const sections = [...document.querySelectorAll<HTMLElement>('.fp-section')];
const dots = [...document.querySelectorAll<HTMLAnchorElement>('.fp-dots a')];
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav]')];
const slidesOf = (s: number) => [...sections[s].querySelectorAll<HTMLElement>('.slide')];
const state = { i: 0, k: sections.map(() => 0), fp: false, locked: false };
const DURATION = 600;

const names = new Map<string, { s: number; k: number | null }>();
sections.forEach((section, s) => {
  names.set(section.id, { s, k: null });
  slidesOf(s).forEach((slide, k) => names.set(slide.id, { s, k }));
});
const currentName = () => {
  const slide = slidesOf(state.i)[state.k[state.i]];
  return slide && state.k[state.i] > 0 ? slide.id : sections[state.i].id;
};

function render(instant = false) {
  const ms = instant || instantMotion() ? 0 : DURATION;
  track.style.transitionDuration = `${ms}ms`;
  track.style.transform = `translate3d(0, ${-state.i * 100}%, 0)`;
  sections.forEach((section, s) => {
    const slides = slidesOf(s);
    if (!slides.length) return;
    const k = state.k[s];
    const slideTrack = section.querySelector<HTMLElement>('.slides-track')!;
    slideTrack.style.transitionDuration = `${ms}ms`;
    slideTrack.style.transform = `translate3d(${-k * 100}%, 0, 0)`;
    section.querySelectorAll('.slide-tab').forEach((tab, j) => tab.toggleAttribute('aria-current', j === k));
    const [prev, next] = section.querySelectorAll<HTMLButtonElement>('.slide-step');
    prev.disabled = k === 0;
    next.disabled = k === slides.length - 1;
  });
  const slide = slidesOf(state.i)[state.k[state.i]];
  body.dataset.accent = slide?.dataset.accent ?? 'cyan';
  dots.forEach((dot, j) => dot.toggleAttribute('aria-current', j === state.i));
  navLinks.forEach(link => link.toggleAttribute('aria-current', link.dataset.nav === sections[state.i].id));
}

let unlock: ReturnType<typeof setTimeout> | undefined;
function goTo(s: number, k: number | null = null, opts: { force?: boolean; instant?: boolean } = {}) {
  s = Math.max(0, Math.min(sections.length - 1, s));
  const count = slidesOf(s).length;
  if (k != null && count) state.k[s] = Math.max(0, Math.min(count - 1, k));
  if (s === state.i && k == null && !opts.force) return;
  state.i = s;
  if (state.fp) {
    render(opts.instant);
    state.locked = true;
    clearTimeout(unlock);
    unlock = setTimeout(() => { state.locked = false; }, instantMotion() ? 120 : DURATION + 150);
  }
  try { history.replaceState(null, '', `#${currentName()}`); } catch { /* Navigation still works without the address update. */ }
}
const move = (dir: number) => { if (!state.locked) goTo(state.i + dir); };
const moveSlide = (dir: number) => {
  const count = slidesOf(state.i).length;
  if (!count || state.locked) return;
  const k = state.k[state.i] + dir;
  if (k >= 0 && k < count) goTo(state.i, k);
};

// Wheel and trackpad: one screen per gesture, ignoring the inertia tail
let acc = 0, last = 0, cooling = false;
wrap.addEventListener('wheel', e => {
  if (!state.fp) return;
  e.preventDefault();
  const now = performance.now(), gap = now - last;
  last = now;
  if (state.locked) return;
  if (cooling) { if (gap < 180) return; cooling = false; }
  if (gap > 220) acc = 0;
  const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
  acc += horizontal ? e.deltaX : e.deltaY;
  if (Math.abs(acc) < 40) return;
  const dir = Math.sign(acc);
  acc = 0;
  cooling = true;
  if (horizontal) moveSlide(dir); else move(dir);
}, { passive: false });

// Touch swipes
let tx = 0, ty = 0;
wrap.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
wrap.addEventListener('touchmove', e => { if (state.fp) e.preventDefault(); }, { passive: false });
wrap.addEventListener('touchend', e => {
  if (!state.fp) return;
  const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return;
  if (Math.abs(dx) > Math.abs(dy)) moveSlide(dx < 0 ? 1 : -1); else move(dy < 0 ? 1 : -1);
});

// Keyboard
document.addEventListener('keydown', e => {
  if (!state.fp || e.altKey || e.ctrlKey || e.metaKey) return;
  const target = e.target as Element;
  if (target.closest('input, select, textarea, [contenteditable]')) return;
  switch (e.key) {
    case 'ArrowDown': case 'PageDown': move(1); break;
    case 'ArrowUp': case 'PageUp': move(-1); break;
    case ' ': if (target.closest('a, button')) return; move(e.shiftKey ? -1 : 1); break;
    case 'Home': goTo(0); break;
    case 'End': goTo(sections.length - 1); break;
    case 'ArrowRight': moveSlide(1); break;
    case 'ArrowLeft': moveSlide(-1); break;
    default: return;
  }
  e.preventDefault();
});

// Links, dots, tabs and step buttons
document.addEventListener('click', e => {
  const target = e.target as Element;
  const tab = target.closest<HTMLElement>('[data-slide]');
  if (tab) { goTo(sections.indexOf(tab.closest('.fp-section')!), Number(tab.dataset.slide), { force: true }); return; }
  const step = target.closest<HTMLElement>('[data-slide-dir]');
  if (step) { state.i = sections.indexOf(step.closest('.fp-section')!); moveSlide(Number(step.dataset.slideDir)); return; }
  const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || !state.fp) return;
  const destination = names.get(link.getAttribute('href')!.slice(1));
  if (!destination) return;
  e.preventDefault();
  goTo(destination.s, destination.k, { force: true });
});

// Keep keyboard focus on screen
document.addEventListener('focusin', e => {
  if (!state.fp) return;
  const target = e.target as Element;
  const section = target.closest<HTMLElement>('.fp-section');
  if (!section) return;
  const s = sections.indexOf(section);
  const slide = target.closest<HTMLElement>('.slide');
  const k = slide ? slidesOf(s).indexOf(slide) : null;
  if (s !== state.i || (k != null && k !== state.k[s])) goTo(s, k, { force: true });
});
const pin = (el: HTMLElement) => el.addEventListener('scroll', () => { el.scrollTop = 0; el.scrollLeft = 0; });
pin(wrap);
document.querySelectorAll<HTMLElement>('.slides').forEach(pin);

// Hash links (#cloud, #projects, #chains-api …)
const fromHash = (instant: boolean) => {
  let name = '';
  try { name = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const destination = names.get(name);
  if (!destination) return;
  if (state.fp) goTo(destination.s, destination.k, { force: true, instant });
  else { state.i = destination.s; if (destination.k != null) state.k[destination.s] = destination.k; }
};
addEventListener('hashchange', () => fromHash(false));

// Full-page on large screens when every screen fits; normal scrolling otherwise
const fits = () => sections.every(section => section.scrollHeight <= section.clientHeight + 4)
  && [...document.querySelectorAll<HTMLElement>('.slide')].every(slide => (slide.firstElementChild as HTMLElement).offsetHeight <= slide.clientHeight + 4);
function evaluate() {
  let fp = innerWidth >= 1100 && innerHeight >= 640;
  if (fp) { html.classList.add('fp-on'); fp = fits(); }
  const changed = fp !== state.fp;
  state.fp = fp;
  html.classList.toggle('fp-on', fp);
  if (fp) {
    wrap.scrollTop = 0;
    render(true);
  } else if (changed) {
    track.style.transform = '';
    body.dataset.accent = 'cyan';
    sections.forEach(section => { const slideTrack = section.querySelector<HTMLElement>('.slides-track'); if (slideTrack) slideTrack.style.transform = ''; });
    const slide = slidesOf(state.i)[state.k[state.i]];
    (slide && state.k[state.i] > 0 ? slide : sections[state.i]).scrollIntoView();
  }
}
let resizeTimer: ReturnType<typeof setTimeout> | undefined;
addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(evaluate, 150); });
fromHash(true);
evaluate();
document.fonts?.ready.then(evaluate);
