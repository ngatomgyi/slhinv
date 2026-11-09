/**
 * COUNTDOWN CONTROLLER
 * Live countdown to the wedding ceremony with graceful past-event handling
 */

class WeddingCountdown {
  constructor(targetDateString, containerSelector) {
    this.targetDate = new Date(targetDateString);
    this.container = document.querySelector(containerSelector);
    this.daysEl = document.getElementById('count-days');
    this.hoursEl = document.getElementById('count-hours');
    this.minutesEl = document.getElementById('count-minutes');
    this.secondsEl = document.getElementById('count-seconds');
    this.timerInterval = null;

    if (isNaN(this.targetDate.getTime())) {
      console.warn('Invalid event date provided for countdown:', targetDateString);
      return;
    }

    this.init();
  }

  init() {
    this.update();
    this.start();

    // Optimize performance: pause ticker when page is backgrounded
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.update();
        this.start();
      }
    });
  }

  start() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.update(), 1000);
  }

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatNumber(val) {
    return String(Math.max(0, val)).padStart(2, '0');
  }

  update() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    // Past event handling
    if (distance <= 0) {
      this.stop();
      this.renderPastEvent();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (this.daysEl) this.daysEl.textContent = this.formatNumber(days);
    if (this.hoursEl) this.hoursEl.textContent = this.formatNumber(hours);
    if (this.minutesEl) this.minutesEl.textContent = this.formatNumber(minutes);
    if (this.secondsEl) this.secondsEl.textContent = this.formatNumber(seconds);
  }

  renderPastEvent() {
    const grid = document.querySelector('.countdown-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="countdown-passed" style="grid-column: 1 / -1;">
          <p style="font-size: var(--text-xl); margin-bottom: 0.5rem; color: var(--color-text-main);">Happily Ever After</p>
          <p>Elena &amp; Julian were married on September 18, 2027.<br>Thank you to everyone who shared in celebrating this timeless memory.</p>
        </div>
      `;
    }
  }
}

window.WeddingCountdown = WeddingCountdown;
