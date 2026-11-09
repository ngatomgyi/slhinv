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
    new window.WeddingGallery(config.gallery.images, '#gallery-grid');
  }

  // 6. Initialize Calendar Integration
  setupCalendar(config);

  // 7. Initialize RSVP Handler
  new window.WeddingRSVP(config.rsvp);

  // 8. Setup Venue Interactions (Copy Address & Map Toggle)
  setupVenueInteractions(config);

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
  setElemText('#intro-quote', config.intro?.quote);
  setElemText('#intro-date', `${dateDisplay.fullDate || 'September 18, 2027'} • ${venue.name || 'Lake Como'}`);

  // Hero Section
  setElemText('#hero-name-1', couple.partner1?.firstName || 'Elena');
  setElemText('#hero-name-2', couple.partner2?.firstName || 'Julian');
  setElemText('#hero-date-val', dateDisplay.fullDate || 'September 18, 2027');
  setElemText('#hero-time-val', `${dateDisplay.time || '4:00 PM'} ${config.timezoneLabel || ''}`);
  setElemText('#hero-venue-val', venue.name || 'Villa Balbiano, Como');

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

  const dismissIntro = () => {
    introScreen.classList.add('dismissed');

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
