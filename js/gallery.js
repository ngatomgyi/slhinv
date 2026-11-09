/**
 * EDITORIAL PRE-WEDDING SHOWCASE & TOUCH LIGHTBOX CONTROLLER
 * Supports:
 * 1. Dual-mode display (Editorial Reel Filmstrip + Multi-Column Masonry)
 * 2. Mobile touch-snap horizontal scrolling with real-time index indicator
 * 3. Fullscreen Lightbox with touch swipe gestures, keyboard nav, and thumbnail scrubber ribbon
 */

class WeddingGallery {
  constructor(images, containerSelector) {
    this.images = images || [];
    this.currentIndex = 0;
    this.activeView = 'reel'; // 'reel' or 'grid'

    // Showcase containers
    this.reelContainer = document.getElementById('gallery-reel-container');
    this.reelTrack = document.getElementById('gallery-reel-track');
    this.masonryContainer = document.getElementById('gallery-masonry-container');
    this.reelIndicator = document.getElementById('gallery-reel-indicator');
    this.tabReel = document.getElementById('tab-gallery-reel');
    this.tabGrid = document.getElementById('tab-gallery-grid');

    // Backward-compatible fallback for legacy #gallery-grid
    this.legacyContainer = document.getElementById('gallery-grid');

    // Lightbox DOM elements
    this.modal = document.getElementById('lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.counterEl = document.getElementById('lightbox-counter');
    this.captionTitleEl = document.getElementById('lightbox-caption-title');
    this.captionSubtitleEl = document.getElementById('lightbox-caption-subtitle');
    this.thumbsTrack = document.getElementById('lightbox-thumbs-track');
    this.prevBtn = document.getElementById('lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next');
    this.closeBtn = document.getElementById('lightbox-close');

    // Touch gesture state
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.touchEndY = 0;

    this.init();
  }

  init() {
    this.renderShowcase();
    this.renderLightboxThumbs();
    this.bindEvents();
    this.updateReelIndicator(0);
  }

  renderShowcase() {
    if (!this.images.length) return;

    // 1. Render Editorial Reel Cards
    if (this.reelTrack) {
      this.reelTrack.innerHTML = this.images
        .map((img, idx) => {
          const paddedIndex = String(idx + 1).padStart(2, '0');
          return `
            <div class="gallery-reel-card reveal-item" data-index="${idx}" role="button" tabindex="0" aria-label="View photo ${paddedIndex}: ${img.title || 'Pre-wedding moment'}">
              <div class="reel-card-img-wrap">
                <img class="reel-card-img" src="${img.src}" alt="${img.title || 'Pre-wedding photo'}" loading="${idx < 3 ? 'eager' : 'lazy'}" decoding="async">
                <span class="reel-card-badge">${paddedIndex}</span>
              </div>
              <div class="reel-card-meta">
                <h3 class="reel-card-title">${img.title || `Moment ${paddedIndex}`}</h3>
                <span class="reel-card-sub">${img.subtitle || 'Pre-Wedding Collection'}</span>
              </div>
            </div>
          `;
        })
        .join('');
    }

    // 2. Render Masonry Grid Cards
    if (this.masonryContainer) {
      this.masonryContainer.innerHTML = this.images
        .map((img, idx) => {
          const paddedIndex = String(idx + 1).padStart(2, '0');
          return `
            <div class="gallery-masonry-card reveal-item" data-index="${idx}" role="button" tabindex="0" aria-label="View photo ${paddedIndex}: ${img.title || 'Pre-wedding moment'}">
              <div class="masonry-card-img-wrap">
                <img class="masonry-card-img" src="${img.thumb || img.src}" alt="${img.title || 'Pre-wedding photo'}" loading="lazy" decoding="async">
                <span class="masonry-card-badge">${paddedIndex}</span>
              </div>
              <div class="masonry-card-meta">
                <h4 class="masonry-card-title">${img.title || `Moment ${paddedIndex}`}</h4>
                <span class="masonry-card-sub">${img.subtitle || 'Pre-Wedding'}</span>
              </div>
            </div>
          `;
        })
        .join('');
    }

    // 3. Fallback for legacy markup
    if (this.legacyContainer && !this.reelTrack) {
      this.legacyContainer.innerHTML = this.images
        .map((img, idx) => {
          const paddedIndex = String(idx + 1).padStart(2, '0');
          return `
            <div class="gallery-item" data-index="${idx}" role="button" tabindex="0">
              <div class="gallery-item-inner">
                <img class="gallery-img" src="${img.src}" alt="${img.title || ''}" loading="lazy">
                <span class="gallery-overlay-badge">${paddedIndex}</span>
              </div>
            </div>
          `;
        })
        .join('');
    }
  }

  renderLightboxThumbs() {
    if (!this.thumbsTrack || !this.images.length) return;

    this.thumbsTrack.innerHTML = this.images
      .map((img, idx) => {
        return `
          <button class="lightbox-thumb-btn ${idx === 0 ? 'active' : ''}" data-thumb-index="${idx}" type="button" aria-label="Navigate to photo ${idx + 1}">
            <img class="lightbox-thumb-img" src="${img.thumb || img.src}" alt="Thumbnail ${idx + 1}" loading="lazy">
          </button>
        `;
      })
      .join('');
  }

  bindEvents() {
    // View Switcher (Reel vs Grid)
    if (this.tabReel && this.tabGrid) {
      this.tabReel.addEventListener('click', () => this.switchView('reel'));
      this.tabGrid.addEventListener('click', () => this.switchView('grid'));
    }

    // Reel Card Clicks
    if (this.reelTrack) {
      this.reelTrack.addEventListener('click', (e) => {
        const card = e.target.closest('.gallery-reel-card');
        if (card) {
          const index = parseInt(card.getAttribute('data-index'), 10);
          this.open(index);
        }
      });
      this.reelTrack.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const card = e.target.closest('.gallery-reel-card');
          if (card) {
            e.preventDefault();
            const index = parseInt(card.getAttribute('data-index'), 10);
            this.open(index);
          }
        }
      });

