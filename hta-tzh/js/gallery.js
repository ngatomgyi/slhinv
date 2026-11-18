/**
 * PRE-WEDDING GALLERY & FULLSCREEN LIGHTBOX
 * Exactly 20 Photos Showcase
 * Zero cropping with natural aspect ratios (portrait 2:3, landscape 3:2)
 * Fullscreen lightbox with touch swipe and thumbnail scrubber
 */

class WeddingGallery {
  constructor(images) {
    this.images = images || [];
    this.currentIndex = 0;

    // DOM Elements
    this.stream = document.getElementById('gallery-stream');
    this.modal = document.getElementById('lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.counterEl = document.getElementById('lightbox-counter');
    this.thumbsTrack = document.getElementById('lightbox-thumbs-track');
    this.prevBtn = document.getElementById('lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next');
    this.closeBtn = document.getElementById('lightbox-close');

    // Touch gesture tracking
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
  }

  renderShowcase() {
    if (!this.stream || !this.images.length) return;

    const makeCard = (idx, customClass = '') => {
      const img = this.images[idx];
      if (!img) return '';
      const isLandscape = img.aspect === 'landscape';
      const aspectClass = isLandscape ? 'photo-aspect-landscape' : 'photo-aspect-portrait';
      return `
        <figure class="photo-card ${aspectClass} ${customClass} reveal-item" data-index="${idx}" role="button" tabindex="0" aria-label="View photo ${idx + 1} full screen">
          <img class="photo-img" src="${img.src}" alt="Pre-wedding photo ${idx + 1}" loading="${idx < 4 ? 'eager' : 'lazy'}" decoding="async">
          <div class="photo-zoom-hint" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </div>
        </figure>
      `;
    };

    let html = '';
    let i = 0;

    // 1. Grand Opener (Photo 1 / index 0)
    if (this.images[0]) {
      html += `
        <div class="gallery-row-single">
          ${makeCard(0, 'card-opener')}
        </div>
      `;
      i = 1;
    }

    // Dynamic row composition based on aspect ratios
    while (i < this.images.length) {
      const curr = this.images[i];
      const next = this.images[i + 1];

      if (!next) {
        html += `
          <div class="gallery-row-single">
            ${makeCard(i, 'card-epilogue')}
          </div>
        `;
        i += 1;
      } else if (curr.aspect === 'landscape') {
        if (next.aspect === 'landscape' && i === this.images.length - 2) {
          html += `
            <div class="gallery-row-duo">
              ${makeCard(i)}
              ${makeCard(i + 1, 'delay-1')}
            </div>
          `;
          i += 2;
        } else {
          html += `
            <div class="gallery-row-panorama">
              ${makeCard(i, 'card-panorama')}
            </div>
          `;
          i += 1;
        }
      } else {
        if (next && next.aspect === 'portrait') {
          html += `
            <div class="gallery-row-duo">
              ${makeCard(i)}
              ${makeCard(i + 1, 'delay-1')}
            </div>
          `;
          i += 2;
        } else {
          html += `
            <div class="gallery-row-single">
              ${makeCard(i)}
            </div>
          `;
          i += 1;
        }
      }
    }

    this.stream.innerHTML = html;
  }

  renderLightboxThumbs() {
    if (!this.thumbsTrack || !this.images.length) return;

    this.thumbsTrack.innerHTML = this.images
      .map(
        (img, idx) => `
        <button class="lightbox-thumb-btn ${idx === 0 ? 'active' : ''}" data-thumb-index="${idx}" type="button" aria-label="Jump to photo ${idx + 1}">
          <img src="${img.src}" alt="Thumbnail ${idx + 1}" loading="lazy">
        </button>
      `
      )
      .join('');
  }

  bindEvents() {
    // Card clicks
    if (this.stream) {
      this.stream.addEventListener('click', (e) => {
        const card = e.target.closest('.photo-card');
        if (card) {
          const idx = parseInt(card.getAttribute('data-index'), 10);
          if (!isNaN(idx)) this.open(idx);
        }
      });

      this.stream.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const card = e.target.closest('.photo-card');
          if (card) {
            e.preventDefault();
            const idx = parseInt(card.getAttribute('data-index'), 10);
            if (!isNaN(idx)) this.open(idx);
          }
        }
      });
    }

    // Lightbox Controls
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

    // Thumbnail Clicks
    if (this.thumbsTrack) {
      this.thumbsTrack.addEventListener('click', (e) => {
        const btn = e.target.closest('.lightbox-thumb-btn');
        if (btn) {
          const idx = parseInt(btn.getAttribute('data-thumb-index'), 10);
          if (!isNaN(idx)) this.goTo(idx);
        }
      });
    }

    // Click outside image closes modal
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal || e.target.classList.contains('lightbox-stage')) {
          this.close();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Touch Swipe Gestures
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
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
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
    this.lightboxImg.style.transform = 'scale(0.97)';

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
    }, 90);

    // Update Counter (01 / 20 format)
    if (this.counterEl) {
      this.counterEl.textContent = `${String(this.currentIndex + 1).padStart(2, '0')} / ${String(this.images.length).padStart(2, '0')}`;
    }

    // Sync Thumbnails Track
    if (this.thumbsTrack) {
      const allThumbs = this.thumbsTrack.querySelectorAll('.lightbox-thumb-btn');
      allThumbs.forEach((thumb, idx) => {
        const isActive = (idx === this.currentIndex);
        thumb.classList.toggle('active', isActive);
        if (isActive) {
          thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    }
  }
}

window.WeddingGallery = WeddingGallery;
