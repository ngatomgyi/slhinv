/**
 * OPTION 1: HORIZONTAL EDITORIAL FILMSTRIP & FULLSCREEN LIGHTBOX
 * 
 * Features:
 * 1. ZERO CROPPING: Every portrait photo renders at natural 2:3 aspect ratio, landscape at 3:2.
 * 2. HORIZONTAL EDITORIAL FILMSTRIP: Smooth CSS scroll-snap track with adjacent card peek.
 * 3. DYNAMIC STATUS & PROGRESS: Synced 01/11 pill counter and animated gold progress bar.
 * 4. FULLSCREEN LIGHTBOX: Tap any card to enlarge with smooth crossfade, touch swipe, and thumbnails.
 */

class WeddingGallery {
  constructor(images) {
    this.images = images || [];
    this.currentIndex = 0;

    // Filmstrip DOM Elements
    this.filmstripTrack = document.getElementById('gallery-filmstrip-track');
    this.filmstripPrevBtn = document.getElementById('filmstrip-prev-btn');
    this.filmstripNextBtn = document.getElementById('filmstrip-next-btn');
    this.filmstripActiveNum = document.getElementById('filmstrip-active-num');
    this.filmstripTotalNum = document.getElementById('filmstrip-total-num');
    this.filmstripProgressBar = document.getElementById('filmstrip-progress-bar');

    // Lightbox DOM Elements
    this.modal = document.getElementById('lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.counterEl = document.getElementById('lightbox-counter');
    this.captionTitleEl = document.getElementById('lightbox-caption-title');
    this.captionSubtitleEl = document.getElementById('lightbox-caption-subtitle');
    this.thumbsTrack = document.getElementById('lightbox-thumbs-track');
    this.prevBtn = document.getElementById('lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next');
    this.closeBtn = document.getElementById('lightbox-close');

    // Clean aesthetic: hide text captions in lightbox
    if (this.captionTitleEl) this.captionTitleEl.style.display = 'none';
    if (this.captionSubtitleEl) this.captionSubtitleEl.style.display = 'none';

    // Touch gesture state
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.touchEndY = 0;

    this.init();
  }

  init() {
    this.renderShowcase();
    this.setupFilmstripSync();
    this.renderLightboxThumbs();
    this.bindEvents();
  }

  renderShowcase() {
    if (!this.filmstripTrack || !this.images.length) return;

    this.filmstripTrack.innerHTML = this.images
      .map((img, idx) => {
        const isLandscape = img.aspect === 'landscape';
        const aspectClass = isLandscape ? 'photo-aspect-landscape' : 'photo-aspect-portrait';
        return `
          <figure class="filmstrip-photo-card ${aspectClass} ${idx === 0 ? 'is-filmstrip-active' : ''} reveal-item" data-index="${idx}" role="button" tabindex="0" aria-label="Open photo ${idx + 1} full screen">
            <div class="filmstrip-photo-frame">
              <img class="filmstrip-photo-img" src="${img.src}" alt="Pre-wedding photo ${idx + 1}" loading="${idx < 3 ? 'eager' : 'lazy'}" decoding="async">
              <div class="filmstrip-zoom-hint" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
              </div>
            </div>
          </figure>
        `;
      })
      .join('');
  }

  setupFilmstripSync() {
    if (!this.filmstripTrack) return;

    const cards = this.filmstripTrack.querySelectorAll('.filmstrip-photo-card');
    const total = cards.length;
    if (this.filmstripTotalNum) {
      this.filmstripTotalNum.textContent = String(total).padStart(2, '0');
    }

    let ticking = false;

    const updateActiveState = () => {
      const trackRect = this.filmstripTrack.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;

      let closestIdx = 0;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(trackCenter - cardCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      // Update active card styling
      cards.forEach((card, idx) => {
        card.classList.toggle('is-filmstrip-active', idx === closestIdx);
      });

      // Update counter pill
      if (this.filmstripActiveNum) {
        this.filmstripActiveNum.textContent = String(closestIdx + 1).padStart(2, '0');
      }

      // Update progress bar
      if (this.filmstripProgressBar) {
        const maxScroll = this.filmstripTrack.scrollWidth - this.filmstripTrack.clientWidth;
        if (maxScroll > 0) {
          const ratio = Math.max(0, Math.min(1, this.filmstripTrack.scrollLeft / maxScroll));
          const basePct = (1 / total) * 100;
          const progress = basePct + ratio * (100 - basePct);
          this.filmstripProgressBar.style.width = `${progress.toFixed(1)}%`;
        } else {
          this.filmstripProgressBar.style.width = `${(((closestIdx + 1) / total) * 100).toFixed(1)}%`;
        }
      }

      ticking = false;
    };

    this.filmstripTrack.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveState);
        ticking = true;
      }
    }, { passive: true });

    // Initial positioning check
    setTimeout(updateActiveState, 100);

    // Bind Filmstrip Arrow Navigation
    if (this.filmstripPrevBtn) {
      this.filmstripPrevBtn.addEventListener('click', () => {
        const activeCard = this.filmstripTrack.querySelector('.filmstrip-photo-card.is-filmstrip-active') || cards[0];
        const step = activeCard ? activeCard.offsetWidth + 20 : 340;
        this.filmstripTrack.scrollBy({ left: -step, behavior: 'smooth' });
      });
    }

    if (this.filmstripNextBtn) {
      this.filmstripNextBtn.addEventListener('click', () => {
        const activeCard = this.filmstripTrack.querySelector('.filmstrip-photo-card.is-filmstrip-active') || cards[0];
        const step = activeCard ? activeCard.offsetWidth + 20 : 340;
        this.filmstripTrack.scrollBy({ left: step, behavior: 'smooth' });
      });
    }

    // Keyboard navigation when track is focused
    this.filmstripTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const activeCard = this.filmstripTrack.querySelector('.filmstrip-photo-card.is-filmstrip-active') || cards[0];
        const step = activeCard ? activeCard.offsetWidth + 20 : 340;
        this.filmstripTrack.scrollBy({ left: -step, behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const activeCard = this.filmstripTrack.querySelector('.filmstrip-photo-card.is-filmstrip-active') || cards[0];
        const step = activeCard ? activeCard.offsetWidth + 20 : 340;
        this.filmstripTrack.scrollBy({ left: step, behavior: 'smooth' });
      }
    });
  }

  renderLightboxThumbs() {
    if (!this.thumbsTrack || !this.images.length) return;

    this.thumbsTrack.innerHTML = this.images
      .map((img, idx) => {
        return `
          <button class="lightbox-thumb-btn ${idx === 0 ? 'active' : ''}" data-thumb-index="${idx}" type="button" aria-label="Photo ${idx + 1}">
            <img class="lightbox-thumb-img" src="${img.thumb || img.src}" alt="Thumbnail ${idx + 1}" loading="lazy">
          </button>
        `;
      })
      .join('');
  }

  bindEvents() {
    // Click or Enter on filmstrip card opens Lightbox
    if (this.filmstripTrack) {
      this.filmstripTrack.addEventListener('click', (e) => {
        const card = e.target.closest('.filmstrip-photo-card');
        if (card) {
          const index = parseInt(card.getAttribute('data-index'), 10);
          if (!isNaN(index)) {
            this.open(index);
          }
        }
      });

      this.filmstripTrack.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const card = e.target.closest('.filmstrip-photo-card');
          if (card) {
            e.preventDefault();
            const index = parseInt(card.getAttribute('data-index'), 10);
            if (!isNaN(index)) {
              this.open(index);
            }
          }
        }
      });
    }

    // Lightbox Controls
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

    // Thumbnail strip clicks
    if (this.thumbsTrack) {
      this.thumbsTrack.addEventListener('click', (e) => {
        const btn = e.target.closest('.lightbox-thumb-btn');
        if (btn) {
          const idx = parseInt(btn.getAttribute('data-thumb-index'), 10);
          if (!isNaN(idx)) {
            this.goTo(idx);
          }
        }
      });
    }

    // Modal background click to close
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal || e.target.classList.contains('lightbox-backdrop') || e.target.classList.contains('lightbox-viewport')) {
          this.close();
        }
      });
    }

    // Keyboard navigation in lightbox
    document.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('active')) return;

      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch Swipe Gestures on Lightbox Viewport
    if (this.modal) {
      this.modal.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      this.modal.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleTouchSwipe();
      }, { passive: true });
    }
  }

  handleTouchSwipe() {
    const diffX = this.touchEndX - this.touchStartX;
    const diffY = this.touchEndY - this.touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        this.next();
      } else {
        this.prev();
      }
    } else if (diffY > 100 && Math.abs(diffX) < 50) {
      this.close();
    }
  }

  open(index) {
    if (!this.modal || !this.images.length) return;
    this.currentIndex = (index >= 0 && index < this.images.length) ? index : 0;
    this.updateImage();

    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-locked');

    if (this.closeBtn) this.closeBtn.focus();
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-locked');
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  }

  goTo(index) {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
      this.updateImage();
    }
  }

  updateImage() {
    const imgData = this.images[this.currentIndex];
    if (!imgData || !this.lightboxImg) return;

    this.lightboxImg.style.opacity = '0';
    this.lightboxImg.style.transform = 'scale(0.98)';

    setTimeout(() => {
      this.lightboxImg.src = imgData.src;
      this.lightboxImg.alt = `Pre-wedding photo ${this.currentIndex + 1}`;

      this.lightboxImg.onload = () => {
        this.lightboxImg.style.opacity = '1';
        this.lightboxImg.style.transform = 'scale(1)';
      };

      if (this.lightboxImg.complete) {
        this.lightboxImg.style.opacity = '1';
        this.lightboxImg.style.transform = 'scale(1)';
      }
    }, 100);

    // Update Counter only (clean: no text captions)
    if (this.counterEl) {
      this.counterEl.textContent = `${String(this.currentIndex + 1).padStart(2, '0')} / ${String(this.images.length).padStart(2, '0')}`;
    }

    // Sync Thumbnail Strip
    if (this.thumbsTrack) {
      const allThumbs = this.thumbsTrack.querySelectorAll('.lightbox-thumb-btn');
      allThumbs.forEach((thumb, idx) => {
        const isActive = idx === this.currentIndex;
        thumb.classList.toggle('active', isActive);
        thumb.setAttribute('aria-current', isActive ? 'true' : 'false');
        if (isActive) {
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }
  }
}

window.WeddingGallery = WeddingGallery;
