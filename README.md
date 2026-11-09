# Soe Lin Htut & Htet Zar Chi — Modern Minimal Digital Wedding Invitation

A digital wedding invitation website crafted with an editorial, publication-style visual language. Understated, emotional, and responsive.

Designed for couples, art directors, and wedding planners who appreciate quiet luxury, spacious layouts, warm ivory tones, delicate hairlines, and editorial typography.

---

## Features

- **Cinematic Opening Screen**: Minimalist monogram stamp, wedding date, shimmering rule animation, and a smooth "View Invitation" transition.
- **Warm Editorial Color Palette**: Warm ivory (`#FAF7F2`), charcoal typography (`#1D1C1A`), and restrained sage/taupe accents (`#5F6B56`, `#8C7E72`).
- **Asymmetrical Editorial Layouts**: Fluid clamp typography, Kinfolk / Vogue inspired column hierarchy, and intentional image cropping.
- **Live Wedding Countdown**: Real-time ticker for days, hours, minutes, and seconds, with battery-conscious background suspension and graceful post-wedding retrospective state.
- **Event Itinerary & Logistics**: Multi-stage schedule (Aperitivo, Ceremony, Dinner, Dancing), dress code guidance, travel boat shuttle notes.
- **Interactive Venue & Navigation**: Direct Google Maps navigation link, one-click venue address clipboard copy, and toggleable interactive map preview.
- **Calendar Integration**: One-click Google Calendar event generation + direct `.ics` file download for Apple Calendar and Outlook.
- **Curated Photo Gallery**: Asymmetrical editorial grid with 9 curated moments, subtle hover lift, and touch-enabled fullscreen lightbox with swipe gestures, keyboard navigation, and image counter.
- **Dual-Engine Ambient Music**: Soothing acoustic piano/strings soundtrack with animated equalizer indicator, graceful volume fade, and Web Audio API synthesizer fallback. Respects browser autoplay policies.
- **Client-Side RSVP**: Joyfully Accepts / Regretfully Declines toggle, guest count, course selection, and dietary notes. Direct submission via WhatsApp link or clipboard confirmation.
- **Zero Backend / 100% Static**: Pure HTML5, CSS3, and modular vanilla JavaScript. Zero dependencies, zero build steps, and instant load time.
- **Subdirectory Compatible**: Uses strict relative paths (`./`) so it runs at the domain root (`https://example.com/`) or any subdirectory (`https://example.com/wedding-2/`).
- **Accessibility & Motion**: Fully respects `prefers-reduced-motion` media queries for motion-sensitive guests.

---

## Project Structure

```
digivite/
├── index.html              # Main HTML markup
├── config.js               # Central configuration file (customize all content here)
├── README.md               # Documentation & deployment guide
├── css/
│   ├── variables.css       # Color palette, font tokens, spacing, z-indexes
│   ├── reset.css           # Modern CSS reset
│   ├── base.css            # Editorial typography rules, buttons, hairlines
│   ├── components.css      # Intro screen, hero, countdown, details, gallery, lightbox, RSVP
│   └── animations.css      # Keyframes, clip reveals, ken-burns, reduced-motion overrides
├── js/
│   ├── app.js              # Application orchestrator & dynamic data binding
│   ├── audio.js            # Dual-engine audio controller & waveform visualizer
│   ├── countdown.js        # Live countdown timer & past event state
│   ├── gallery.js          # Photo gallery & touch swipe lightbox
│   ├── calendar.js         # ICS & Google Calendar generator
│   ├── rsvp.js             # WhatsApp & direct clipboard RSVP handler
│   └── config.js -> ../config.js (symlink)
└── assets/
    ├── images/             # Optimized WebP wedding photography & SVG favicon
    └── audio/
        └── ambient.mp3     # Soothing ambient acoustic melody (32-sec loop)
```

---

## Customization Guide

All text, dates, images, music, and contact details are controlled in **`config.js`**. You do not need to modify HTML to update details.

### 1. Couple Names & Monogram
```javascript
couple: {
  partner1: { firstName: "Elena", lastName: "Vance", role: "Bride" },
  partner2: { firstName: "Julian", lastName: "Thorne", role: "Groom" },
  initials: "E & J",
  displayTitle: "Elena & Julian"
}
```

### 2. Wedding Date & Timezone
```javascript
eventDate: "2027-09-18T16:00:00", // ISO format (YYYY-MM-DDTHH:mm:ss)
timezone: "Europe/Rome",
timezoneLabel: "CET (GMT+1)",
dateDisplay: {
  dayOfWeek: "Saturday",
  fullDate: "September 18, 2027",
  time: "4:00 PM"
}
```

### 3. Venue & Maps
```javascript
venue: {
  name: "Villa Balbiano",
  tagline: "Historic 16th-century Italian Palazzo",
  address: "Piazza Cardinal Durini 5, 22010 Ossuccio CO, Italy",
  mapsUrl: "https://maps.google.com/?q=Villa+Balbiano+Ossuccio+Italy",
  embedMapUrl: "https://www.google.com/maps/embed?..." // Optional embed iframe
}
```

### 4. RSVP & WhatsApp Number
```javascript
rsvp: {
  deadline: "2027-07-15",
  whatsappNumber: "+393401234567", // E.164 phone format for wa.me dispatch
  mealOptions: [
    "Braised Beef Tenderloin & Truffle Polenta",
    "Pan-Roasted Mediterranean Sea Bass",
    "Wild Mushroom & Aged Carnaroli Risotto (Vegetarian)",
    "Chef's Special Dietary Selection"
  ]
}
```

### 5. Replacing Images & Audio
- **Hero Image**: Place your portrait in `assets/images/hero.webp` (or change the path in `config.js`).
- **Story Image**: Place in `assets/images/story.webp`.
- **Gallery Images**: Add your photos into `assets/images/` and update `config.gallery.images` array with titles and captions.
- **Audio File**: Place an MP3 file in `assets/audio/ambient.mp3` and update `config.music.file`.

---

## Local Development & Preview

Because the site is 100% static, you can preview it immediately using Python's built-in web server:

```bash
cd digivite
python3 -m http.server 8080
```

Open `http://localhost:8080` in your web browser.

To test under a subdirectory (such as `/wedding-2/`):
```bash
mkdir -p /tmp/site-test/wedding-2
cp -r /root/digivite/* /tmp/site-test/wedding-2/
python3 -m http.server 8080 --directory /tmp/site-test
```
Then navigate to `http://localhost:8080/wedding-2/`. All assets and scripts will load with zero broken paths.

---

## Deployment to Cloudflare Pages

### Method 1: Git Integration (Recommended)
1. Push this repository to your GitHub or GitLab account.
2. In the **Cloudflare Dashboard**, navigate to **Compute (Workers & Pages)** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Configure Build Settings:
   - **Framework preset**: `None`
   - **Build command**: *(Leave blank)*
   - **Build output directory**: `.` (or root folder)
5. Click **Save and Deploy**. Your site will be live on `*.pages.dev` with global CDN caching and free SSL.

### Method 2: Direct Upload via Wrangler CLI
```bash
npm install -g wrangler
wrangler pages deploy /root/digivite --project-name=wedding-invitation
```

---

## Mobile & Cross-Browser Verification

- **iOS Safari**: Smooth touch scrolling, momentum deceleration, touch swipe on gallery lightbox.
- **Android Chrome**: Responsive clamp typography without horizontal overflow.
- **Autoplay Compliance**: Music stays muted until the user taps "View Invitation" or the floating audio button.
