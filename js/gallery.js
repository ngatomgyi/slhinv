/**
 * UNTOUCHED EDITORIAL PHOTO SHOWCASE & FULLSCREEN LIGHTBOX
 * 
 * Guarantees:
 * 1. ZERO CROPPING: Every portrait photo renders at natural 2:3 aspect ratio, landscape at 3:2.
 * 2. NO CAPTIONS: Removed all text titles, subtitles, badges, and numbers per user request.
 * 3. TAP TO ENLARGE: Clicking any photo opens the fullscreen Lightbox with swipe and thumbnail navigation.
 */

class WeddingGallery {
  constructor(images, containerSelector) {
    this.images = images || [];
    this.currentIndex = 0;

    // DOM Elements
    this.storybookStream = document.getElementById('gallery-storybook-stream');
    this.modal = document.getElementById('lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.counterEl = document.getElementById('lightbox-counter');
    this.captionTitleEl = document.getElementById('lightbox-caption-title');
    this.captionSubtitleEl = document.getElementById('lightbox-caption-subtitle');
    this.thumbsTrack = document.getElementById('lightbox-thumbs-track');
    this.prevBtn = document.getElementById('lightbox-prev');
    this.nextBtn = document.getElementById('lightbox-next');
    this.closeBtn = document.getElementById('lightbox-close');

    // Hide any caption containers in lightbox to maintain clean visual aesthetic
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
    this.renderLightboxThumbs();
    this.bindEvents();
  }

  renderShowcase() {
    if (!this.storybookStream || !this.images.length) return;

    // Helper to generate a clean photo card without any captions or badges
    const makeCard = (idx, customClass = '') => {
      const img = this.images[idx];
      if (!img) return '';
      const isLandscape = img.aspect === 'landscape';
      const aspectClass = isLandscape ? 'photo-aspect-landscape' : 'photo-aspect-portrait';
      return `
        <figure class="editorial-photo-card ${aspectClass} ${customClass} reveal-item" data-index="${idx}" role="button" tabindex="0" aria-label="Open photo ${idx + 1}">
          <div class="photo-frame">
            <img class="photo-img" src="${img.src}" alt="Pre-wedding photo ${idx + 1}" loading="${idx < 3 ? 'eager' : 'lazy'}" decoding="async">
            <div class="photo-zoom-hint" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </div>
          </div>
        </figure>
      `;
    };

    let html = '';

    // 1. Opener Portrait (Photo 0) - Centerpiece
    if (this.images[0]) {
      html += `
        <div class="photo-layout-single photo-layout-opener">
          ${makeCard(0, 'card-opener')}
        </div>
      `;
    }

    // 2. Duo Portraits (Photos 1 & 2)
    if (this.images[1] || this.images[2]) {
      html += `
        <div class="photo-layout-duo">
          ${makeCard(1)}
          ${makeCard(2)}
        </div>
      `;
    }

    // 3. Panoramic Landscape (Photo 3) - Full width uncropped 3:2
    if (this.images[3]) {
      html += `
        <div class="photo-layout-panorama">
          ${makeCard(3, 'card-panorama')}
        </div>
      `;
    }

    // 4. Duo Portraits (Photos 4 & 5)
    if (this.images[4] || this.images[5]) {
      html += `
        <div class="photo-layout-duo">
          ${makeCard(4)}
          ${makeCard(5)}
        </div>
      `;
    }

    // 5. Duo Portraits (Photos 6 & 7)
    if (this.images[6] || this.images[7]) {
      html += `
        <div class="photo-layout-duo">
          ${makeCard(6)}
          ${makeCard(7)}
        </div>
      `;
    }

    // 6. Duo Portraits (Photos 8 & 9)
    if (this.images[8] || this.images[9]) {
      html += `
        <div class="photo-layout-duo">
          ${makeCard(8)}
          ${makeCard(9)}
        </div>
      `;
    }

    // 7. Epilogue Portrait (Photo 10 and any beyond)
    if (this.images[10]) {
      html += `
        <div class="photo-layout-single photo-layout-epilogue">
          ${makeCard(10, 'card-epilogue')}
        </div>
      `;
    }

    // Additional photos if any
    if (this.images.length > 11) {
      let extra = '';
      for (let i = 11; i < this.images.length; i++) {
        extra += makeCard(i);
      }
      html += `<div class="photo-layout-duo">${extra}</div>`;
    }

    this.storybookStream.innerHTML = html;
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
    // Click on photo opens Lightbox
    if (this.storybookStream) {
      this.storybookStream.addEventListener('click', (e) => {
        const card = e.target.closest('.editorial-photo-card');
        if (card) {
          const index = parseInt(card.getAttribute('data-index'), 10);
          if (!isNaN(index)) {
            this.open(index);
          }
        }
      });

      this.storybookStream.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const card = e.target.closest('.editorial-photo-card');
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

    // Keyboard navigation
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
