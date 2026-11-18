/**
 * APPLICATION ORCHESTRATOR
 * Creative Direction: Luxury Chinese Imperial Red & Champagne Gold
 * Couple: Hein Thant Aung & Thazin Htet
 * Language: English Only (Preserving exact Burmese venue name)
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

  // 8. Far Gift / Auspicious Blessings Interactions
  setupGiftInteractions(config);

  // 9. Scroll Reveal Animations (IntersectionObserver)
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
  setElemText('#intro-badge', config.intro?.badge || 'Wedding Invitation');
  setElemText('#intro-chinese-blessing', config.intro?.chineseTitle || '百年好合 • 永结同心');
  const introSub = document.getElementById('intro-subtitle');
  if (introSub) {
    if (config.intro?.subtitle) {
      introSub.textContent = config.intro.subtitle;
    } else {
      introSub.remove();
    }
  }
  setElemText('#intro-names-1', couple.partner1?.fullName || 'Hein Thant Aung');
  setElemText('#intro-names-2', couple.partner2?.fullName || 'Thazin Htet');
  setElemText('#intro-date', `Sunday, ${dateDisplay.fullDate || '22 November 2026'}`);

  // Hero Section
  setElemText('#hero-name-1', couple.partner1?.fullName || 'Hein Thant Aung');
  setElemText('#hero-name-2', couple.partner2?.fullName || 'Thazin Htet');
  setElemText('#hero-date-val', `${dateDisplay.fullDate || '22 November 2026'} (${dateDisplay.dayOfWeek || 'Sunday'})`);
  setElemText('#hero-time-val', dateDisplay.time || '9:00 AM – 12:00 PM');
  setElemText('#hero-venue-val', venue.addressDisplay || 'Ho Seng Chinese Temple, Wakema');

  const heroImg = document.getElementById('hero-portrait-img');
  if (heroImg && config.hero?.image) {
    heroImg.src = config.hero.image;
    heroImg.alt = config.hero.imageAlt || 'Hein Thant Aung & Thazin Htet';
  }

  // Formal Invitation Section
  setElemText('#invitation-eyebrow', config.invitation?.subheading || 'Together with our Families');
  setElemText('#invitation-title', config.invitation?.heading || 'We Request The Honour Of Your Presence');
  setElemText('#invitation-hosts', config.invitation?.hosts || 'Together with our Families');

  const invBodyEl = document.getElementById('invitation-body-content');
  if (invBodyEl && config.invitation?.body) {
    invBodyEl.innerHTML = config.invitation.body.map((p) => `<p>${p}</p>`).join('');
  }

  // Venue Card (English Location)
  setElemText('#venue-name', venue.name || 'Ho Seng Chinese Temple');
  setElemText('#venue-city', venue.city || 'Wakema, Myanmar');

  // Far Gift Section
  const gift = config.gift || {};
  setElemText('#gift-eyebrow', gift.eyebrow || 'Wedding Gift');
  setElemText('#gift-title', gift.title || 'Auspicious Blessings');
  setElemText('#gift-chinese-blessing', gift.chineseBlessing || '添福添喜 • 佳偶天成');
  setElemText('#gift-subtitle', gift.subtitle);
  setElemText('#gift-recipient', gift.recipient || 'Thazin Htet');
  setElemText('#gift-phone-display', gift.phoneDisplay || gift.phone || '09 960 795 330');

  // Closing Section
  setElemText('#closing-chinese-blessing', config.closing?.chineseBlessing || '白头偕老 • 幸福美满');
  setElemText('#closing-title', config.closing?.heading || 'With Heartfelt Gratitude');
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

  if (!introScreen) return;

  document.body.classList.add('intro-active');

  const dismissIntro = () => {
    if (introScreen.classList.contains('dismissed')) return;

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
        setTimeout(() => hero.querySelectorAll('.mask-reveal').forEach((el) => el.classList.add('is-revealed')), 250);
        setTimeout(() => hero.querySelector('.hero-amp-reveal')?.classList.add('is-revealed'), 420);
        setTimeout(() => hero.querySelector('.hero-visual-frame')?.classList.add('is-revealed'), 500);
        setTimeout(() => hero.querySelector('.hero-meta-list')?.classList.add('is-revealed'), 750);
      }

      setTimeout(() => {
        introScreen.style.display = 'none';
      }, 1000);
    }, 350);
  };

  if (openBtn) openBtn.addEventListener('click', dismissIntro);

  // Enter key dismisses intro
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !introScreen.classList.contains('dismissed')) {
      dismissIntro();
    }
  });
}

function setupCalendar(config) {
  const calendar = new window.WeddingCalendar(config);

  const saveDateBtn = document.getElementById('btn-save-date') || document.getElementById('btn-add-ics-cal');
  if (saveDateBtn) {
    saveDateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      calendar.downloadICS();
    });
  }

  const googleBtn = document.getElementById('btn-add-google-cal');
  if (googleBtn) {
    googleBtn.href = calendar.getGoogleCalendarUrl();
    googleBtn.target = '_blank';
    googleBtn.rel = 'noopener noreferrer';
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
        showToast('✓ Venue location copied to clipboard');
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

function setupGiftInteractions(config) {
  const giftPhone = config.gift?.phone || '09960795330';
  const copyBtn = document.getElementById('btn-copy-kpay');
  const qrWrap = document.getElementById('gift-qr-plate');

  const copyNumber = () => {
    const onDone = () => showToast(`✓ KBZPay number copied: ${giftPhone}`);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(giftPhone).then(onDone).catch(() => {
        fallbackCopyText(giftPhone);
        onDone();
      });
    } else {
      fallbackCopyText(giftPhone);
      onDone();
    }
  };

  if (copyBtn) copyBtn.addEventListener('click', copyNumber);
  if (qrWrap) qrWrap.addEventListener('click', copyNumber);
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
