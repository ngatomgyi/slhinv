/**
 * EDITORIAL PRE-WEDDING STORYBOOK & FULLSCREEN LIGHTBOX CONTROLLER
 * 
 * Features:
 * 1. Curated editorial magazine layout (Hero spreads, intimate duos, panoramic cinema, asymmetric trios).
 * 2. Natural vertical storytelling flow without clumsy horizontal scroll traps.
 * 3. Mobile-first touch tap anywhere to open full-resolution Lightbox.
 * 4. Lightbox features: Touch swipe gestures, Keyboard navigation, Bottom thumbnail scrubber bar.
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

    // Touch gesture state
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.touchStartY = 0;
    this.touchEndY = 0;

    this.init();
  }

  init() {
    this.renderStorybook();
    this.renderLightboxThumbs();
    this.bindEvents();
  }

  // Convert index to Roman numeral for editorial charm
  toRoman(num) {
    const roman = {
      1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
      6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X', 11: 'XI', 12: 'XII'
    };
    return roman[num] || String(num).padStart(2, '0');
  }

  renderStorybook() {
    if (!this.storybookStream || !this.images.length) return;

    let html = '';
    const total = this.images.length;

    // Helper to generate a single photo frame
    const makeCard = (idx, customClass = '', showMeta = true) => {
      const img = this.images[idx];
      if (!img) return '';
      const roman = this.toRoman(idx + 1);
      const padded = String(idx + 1).padStart(2, '0');
      return `
        <article class="storybook-card ${customClass} reveal-item" data-index="${idx}" role="button" tabindex="0" aria-label="Open photo ${padded}: ${img.title || 'Pre-wedding portrait'}">
          <div class="storybook-frame">
            <img class="storybook-img" src="${img.src}" alt="${img.title || 'Pre-wedding photo'}" loading="${idx < 3 ? 'eager' : 'lazy'}" decoding="async">
            <div class="storybook-badge-strip">
              <span class="storybook-badge-num">${roman}</span>
              <span class="storybook-badge-tag">${img.subtitle || 'Chapter'}</span>
            </div>
            <div class="storybook-expand-indicator" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
              </svg>
            </div>
          </div>
          ${showMeta ? `
            <header class="storybook-card-header">
              <span class="storybook-card-index">${padded} / ${String(total).padStart(2, '0')}</span>
              <h3 class="storybook-card-title">${img.title || `Moment ${padded}`}</h3>
              <p class="storybook-card-sub">${img.subtitle || 'SWEN Hotel • Pathein'}</p>
            </header>
          ` : ''}
        </article>
      `;
    };

    // 1. Spread 1: Flagship Hero Opener (Photo 0)
    if (this.images[0]) {
      html += `
        <div class="storybook-spread spread-hero">
          ${makeCard(0, 'card-hero', true)}
        </div>
      `;
    }

    // 2. Spread 2: Intimate Duo (Photos 1 & 2)
    if (this.images[1] || this.images[2]) {
      html += `
        <div class="storybook-spread spread-duo">
          ${makeCard(1, 'card-duo-left', true)}
          ${makeCard(2, 'card-duo-right', true)}
        </div>
      `;
    }

    // 3. Spread 3: Panoramic Cinema Horizon (Photo 3)
    if (this.images[3]) {
      html += `
        <div class="storybook-spread spread-panorama">
          ${makeCard(3, 'card-panorama', true)}
          <div class="storybook-editorial-interlude reveal-item">
            <blockquote class="storybook-interlude-quote">“To love and to be loved is to feel the sun from both sides.”</blockquote>
            <cite class="storybook-interlude-cite">Soe Lin Htut &amp; Htet Zar Chi</cite>
          </div>
        </div>
      `;
    }

    // 4. Spread 4: Asymmetric Trio (Photos 4, 5, 6)
    if (this.images[4] || this.images[5] || this.images[6]) {
      html += `
        <div class="storybook-spread spread-trio">
          <div class="spread-trio-main">
            ${makeCard(4, 'card-trio-dominant', true)}
          </div>
          <div class="spread-trio-stack">
            ${makeCard(5, 'card-trio-sub', true)}
            ${makeCard(6, 'card-trio-sub', true)}
          </div>
        </div>
      `;
    }

    // 5. Spread 5: Dramatic Centerpiece Portrait (Photo 7)
    if (this.images[7]) {
      html += `
        <div class="storybook-spread spread-centerpiece">
          <div class="spread-centerpiece-inner">
            ${makeCard(7, 'card-centerpiece', true)}
          </div>
        </div>
      `;
    }

    // 6. Spread 6: Twilight Sunset Duo (Photos 8 & 9)
    if (this.images[8] || this.images[9]) {
      html += `
        <div class="storybook-spread spread-duo spread-duo-twilight">
          ${makeCard(8, 'card-duo-left', true)}
          ${makeCard(9, 'card-duo-right', true)}
        </div>
      `;
    }

    // 7. Spread 7: Intimate Epilogue Frame (Photo 10 and beyond)
    if (this.images[10]) {
      html += `
        <div class="storybook-spread spread-closing">
          ${makeCard(10, 'card-closing-hero', true)}
        </div>
      `;
    }

    // Any extra photos beyond index 10
    if (total > 11) {
      let extraHtml = '';
      for (let i = 11; i < total; i++) {
        extraHtml += makeCard(i, 'card-duo-left', true);
      }
      html += `<div class="storybook-spread spread-duo">${extraHtml}</div>`;
    }

    this.storybookStream.innerHTML = html;
  }

  renderLightboxThumbs() {
    if (!this.thumbsTrack || !this.images.length) return;

    this.thumbsTrack.innerHTML = this.images
      .map((img, idx) => {
        return `
          <button class="lightbox-thumb-btn ${idx === 0 ? 'active' : ''}" data-thumb-index="${idx}" type="button" aria-label="View photo ${idx + 1}">
            <img class="lightbox-thumb-img" src="${img.thumb || img.src}" alt="Thumbnail ${idx + 1}" loading="lazy">
          </button>
        `;
      })
      .join('');
  }

  bindEvents() {
    // Click on Storybook card opens Lightbox
    if (this.storybookStream) {
      this.storybookStream.addEventListener('click', (e) => {
        const card = e.target.closest('.storybook-card');
        if (card) {
          const index = parseInt(card.getAttribute('data-index'), 10);
          if (!isNaN(index)) {
            this.open(index);
          }
        }
      });

      this.storybookStream.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const card = e.target.closest('.storybook-card');
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

    // Ensure horizontal gesture is stronger than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        this.next(); // Swiped left -> next
      } else {
        this.prev(); // Swiped right -> prev
      }
    } else if (diffY > 100 && Math.abs(diffX) < 50) {
      // Swipe down to dismiss
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

    // Cross-fade effect
    this.lightboxImg.style.opacity = '0';
    this.lightboxImg.style.transform = 'scale(0.98)';

    setTimeout(() => {
      this.lightboxImg.src = imgData.src;
      this.lightboxImg.alt = imgData.title || 'Pre-wedding photo';

      this.lightboxImg.onload = () => {
        this.lightboxImg.style.opacity = '1';
        this.lightboxImg.style.transform = 'scale(1)';
      };

      // Fallback in case image is already cached
      if (this.lightboxImg.complete) {
        this.lightboxImg.style.opacity = '1';
        this.lightboxImg.style.transform = 'scale(1)';
      }
    }, 120);

    // Update Counter
    if (this.counterEl) {
      this.counterEl.textContent = `${String(this.currentIndex + 1).padStart(2, '0')} / ${String(this.images.length).padStart(2, '0')}`;
    }

    // Update Caption
    if (this.captionTitleEl) {
      this.captionTitleEl.textContent = imgData.title || `Moment ${String(this.currentIndex + 1).padStart(2, '0')}`;
    }
    if (this.captionSubtitleEl) {
      this.captionSubtitleEl.textContent = imgData.subtitle || 'Pre-Wedding Collection';
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

// Make accessible to window
window.WeddingGallery = WeddingGallery;
