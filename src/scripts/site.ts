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
const notFound = document.querySelector<HTMLElement>('[data-localized-404]');
if (notFound && languageSelect) {
  try {
    const translations = JSON.parse(notFound.dataset['404Copy'] ?? '{}') as Record<string, { title: string; body: string; eyebrow: string; backTo: string; skip: string; language: string; home: string; github: string; navLabel: string; menu: string; connect: string; domains: Record<string, string>; homeFooter: string; footerHeading: string; footerAccent: string; toronto: string; motionPause: string; motionResume: string; motionReduced: string; copyright: string }>;
    const requestedLocale = window.location.pathname.split('/').filter(Boolean)[0] ?? 'en';
    const locale = translations[requestedLocale] ? requestedLocale : 'en';
    const text = translations[locale];
    const root = locale === 'en' ? '/' : `/${locale}/`;
    document.documentElement.lang = locale;
    document.title = `${text.title} — Johnaverse`;
    notFound.querySelector('[data-404-eyebrow]')!.textContent = text.eyebrow;
    notFound.querySelector('[data-404-title]')!.textContent = text.title;
    notFound.querySelector('[data-404-body]')!.textContent = text.body;
    notFound.querySelector<HTMLAnchorElement>('[data-404-home]')!.href = root;
    notFound.querySelector<HTMLAnchorElement>('[data-404-home]')!.firstChild!.textContent = `${text.backTo} `;
    document.querySelector<HTMLAnchorElement>('.skip-link')!.textContent = text.skip;
    document.querySelector<HTMLElement>('#primary-nav')!.setAttribute('aria-label', text.navLabel);
    document.querySelector<HTMLAnchorElement>('[data-header-home]')!.setAttribute('aria-label', text.home);
    document.querySelector<HTMLAnchorElement>('[data-header-home]')!.href = root;
    document.querySelector<HTMLAnchorElement>('.footer-brand')!.href = root;
    document.querySelector<HTMLAnchorElement>('.nav-github')!.setAttribute('aria-label', text.github);
    document.querySelector<HTMLElement>('[data-header-menu]')!.textContent = text.menu;
    document.querySelector<HTMLAnchorElement>('[data-header-contact]')!.firstChild!.textContent = `${text.connect} `;
    document.querySelectorAll<HTMLAnchorElement>('[data-domain-nav]').forEach(link => {
      const domain = link.dataset.domainNav ?? '';
      link.textContent = text.domains[domain] ?? link.textContent;
      link.href = `${root}${domain}/`;
    });
    document.querySelector<HTMLElement>('[data-footer-eyebrow]')!.textContent = text.homeFooter;
    document.querySelector<HTMLElement>('[data-footer-heading]')!.textContent = text.footerHeading;
    document.querySelector<HTMLElement>('[data-footer-accent]')!.textContent = text.footerAccent;
    document.querySelector<HTMLElement>('[data-footer-location]')!.textContent = `Johnathan L. · ${text.toronto}`;
    document.querySelectorAll<HTMLAnchorElement>('[data-footer-domain]').forEach(link => {
      const domain = link.dataset.footerDomain ?? '';
      link.textContent = text.domains[domain] ?? link.textContent;
      link.href = `${root}${domain}/`;
    });
    const motionButton = document.querySelector<HTMLButtonElement>('.motion-toggle');
    if (motionButton) {
      motionButton.dataset.pauseText = text.motionPause;
      motionButton.dataset.resumeText = text.motionResume;
      motionButton.dataset.reducedText = text.motionReduced;
      motionButton.textContent = text.motionPause;
    }
    document.querySelector<HTMLElement>('[data-footer-copyright]')!.textContent = text.copyright.replace('{year}', String(new Date().getFullYear()));
    languageSelect.value = root;
    languageSelect.setAttribute('aria-label', text.language);
    if (languageSelect.previousElementSibling) languageSelect.previousElementSibling.textContent = text.language;
  } catch { /* The static English 404 remains usable if localization data cannot be read. */ }
}
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
