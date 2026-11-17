/**
 * WEDDING INVITATION CONFIGURATION
 * DigiVite — Invitation No. 02
 * Couple: Hein Thant Aung & Thazin Htet
 * Creative Direction: Luxury Chinese Imperial Red & Champagne Gold
 * Language: English & Traditional Chinese (Burmese Removed)
 */

window.WEDDING_CONFIG = {
  // Couple Information
  couple: {
    partner1: {
      firstName: "Hein Thant Aung",
      lastName: "",
      fullName: "Hein Thant Aung",
      role: "Groom"
    },
    partner2: {
      firstName: "Thazin Htet",
      lastName: "",
      fullName: "Thazin Htet",
      role: "Bride"
    },
    initials: "H & T",
    chineseMonogram: "囍",
    displayTitle: "Hein Thant Aung & Thazin Htet"
  },

  // Wedding Date & Time
  eventDate: "2026-11-22T09:00:00",
  timezone: "Asia/Yangon",
  timezoneLabel: "MMT",

  // Date Display Formats
  dateDisplay: {
    dayOfWeek: "Sunday",
    fullDate: "22 November 2026",
    shortDate: "22 . 11 . 2026",
    time: "9:00 AM – 12:00 PM",
    year: "2026"
  },

  // Intro Screen (Bespoke Sealed Invitation)
  intro: {
    badge: "Wedding Invitation",
    chineseTitle: "百年好合 • 永结同心",
    subtitle: "",
    buttonText: "Open Invitation"
  },

  // Hero Section
  hero: {
    eyebrow: "Wedding Invitation",
    leadTag: "Imperial Celebration",
    image: "./assets/images/hero.webp",
    imageAlt: "Hein Thant Aung & Thazin Htet — Wedding Portrait",
    scrollHint: "Scroll down to discover"
  },

  // Formal Invitation Message
  invitation: {
    eyebrow: "Formal Announcement",
    heading: "We Request The Honour Of Your Presence",
    subheading: "Together with our Families",
    body: [
      "Together with our families, Hein Thant Aung and Thazin Htet warmly request the pleasure of your company at the celebration of our holy matrimony.",
      "As two families unite in love, honour, and perpetual harmony, we invite you to share our vows, celebrate together, and bestow your cherished blessings upon our new journey.",
      "Your gracious presence will bring immense joy and make our wedding celebration truly unforgettable."
    ],
    monogramSignoff: "With love, reverence & gratitude,",
    hosts: "Together with our Families"
  },

  // Venue & Location
  venue: {
    name: "Ho Seng Chinese Temple",
    city: "Wakema, Myanmar",
    addressDisplay: "Ho Seng Chinese Temple, Wakema",
    burmeseName: "ဟိုစိန်တရုတ်ဘုံကျောင်း၊ ဝါးခယ်မမြို့",
    // Exact Google Maps navigation link
    mapsUrl: "https://maps.app.goo.gl/ghnyTkuvZ8uwLi7Y7?g_st=ic"
  },

  // Pre-Wedding Gallery (Exactly 20 Photos)
  gallery: {
    eyebrow: "Visual Narrative",
    heading: "Captured Moments",
    subheading: "Twenty Chapters of Eternal Devotion",
    images: [
      { id: 1,  src: "./assets/images/photo-01.webp", aspect: "portrait" },
      { id: 2,  src: "./assets/images/photo-02.webp", aspect: "portrait" },
      { id: 3,  src: "./assets/images/photo-03.webp", aspect: "portrait" },
      { id: 4,  src: "./assets/images/photo-04.webp", aspect: "landscape" },
      { id: 5,  src: "./assets/images/photo-05.webp", aspect: "portrait" },
      { id: 6,  src: "./assets/images/photo-06.webp", aspect: "portrait" },
      { id: 7,  src: "./assets/images/photo-07.webp", aspect: "portrait" },
      { id: 8,  src: "./assets/images/photo-08.webp", aspect: "portrait" },
      { id: 9,  src: "./assets/images/photo-09.webp", aspect: "portrait" },
      { id: 10, src: "./assets/images/photo-10.webp", aspect: "portrait" },
      { id: 11, src: "./assets/images/photo-11.webp", aspect: "landscape" },
      { id: 12, src: "./assets/images/photo-12.webp", aspect: "portrait" },
      { id: 13, src: "./assets/images/photo-13.webp", aspect: "portrait" },
      { id: 14, src: "./assets/images/photo-14.webp", aspect: "portrait" },
      { id: 15, src: "./assets/images/photo-15.webp", aspect: "portrait" },
      { id: 16, src: "./assets/images/photo-16.webp", aspect: "portrait" },
      { id: 17, src: "./assets/images/photo-17.webp", aspect: "portrait" },
      { id: 18, src: "./assets/images/photo-18.webp", aspect: "landscape" },
      { id: 19, src: "./assets/images/photo-19.webp", aspect: "landscape" },
      { id: 20, src: "./assets/images/photo-20.webp", aspect: "landscape" }
    ]
  },

  // Audio / Background Melody
  music: {
    enabled: true,
    file: "./assets/audio/ambient.mp3",
    title: "Eternal Harmony",
    artist: "Acoustic Wedding Melody",
    autoplayAfterIntro: true,
    initialVolume: 0.60
  },

  // Closing Note
  closing: {
    heading: "With Heartfelt Gratitude",
    chineseBlessing: "白头偕老 • 幸福美满",
    text: "Thank you for walking this road with us and blessing our union with your love and grace. We look forward to celebrating this special day with you.",
    monogram: "H & T",
    footerText: "Hein Thant Aung & Thazin Htet • 22 November 2026 • Wakema, Myanmar"
  }
};
