const revealElements = document.querySelectorAll('.reveal');
const parallaxElements = document.querySelectorAll('.parallax');
const hero = document.querySelector('.hero');
const envelopeIntro = document.getElementById('envelopeIntro');
const envelopeStage = document.getElementById('envelopeStage');
const waxSeal = document.getElementById('waxSeal');
const starLayer = document.getElementById('starLayer');
const fromNames = document.getElementById('fromNames');
const rsvpForm = document.getElementById('rsvpForm');
const rsvpNote = document.getElementById('rsvpNote');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupReveal() {
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('show'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

function setupParallax() {
  if (prefersReducedMotion || parallaxElements.length === 0) return;

  let ticking = false;

  const updateParallax = () => {
    ticking = false;
    const viewportH = window.innerHeight;

    parallaxElements.forEach((el) => {
      const speed = Number(el.dataset.speed || 0.08);
      const rect = el.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - viewportH / 2;
      const translateY = centerOffset * -speed;
      el.style.transform = 'translate3d(0,' + translateY + 'px,0)';
    });
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateParallax);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateParallax();
}

function setupHeroScrollMotion() {
  if (!hero || prefersReducedMotion) return;

  let ticking = false;

  const updateHero = () => {
    ticking = false;
    const heroHeight = Math.max(hero.offsetHeight, 1);
    const progress = Math.min(1, Math.max(0, window.scrollY / heroHeight));

    hero.style.setProperty('--hero-shift', (progress * 92).toFixed(2) + 'px');
    hero.style.setProperty('--hero-scale', (1 + progress * 0.12).toFixed(3));
    hero.style.setProperty('--hero-content-shift', (progress * 48).toFixed(2) + 'px');
    hero.style.setProperty('--hero-content-opacity', (1 - progress * 1.24).toFixed(3));
    hero.style.setProperty('--hero-overlay-opacity', (1 - progress * 0.18).toFixed(3));
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHero);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateHero();
}

function setupRsvp() {
  if (!rsvpForm || !rsvpNote) return;

  rsvpForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!rsvpForm.checkValidity()) {
      rsvpNote.textContent = 'Please complete the required fields before submitting.';
      return;
    }

    const data = new FormData(rsvpForm);
    const name = (data.get('name') || 'Guest').toString().trim();
    const attendance = data.get('attendance');

    if (attendance === 'yes') {
      rsvpNote.textContent = 'Thank you, ' + name + '. We look forward to celebrating with you in Sydney.';
    } else {
      rsvpNote.textContent = 'Thank you, ' + name + '. We truly appreciate your response and kind wishes.';
    }

    rsvpForm.reset();
  });
}

function setupEnvelopeIntro() {
  if (!envelopeIntro || !envelopeStage || !waxSeal) {
    document.body.classList.remove('intro-locked');
    return;
  }

  const openEnvelope = () => {
    if (envelopeStage.classList.contains('opening')) return;

    envelopeStage.classList.add('opening');

    window.setTimeout(() => {
      triggerStarBurst();
    }, 360);

    window.setTimeout(() => {
      envelopeStage.classList.add('opened');
    }, 620);

    window.setTimeout(() => {
      envelopeIntro.classList.add('boom');
      envelopeStage.classList.add('boom');
    }, 1080);

    window.setTimeout(() => {
      envelopeIntro.classList.add('done');
      document.body.classList.remove('intro-locked');
    }, 1600);
  };

  waxSeal.addEventListener('click', openEnvelope);
}

function setupTypewriterFrom() {
  if (!fromNames) return;

  const fullText = fromNames.getAttribute('data-full-text') || '';
  fromNames.textContent = '';
  fromNames.classList.add('typing');

  let index = 0;
  const typeNext = () => {
    if (index > fullText.length) {
      window.setTimeout(() => {
        fromNames.classList.remove('typing');
      }, 400);
      return;
    }
    fromNames.textContent = fullText.slice(0, index);
    index += 1;
    window.setTimeout(typeNext, 80);
  };

  window.setTimeout(typeNext, 320);
}

function spawnGoldStar(x, y) {
  if (!starLayer) return;
  const star = document.createElement('span');
  star.className = 'gold-star';

  const size = 8 + Math.random() * 8;
  const driftX = (Math.random() - 0.5) * 220;
  const driftY = Math.random() * 30;

  star.style.left = x + driftX + 'px';
  star.style.top = y + driftY + 'px';
  star.style.width = size + 'px';
  star.style.height = size + 'px';

  starLayer.appendChild(star);
  star.addEventListener('animationend', () => star.remove());
}

function triggerStarBurst() {
  if (!waxSeal) return;
  const rect = waxSeal.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 34; i += 1) {
    window.setTimeout(() => {
      spawnGoldStar(centerX, centerY);
    }, i * 42);
  }
}

setupEnvelopeIntro();
setupTypewriterFrom();
setupReveal();
setupParallax();
setupHeroScrollMotion();
setupRsvp();
