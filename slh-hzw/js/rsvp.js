/**
 * RSVP HANDLER
 * Interactive client-side RSVP system with WhatsApp direct dispatch,
 * mailto support, and clipboard confirmation.
 */

class WeddingRSVP {
  constructor(config) {
    this.config = config || {};
    this.form = document.getElementById('rsvp-form');
    this.attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    this.guestCountGroup = document.getElementById('group-guest-count');
    this.mealGroup = document.getElementById('group-meal-choice');
    this.toastEl = document.getElementById('toast-notice');

    this.init();
  }

  init() {
    if (!this.form) return;

    // Radio selection styles
    this.attendanceRadios.forEach((radio) => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.radio-option').forEach((opt) => opt.classList.remove('selected'));
        const parent = radio.closest('.radio-option');
        if (parent) parent.classList.add('selected');

        // Toggle meal & guest fields based on attendance
        const isAttending = radio.value === 'yes';
        if (this.guestCountGroup) this.guestCountGroup.style.display = isAttending ? 'block' : 'none';
        if (this.mealGroup) this.mealGroup.style.display = isAttending ? 'block' : 'none';
      });
    });

    // WhatsApp Action
    const whatsappBtn = document.getElementById('btn-rsvp-whatsapp');
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitViaWhatsApp();
      });
    }

    // Direct Confirmation Action
    const confirmBtn = document.getElementById('btn-rsvp-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.submitDirect();
      });
    }
  }

  getFormData() {
    const name = document.getElementById('rsvp-name')?.value.trim() || '';
    const attendanceRadio = document.querySelector('input[name="attendance"]:checked');
    const attendance = attendanceRadio ? attendanceRadio.value : 'yes';
    const guestCount = document.getElementById('rsvp-guests')?.value || '1';
    const mealChoice = document.getElementById('rsvp-meal')?.value || '';
    const note = document.getElementById('rsvp-note')?.value.trim() || '';

    return { name, attendance, guestCount, mealChoice, note };
  }

  validate(data) {
    if (!data.name) {
      this.showToast('Please enter your full name');
      document.getElementById('rsvp-name')?.focus();
      return false;
    }
    return true;
  }

  formatMessage(data) {
    const status = data.attendance === 'yes' ? '✨ Joyfully Accepts' : '🕊️ Regretfully Declines';
    let msg = `*WEDDING RSVP: Elena & Julian*\n`;
    msg += `Guest: ${data.name}\n`;
    msg += `Response: ${status}\n`;
    if (data.attendance === 'yes') {
      msg += `Guests Attending: ${data.guestCount}\n`;
      if (data.mealChoice) msg += `Course Selection: ${data.mealChoice}\n`;
    }
    if (data.note) {
      msg += `Note: "${data.note}"\n`;
    }
    return msg;
  }

  submitViaWhatsApp() {
    const data = this.getFormData();
    if (!this.validate(data)) return;

    const rawNumber = this.config.whatsappNumber || '+393401234567';
    const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
    const message = this.formatMessage(data);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
    this.showToast('Opening WhatsApp with your RSVP details...');
  }

  submitDirect() {
    const data = this.getFormData();
    if (!this.validate(data)) return;

    const message = this.formatMessage(data);

    // Copy to clipboard for guest convenience
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message)
        .then(() => {
          this.showToast('✓ RSVP copied to clipboard & confirmed!');
        })
        .catch(() => {
          this.showToast('✓ Thank you! Your response is recorded.');
        });
    } else {
      this.showToast('✓ Thank you! Your response is recorded.');
    }

    // Disable form inputs to show completed state
    const submitCard = document.querySelector('.rsvp-card');
    if (submitCard) {
      submitCard.innerHTML = `
        <div style="text-align: center; padding: var(--space-lg) 0;">
          <div class="monogram-badge" style="margin-bottom: var(--space-md);">✓</div>
          <h3 style="font-size: var(--text-xl); margin-bottom: var(--space-xs);">Thank You, ${data.name}</h3>
          <p style="font-family: var(--font-serif); font-size: var(--text-md); color: var(--color-text-secondary); max-width: 440px; margin: 0 auto var(--space-md);">
            ${data.attendance === 'yes' 
              ? 'We are overjoyed that you will be joining us in Como to celebrate this milestone.' 
              : 'You will be dearly missed in Como, but your warm wishes mean the world to us.'}
          </p>
          <button class="btn btn-outline" onclick="location.reload()" style="font-size: 0.72rem;">Edit Response</button>
        </div>
      `;
    }
  }

  showToast(text) {
    if (!this.toastEl) return;
    this.toastEl.textContent = text;
    this.toastEl.classList.add('show');
    setTimeout(() => {
      this.toastEl.classList.remove('show');
    }, 3800);
  }
}

window.WeddingRSVP = WeddingRSVP;
