/**
 * APPLICATION ORCHESTRATOR
 * Initializes modules and dynamically renders configured content
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.WEDDING_CONFIG || {};

  // 1. Populate Dynamic Text & Metadata from Config
  populateStaticDetails(config);

  // 2. Initialize Audio Controller
  const audio = new window.WeddingAudioController(config.music);

  // 3. Initialize Intro Screen Dismissal & Audio Play Trigger
  setupIntroScreen(audio);

  // 4. Initialize Countdown
  if (config.eventDate) {
    new window.WeddingCountdown(config.eventDate, '#countdown');
  }

  // 5. Initialize Gallery & Lightbox
  if (config.gallery?.images) {
    new window.WeddingGallery(config.gallery.images);
  }

  // 6. Initialize Calendar Integration
  setupCalendar(config);

  // 7. Setup Venue Interactions (Copy Address & Map Toggle)
  setupVenueInteractions(config);

  // 8. Initialize Digital Wedding Gifts & Blessings (KPay & Wave)
  renderGifts(config.gifts);

  // 9. Setup Scroll Reveal Animations (IntersectionObserver)
  setupScrollReveals();
});

function populateStaticDetails(config) {
  const couple = config.couple || {};
  const venue = config.venue || {};
  const dateDisplay = config.dateDisplay || {};

  // Browser Document Title
  document.title = `${couple.displayTitle || 'Elena & Julian'} — Wedding Invitation`;

  // Monograms
  document.querySelectorAll('.conf-initials').forEach((el) => {
    el.textContent = couple.initials || 'E & J';
  });

  // Display Names
  document.querySelectorAll('.conf-display-title').forEach((el) => {
    el.textContent = couple.displayTitle || 'Elena & Julian';
  });

  // Intro Screen
  setElemText('#intro-name-1', couple.partner1?.fullName || 'Soe Lin Htut');
  setElemText('#intro-name-2', couple.partner2?.fullName || 'Htet Zarchi Win');
  setElemText('#intro-date', `${dateDisplay.fullDate || 'November 15, 2026'} • ${venue.name || 'SWEN Hotel'}, Pathein`);

  // Hero Section
  setElemText('#hero-name-1', couple.partner1?.fullName || 'Soe Lin Htut');
  setElemText('#hero-name-2', couple.partner2?.fullName || 'Htet Zarchi Win');
  setElemText('#hero-date-val', dateDisplay.fullDate || 'November 15, 2026');
  const heroTime = `${dateDisplay.time || '9:00 AM to 12 PM'}${config.timezoneLabel ? ' ' + config.timezoneLabel : ''}`.trim();
  setElemText('#hero-time-val', heroTime);
  setElemText('#hero-venue-val', `${venue.name || 'SWEN Hotel'}, Pathein`);

  const heroImg = document.getElementById('hero-portrait-img');
  if (heroImg && config.hero?.image) {
    heroImg.src = config.hero.image;
    heroImg.alt = config.hero.imageAlt || 'Couple portrait';
  }

  // Invitation Message Section
  setElemText('#invitation-title', config.invitation?.heading);
  setElemText('#invitation-hosts', config.invitation?.hosts);
  
  const invBodyEl = document.getElementById('invitation-body-content');
  if (invBodyEl && config.invitation?.body) {
    invBodyEl.innerHTML = config.invitation.body.map((p) => `<p>${p}</p>`).join('');
  }

  // Story Vignettes
  renderStory(config.story);

  // Venue & Schedule
  setElemText('#venue-name', venue.name);
  setElemText('#venue-tagline', venue.tagline);
  setElemText('#venue-address-text', venue.address);
  setElemText('#dress-code-title', venue.dressCode?.title);
  setElemText('#dress-code-desc', venue.dressCode?.description);
  setElemText('#travel-note-title', venue.accommodations?.title);
  setElemText('#travel-note-desc', venue.accommodations?.description);

  renderSchedule(config.schedule);

  // Closing Section
  setElemText('#closing-title', config.closing?.heading);
  setElemText('#closing-text', config.closing?.text);
  setElemText('#closing-footer', config.closing?.footerText);
}

function setElemText(selector, text) {
  if (!text) return;
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function renderStory(storyConfig) {
  if (!storyConfig || !storyConfig.vignettes) return;

  const timelineContainer = document.getElementById('story-timeline-container');
  if (timelineContainer) {
    timelineContainer.innerHTML = storyConfig.vignettes
      .map(
        (v) => `
        <div class="story-item reveal-item">
          <p class="story-year-place">${v.year} • ${v.place}</p>
          <h4 class="story-item-title">${v.title}</h4>
          <p class="story-item-text">${v.text}</p>
        </div>
      `
      )
      .join('');
  }

  const storyImg = document.getElementById('story-portrait-img');
  if (storyImg && storyConfig.portraitImage) {
    storyImg.src = storyConfig.portraitImage;
  }
}

function renderSchedule(scheduleList) {
  if (!scheduleList || !scheduleList.length) return;
  const container = document.getElementById('schedule-list-container');
  if (!container) return;

  container.innerHTML = scheduleList
    .map(
      (item) => `
      <div class="schedule-row reveal-item">
        <span class="schedule-time">${item.time}</span>
        <div class="schedule-title-wrap">
          <span class="schedule-event-title">${item.title}</span>
          <span class="schedule-event-location">${item.location}</span>
        </div>
        <p class="schedule-event-detail">${item.detail}</p>
      </div>
    `
    )
    .join('');
}

function setupIntroScreen(audio) {
  const introScreen = document.getElementById('intro-screen');
  const viewBtn = document.getElementById('btn-view-invitation');

  if (!introScreen || !viewBtn) return;

  // Lock background webpage scrolling while intro screen is active
  document.body.classList.add('intro-active');

  const dismissIntro = () => {
    introScreen.classList.add('dismissed');
    document.body.classList.remove('intro-active');

    // Trigger subtle sound playback upon guest interaction
    if (audio) {
      setTimeout(() => {
        audio.play();
      }, 350);
    }

    // Scroll to top of main content
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  viewBtn.addEventListener('click', dismissIntro);

  // Optional: Escape key dismisses intro
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !introScreen.classList.contains('dismissed')) {
      dismissIntro();
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
  // Direct Google Maps Link
  const mapsBtn = document.getElementById('btn-open-maps');
  if (mapsBtn && config.venue?.mapsUrl) {
    mapsBtn.href = config.venue.mapsUrl;
    mapsBtn.target = '_blank';
    mapsBtn.rel = 'noopener noreferrer';
  }

  // Address Copy Button
  const copyBtn = document.getElementById('btn-copy-address');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const address = config.venue?.address || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(address).then(() => {
          showAppToast('✓ Venue address copied to clipboard');
        });
      } else {
        showAppToast('✓ ' + address);
      }
    });
  }

  // Embed Map Toggle
  const toggleMapBtn = document.getElementById('btn-toggle-map');
  const mapContainer = document.getElementById('map-embed-box');
  const mapIframe = document.getElementById('map-embed-iframe');

  if (toggleMapBtn && mapContainer && mapIframe) {
    if (config.venue?.embedMapUrl) {
      mapIframe.src = config.venue.embedMapUrl;
      toggleMapBtn.addEventListener('click', () => {
        const isActive = mapContainer.classList.toggle('active');
        toggleMapBtn.textContent = isActive ? 'Hide Map View' : 'Show Map View';
      });
    } else {
      toggleMapBtn.style.display = 'none';
    }
  }
}

function setupScrollReveals() {
  const elements = document.querySelectorAll('.reveal-item, .mask-reveal');
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
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    }
  );

  elements.forEach((el) => observer.observe(el));
}

function showAppToast(text) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function renderGifts(giftsConfig) {
  const container = document.getElementById('gift-cards-container');
  if (!container || !giftsConfig || giftsConfig.enabled === false) {
    const giftSection = document.getElementById('gifts');
    if (giftSection && giftsConfig?.enabled === false) {
      giftSection.style.display = 'none';
    }
    return;
  }

  // Update Section Header Text
  setElemText('#gift-eyebrow', giftsConfig.eyebrow);
  setElemText('#gift-title', giftsConfig.title);
  setElemText('#gift-burmese-title', giftsConfig.burmeseTitle);
  setElemText('#gift-message', giftsConfig.message);

  const accounts = giftsConfig.accounts || [];
  if (!accounts.length) return;

  container.innerHTML = accounts
    .map((acc) => {
      const isKPay = acc.id === 'kpay';
      const brandClass = isKPay ? 'gift-card-kpay' : 'gift-card-wave';
      return `
        <div class="gift-card ${brandClass} reveal-item">
          <div class="gift-card-top">
            <div class="gift-brand-badge" style="--brand-color: ${acc.brandColor}">
              <span class="gift-badge-text">${acc.badge || acc.provider}</span>
            </div>
            <span class="gift-provider-name">${acc.provider}</span>
          </div>

          <div class="gift-qr-wrapper">
            <div class="gift-qr-box" aria-label="${acc.provider} QR code (scan to transfer)">
              <img class="gift-qr-img" src="${acc.qr}" alt="${acc.provider} QR Code" loading="lazy">
            </div>
            <p class="gift-qr-hint">${acc.note || 'Scan with app to send blessing'}</p>
          </div>

          <div class="gift-info-block">
            <div class="gift-info-row">
              <span class="gift-info-label">Account Name</span>
              <strong class="gift-info-val gift-account-name">${acc.name}</strong>
            </div>

            <div class="gift-info-row">
              <span class="gift-info-label">Phone / Number</span>
              <strong class="gift-info-val gift-account-number">${acc.phone}</strong>
            </div>

            <button class="btn btn-primary gift-copy-btn" data-phone="${acc.rawPhone || acc.phone}" data-provider="${acc.provider}" type="button" aria-label="Copy ${acc.provider} number">
              <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span class="btn-copy-label">Copy Number</span>
            </button>
          </div>
        </div>
      `;
    })
    .join('');

  // 1-Tap Copy Event Listener
  container.querySelectorAll('.gift-copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rawNumber = btn.getAttribute('data-phone');
      const provider = btn.getAttribute('data-provider') || 'Account';
      const labelSpan = btn.querySelector('.btn-copy-label');

      const performCopy = () => {
        showAppToast(`✓ ${provider} number (${rawNumber}) copied to clipboard`);
        btn.classList.add('btn-copied');
        if (labelSpan) labelSpan.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.classList.remove('btn-copied');
          if (labelSpan) labelSpan.textContent = 'Copy Number';
        }, 2500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(rawNumber).then(performCopy).catch(() => {
          fallbackCopyText(rawNumber);
          performCopy();
        });
      } else {
        fallbackCopyText(rawNumber);
        performCopy();
      }
    });
  });
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
