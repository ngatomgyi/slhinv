/**
 * EDITORIAL GALLERY & TOUCH LIGHTBOX CONTROLLER
 * Fullscreen modal, touch swipe support, keyboard nav, and image counter
 */

class WeddingGallery {
  constructor(images, containerSelector) {
    this.images = images || [];
    this.container = document.querySelector(containerSelector);
    this.currentIndex = 0;

    // Lightbox DOM elements
    this.modal = document.getElementById('lightbox-modal');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.counterEl = document.getElementById('lightbox-counter');
    this.captionTitleEl = document.getElementById('lightbox-caption-title');
    this.captionSubtitleEl = document.getElementById('lightbox-caption-subtitle');
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
    this.renderGrid();
    this.bindEvents();
  }

  renderGrid() {
    if (!this.container || !this.images.length) return;

    this.container.innerHTML = this.images
      .map((img, idx) => {
        const paddedIndex = String(idx + 1).padStart(2, '0');
        return `
          <div class="gallery-item reveal-item delay-${(idx % 4) + 1}" data-index="${idx}" role="button" tabindex="0" aria-label="View photo: ${img.title || 'Wedding moment'}">
            <div class="gallery-item-inner">
              <img class="gallery-img" src="${img.thumb || img.src}" alt="${img.title || 'Wedding photography'}" loading="lazy" decoding="async">
              <span class="gallery-overlay-badge">${paddedIndex}</span>
              <div class="gallery-caption-overlay">
                <p class="gallery-caption-title">${img.title || ''}</p>
                <p class="gallery-caption-sub">${img.subtitle || ''}</p>
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  bindEvents() {
    // Gallery item clicks
    if (this.container) {
      this.container.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
          const index = parseInt(item.getAttribute('data-index'), 10);
          this.open(index);
        }
      });

      this.container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const item = e.target.closest('.gallery-item');
          if (item) {
            e.preventDefault();
            const index = parseInt(item.getAttribute('data-index'), 10);
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

    // Touch Swipe Gestures for Mobile
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

  handleSwipe() {
    const diffX = this.touchEndX - this.touchStartX;
    const diffY = this.touchEndY - this.touchStartY;

    // Only detect swipe if horizontal distance exceeds vertical movement
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
      if (diffX < 0) {
        // Swiped Left -> Next
        this.next();
      } else {
        // Swiped Right -> Previous
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
      this.lightboxImg.alt = current.title || 'Wedding photography';
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
  }
}

window.WeddingGallery = WeddingGallery;
