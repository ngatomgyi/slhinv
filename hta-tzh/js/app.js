/**
 * APPLICATION ORCHESTRATOR
 * Creative Direction: Luxury Chinese-Myanmar Wedding Invitation
 * Couple: Hein Thant Aung & Thazin Htet
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.WEDDING_CONFIG || {};

  // 1. Populate Dynamic Text & Metadata from Config
  populateDetails(config);

  // 2. Audio Controller
  const audio = new window.WeddingAudioController(config.music);

  // 3. Opening Envelope Ceremony
  setupIntroScreen(audio);

  // 4. Live Countdown
  if (config.eventDate) {
    new window.WeddingCountdown(config.eventDate, '#countdown');
  }

  // 5. Pre-Wedding Gallery (Exactly 20 Photos)
  if (config.gallery?.images) {
    new window.WeddingGallery(config.gallery.images);
  }

  // 6. Calendar Integration
  setupCalendar(config);

  // 7. Venue Interactions (Google Maps & Copy Address)
  setupVenueInteractions(config);

  // 8. Scroll Reveal Animations (IntersectionObserver)
  setupScrollReveals();
});

function populateDetails(config) {
  const couple = config.couple || {};
  const venue = config.venue || {};
  const dateDisplay = config.dateDisplay || {};

  // Document Title
  document.title = `${couple.displayTitle || 'Hein Thant Aung & Thazin Htet'} — Wedding Invitation`;

  // Monogram & Display Titles
  document.querySelectorAll('.conf-initials').forEach((el) => {
    el.textContent = couple.initials || 'H & T';
  });

  // Intro Screen
  setElemText('#intro-names-1', couple.partner1?.fullName || 'Hein Thant Aung');
  setElemText('#intro-names-2', couple.partner2?.fullName || 'Thazin Htet');
  setElemText('#intro-date', `${dateDisplay.fullDate || '22 November 2026'} • ဝါးခယ်မမြို့`);

  // Hero Section
  setElemText('#hero-name-1', couple.partner1?.fullName || 'Hein Thant Aung');
  setElemText('#hero-name-2', couple.partner2?.fullName || 'Thazin Htet');
  setElemText('#hero-date-val', `${dateDisplay.fullDate || '22 November 2026'} (${dateDisplay.dayOfWeek || 'Sunday'})`);
  setElemText('#hero-time-val', dateDisplay.time || '9:00 AM – 12:00 PM');
  setElemText('#hero-venue-val', venue.burmeseName || 'ဟိုစိန်တရုတ်ဘုံကျောင်း၊ ဝါးခယ်မမြို့');

  const heroImg = document.getElementById('hero-portrait-img');
  if (heroImg && config.hero?.image) {
    heroImg.src = config.hero.image;
    heroImg.alt = config.hero.imageAlt || 'Hein Thant Aung & Thazin Htet';
  }

  // Formal Invitation Section
  setElemText('#invitation-burmese-heading', config.invitation?.burmeseHeading || 'မင်္ဂလာဖိတ်ကြားလွှာ');
  setElemText('#invitation-title', config.invitation?.heading || 'We Request The Honour Of Your Presence');
  setElemText('#invitation-hosts', config.invitation?.hosts || 'Together with our Families');

  const invBodyEl = document.getElementById('invitation-body-content');
  if (invBodyEl && config.invitation?.body) {
    invBodyEl.innerHTML = config.invitation.body.map((p) => `<p>${p}</p>`).join('');
  }

  // Venue Card
  setElemText('#venue-burmese-name', venue.burmeseName || 'ဟိုစိန်တရုတ်ဘုံကျောင်း၊ ဝါးခယ်မမြို့');
  setElemText('#venue-english-name', venue.name ? `${venue.name} • ${venue.city}` : 'Wakema, Myanmar');

  // Closing Section
  setElemText('#closing-title', config.closing?.heading);
  setElemText('#closing-chinese-blessing', config.closing?.chineseBlessing);
  setElemText('#closing-text', config.closing?.text);
  setElemText('#closing-footer', config.closing?.footerText);
}

function setElemText(selector, text) {
  if (!text) return;
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function setupIntroScreen(audio) {
  const introScreen = document.getElementById('intro-screen');
  const openBtn = document.getElementById('btn-open-invitation');
  const skipBtn = document.getElementById('btn-skip-intro');

  if (!introScreen) return;

  document.body.classList.add('intro-active');

  const dismissIntro = (fast = false) => {
    if (introScreen.classList.contains('dismissed')) return;

    if (fast) {
      introScreen.classList.add('dismissed');
      document.body.classList.remove('intro-active');
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (audio) audio.play();
      setTimeout(() => { introScreen.style.display = 'none'; }, 400);
      return;
    }

    // Cinematic Envelope Flap Open Animation
    introScreen.classList.add('opening');

    setTimeout(() => {
      introScreen.classList.add('dismissed');
      document.body.classList.remove('intro-active');
      window.scrollTo({ top: 0, behavior: 'instant' });

      if (audio) {
        setTimeout(() => audio.play(), 150);
      }

      // Choreographed Hero Entrance
      const hero = document.getElementById('hero');
      if (hero) {
        setTimeout(() => hero.querySelector('.hero-emblem-wrap')?.classList.add('is-revealed'), 100);
        setTimeout(() => hero.querySelector('.hero-name-1')?.classList.add('is-revealed'), 250);
        setTimeout(() => hero.querySelector('.hero-ampersand')?.classList.add('is-revealed'), 420);
        setTimeout(() => hero.querySelector('.hero-name-2')?.classList.add('is-revealed'), 580);
        setTimeout(() => hero.querySelector('.hero-visual-frame')?.classList.add('is-revealed'), 500);
        setTimeout(() => hero.querySelector('.hero-meta-list')?.classList.add('is-revealed'), 750);
      }

      setTimeout(() => {
        introScreen.style.display = 'none';
      }, 1000);
    }, 350);
  };

  if (openBtn) openBtn.addEventListener('click', () => dismissIntro(false));
  if (skipBtn) skipBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissIntro(true);
  });

  // Enter key dismisses intro
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !introScreen.classList.contains('dismissed')) {
      dismissIntro(false);
    }
  });
}

function setupCalendar(config) {
  const calendar = new window.WeddingCalendar(config);

  const googleBtn = document.getElementById('btn-add-google-cal');
  if (googleBtn) {
    googleBtn.href = calendar.getGoogleCalendarUrl();
    googleBtn.target = '_blank';
    googleBtn.rel = 'noopener noreferrer';
  }

  const icsBtn = document.getElementById('btn-add-ics-cal');
  if (icsBtn) {
    icsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calendar.downloadICS();
    });
  }
}

function setupVenueInteractions(config) {
  // Google Maps Button
  const mapsBtn = document.getElementById('btn-open-maps');
  if (mapsBtn && config.venue?.mapsUrl) {
    mapsBtn.href = config.venue.mapsUrl;
    mapsBtn.target = '_blank';
    mapsBtn.rel = 'noopener noreferrer';
  }

  // Copy Venue Name Button
  const copyBtn = document.getElementById('btn-copy-address');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const address = config.venue?.burmeseName || 'ဟိုစိန်တရုတ်ဘုံကျောင်း၊ ဝါးခယ်မမြို့';
      const performCopy = () => {
        showToast('✓ ဖိတ်ကြားလွှာတည်နေရာ ကူးယူပြီးပါပြီ');
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(performCopy).catch(() => {
          fallbackCopyText(address);
          performCopy();
        });
      } else {
        fallbackCopyText(address);
        performCopy();
      }
    });
  }
}

function setupScrollReveals() {
  const elements = document.querySelectorAll('.reveal-item, .reveal-card, .photo-card, .mask-reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -30px 0px',
      threshold: 0.05
    }
  );

  elements.forEach((el) => observer.observe(el));
}

function showToast(msg) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Fallback copy failed', err);
  }
  document.body.removeChild(textArea);
}