      // Track scroll on reel to update indicator
      let scrollTimer = null;
      this.reelTrack.addEventListener('scroll', () => {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          this.calculateActiveReelIndex();
        }, 60);
      }, { passive: true });
    }

    // Masonry Card Clicks
    if (this.masonryContainer) {
      this.masonryContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.gallery-masonry-card');
        if (card) {
          const index = parseInt(card.getAttribute('data-index'), 10);
          this.open(index);
        }
      });
      this.masonryContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const card = e.target.closest('.gallery-masonry-card');
          if (card) {
            e.preventDefault();
            const index = parseInt(card.getAttribute('data-index'), 10);
            this.open(index);
          }
        }
      });
    }

    // Lightbox Controls
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.prev();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.next();
      });
    }

    // Lightbox Thumbnail Ribbon Clicks
    if (this.thumbsTrack) {
      this.thumbsTrack.addEventListener('click', (e) => {
        const thumb = e.target.closest('.lightbox-thumb-btn');
        if (thumb) {
          const index = parseInt(thumb.getAttribute('data-thumb-index'), 10);
          this.goTo(index);
        }
      });
    }

    // Modal background click closes lightbox
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal || e.target.classList.contains('lightbox-stage')) {
          this.close();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen()) return;

      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });

    // Touch Swipe Gestures on Lightbox
    const stage = document.querySelector('.lightbox-stage');
    if (stage) {
      stage.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      stage.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe();
      }, { passive: true });
    }
  }

  switchView(mode) {
    this.activeView = mode;

    if (mode === 'reel') {
      if (this.tabReel) {
        this.tabReel.classList.add('active');
        this.tabReel.setAttribute('aria-selected', 'true');
      }
      if (this.tabGrid) {
        this.tabGrid.classList.remove('active');
        this.tabGrid.setAttribute('aria-selected', 'false');
      }
      if (this.reelContainer) {
        this.reelContainer.classList.add('active');
        this.reelContainer.removeAttribute('hidden');
      }
      if (this.masonryContainer) {
        this.masonryContainer.classList.remove('active');
        this.masonryContainer.setAttribute('hidden', '');
      }
      if (this.reelIndicator) this.reelIndicator.style.display = 'block';
    } else {
      if (this.tabGrid) {
        this.tabGrid.classList.add('active');
        this.tabGrid.setAttribute('aria-selected', 'true');
      }
      if (this.tabReel) {
        this.tabReel.classList.remove('active');
        this.tabReel.setAttribute('aria-selected', 'false');
      }
      if (this.masonryContainer) {
        this.masonryContainer.classList.add('active');
        this.masonryContainer.removeAttribute('hidden');
      }
      if (this.reelContainer) {
        this.reelContainer.classList.remove('active');
        this.reelContainer.setAttribute('hidden', '');
      }
      if (this.reelIndicator) this.reelIndicator.style.display = 'none';
    }
  }

  calculateActiveReelIndex() {
    if (!this.reelTrack) return;
    const cards = this.reelTrack.querySelectorAll('.gallery-reel-card');
    if (!cards.length) return;

    const trackRect = this.reelTrack.getBoundingClientRect();
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

    this.updateReelIndicator(closestIdx);
  }

  updateReelIndicator(index) {
    if (!this.reelIndicator || !this.images.length) return;
    const currentPad = String(index + 1).padStart(2, '0');
    const totalPad = String(this.images.length).padStart(2, '0');
    this.reelIndicator.textContent = `${currentPad} / ${totalPad}`;
  }

  handleSwipe() {
    const diffX = this.touchEndX - this.touchStartX;
    const diffY = this.touchEndY - this.touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
      if (diffX < 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  isOpen() {
    return this.modal && this.modal.classList.contains('active');
  }

  open(index) {
    if (!this.modal || !this.images.length) return;
    this.currentIndex = (index >= 0 && index < this.images.length) ? index : 0;
    this.updateModal();
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  goTo(index) {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
      this.updateModal();
    }
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateModal();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateModal();
  }

  updateModal() {
    const current = this.images[this.currentIndex];
    if (!current) return;

    if (this.lightboxImg) {
      this.lightboxImg.style.opacity = '0.3';
      this.lightboxImg.src = current.src;
      this.lightboxImg.alt = current.title || 'Pre-wedding photography';
      this.lightboxImg.onload = () => {
        this.lightboxImg.style.opacity = '1';
      };
    }

    if (this.counterEl) {
      const currentPad = String(this.currentIndex + 1).padStart(2, '0');
      const totalPad = String(this.images.length).padStart(2, '0');
      this.counterEl.textContent = `${currentPad} / ${totalPad}`;
    }

    if (this.captionTitleEl) {
      this.captionTitleEl.textContent = current.title || '';
    }

    if (this.captionSubtitleEl) {
      this.captionSubtitleEl.textContent = current.subtitle || '';
    }

    // Sync active thumbnail in ribbon
    if (this.thumbsTrack) {
      const allThumbs = this.thumbsTrack.querySelectorAll('.lightbox-thumb-btn');
      allThumbs.forEach((thumb, idx) => {
        if (idx === this.currentIndex) {
          thumb.classList.add('active');
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          thumb.classList.remove('active');
        }
      });
    }
  }
}

window.WeddingGallery = WeddingGallery;
