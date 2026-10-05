const menu = document.querySelector<HTMLButtonElement>('.menu-toggle');
const nav = document.querySelector<HTMLElement>('#primary-nav');
const setMenu = (open: boolean) => {
  menu?.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('is-open', open);
};
menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
const languageSelect = document.querySelector<HTMLSelectElement>('[data-language-select]');
languageSelect?.addEventListener('change', () => { window.location.assign(languageSelect.value); });
nav?.addEventListener('focusout', event => {
  if (event.relatedTarget instanceof Node && !nav.contains(event.relatedTarget) && !menu?.contains(event.relatedTarget)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
});
document.addEventListener('click', event => {
  if (menu?.getAttribute('aria-expanded') === 'true' && event.target instanceof Node && !nav?.contains(event.target) && !menu.contains(event.target)) setMenu(false);
});
const wide = window.matchMedia('(min-width: 1001px)');
wide.addEventListener('change', event => { if (event.matches) setMenu(false); });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector<HTMLButtonElement>('.motion-toggle');
let paused = false;
try { paused = localStorage.getItem('johnaverse-motion') === 'paused'; } catch { /* Storage can be disabled. */ }
const applyMotion = () => {
  const stop = paused || reduceMotion.matches;
  document.documentElement.dataset.motion = stop ? 'paused' : 'running';
  if (motionButton) {
    motionButton.disabled = reduceMotion.matches;
    motionButton.textContent = reduceMotion.matches ? motionButton.dataset.reducedText ?? 'Reduced motion' : paused ? motionButton.dataset.resumeText ?? 'Resume motion' : motionButton.dataset.pauseText ?? 'Pause motion';
  }
  if (stop) document.getAnimations().forEach(animation => { if (animation.effect instanceof KeyframeEffect && animation.effect.target instanceof Element && animation.effect.target.hasAttribute('data-reveal')) animation.finish(); });
};
motionButton?.addEventListener('click', () => {
  if (reduceMotion.matches) return;
  paused = !paused;
  try { localStorage.setItem('johnaverse-motion', paused ? 'paused' : 'running'); } catch { /* Preference still works for this visit. */ }
  applyMotion();
});
reduceMotion.addEventListener('change', applyMotion);
applyMotion();

// Content is visible in HTML; animations enhance it without a hidden initial state.
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target as HTMLElement;
      if (!paused && !reduceMotion.matches && element.animate) {
        const delay = parseInt(getComputedStyle(element).getPropertyValue('--reveal-delay')) || 0;
        element.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 600, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
      }
      revealObserver.unobserve(element);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
  const ambientObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-offscreen', !entry.isIntersecting)));
  document.querySelectorAll('[data-ambient]').forEach(element => ambientObserver.observe(element));
}
document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('page-hidden', document.hidden));
