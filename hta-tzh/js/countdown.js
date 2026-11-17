/**
 * COUNTDOWN CONTROLLER
 * Live countdown to the wedding ceremony
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
      const title = window.WEDDING_CONFIG?.couple?.displayTitle || "Hein Thant Aung & Thazin Htet";
      const date = window.WEDDING_CONFIG?.dateDisplay?.fullDate || "22 November 2026";
      grid.innerHTML = `
        <div class="countdown-passed" style="grid-column: 1 / -1; text-align: center; padding: 1.75rem; background: rgba(54,7,14,0.75); border: 1.5px solid var(--color-gold); border-radius: var(--radius-sm);">
          <p style="font-family: var(--font-chinese); font-size: 1.5rem; color: var(--color-gold-bright); letter-spacing: 0.16em; margin-bottom: 0.5rem;">百年好合 • 永结同心</p>
          <p style="font-family: var(--font-display); font-size: 1.35rem; color: var(--color-gold-bright); letter-spacing: 0.1em; margin-bottom: 0.5rem;">Happily Ever After</p>
          <p style="font-family: var(--font-sans); font-size: var(--text-sm); line-height: 1.75; color: var(--color-text-muted);">${title} were united in marriage on ${date}.<br>Thank you for celebrating this auspicious day with us.</p>
        </div>
      `;
    }
  }
}

window.WeddingCountdown = WeddingCountdown;
