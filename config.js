/**
 * WEDDING INVITATION CONFIGURATION
 * 
 * Instructions:
 * Edit the values in this file to customize your wedding invitation.
 * All image paths are relative to the website root (e.g. './assets/images/hero.webp')
 * ensuring compatibility with subdirectories such as /slhinv/ on GitHub Pages & Cloudflare Pages.
 */

window.WEDDING_CONFIG = {
  // Couple Information
  couple: {
    partner1: {
      firstName: "Soe Lin Htut",
      lastName: "",
      fullName: "Soe Lin Htut",
      role: "Groom"
    },
    partner2: {
      firstName: "Htet Zarchi Win",
      lastName: "",
      fullName: "Htet Zarchi Win",
      role: "Bride"
    },
    // Monogram initials displayed on intro screen and stamps
    initials: "S & H",
    // Combined title format
    displayTitle: "Soe Lin Htut & Htet Zarchi Win"
  },

  // Wedding Date & Time
  // Format: YYYY-MM-DDTHH:mm:ss in ISO format
  eventDate: "2026-11-15T09:00:00",
  timezone: "Asia/Yangon",
  timezoneLabel: "MMT (GMT+6:30)",
  
  // Date Display Formats
  dateDisplay: {
    dayOfWeek: "Sunday",
    fullDate: "November 15, 2026",
    shortDate: "15 . 11 . 2026",
    time: "9:00 AM",
    year: "2026"
  },

  // Intro Screen
  intro: {
    subtitle: "The Wedding Celebration",
    quote: "Two lives, one shared journey — celebrated in quiet devotion, love, and family blessing.",
    buttonText: "View Invitation",
    footnote: "Press or click to open"
  },

  // Hero Section
  hero: {
    leadTag: "Save The Date & Formal Invitation",
    locationShort: "Pathein, Myanmar",
    image: "./assets/images/hero.webp",
    imageAlt: "Soe Lin Htut & Htet Zar Chi — Wedding Portrait",
    scrollHint: "Scroll down to discover"
  },

  // Invitation Message
  invitation: {
    heading: "We Request The Pleasure Of Your Company",
    subheading: "A Union of Two Lives",
    body: [
      "Together with their parents, Soe Lin Htut and Htet Zar Chi warmly request the honour of your presence at the celebration of their wedding ceremony.",
      "Surrounded by our beloved families, elders, and dearest friends, we will exchange our vows and begin this new chapter of love, mutual respect, and lifelong partnership.",
      "Your warm blessings and presence will bring immense joy and make our wedding day truly memorable."
    ],
    monogramSignoff: "With love and gratitude,",
    hosts: "The Parents of the Bride & Groom"
  },

  // Love Story / Editorial Vignettes
  story: {
    enabled: true,
    heading: "Our Story",
    subheading: "Chapter by Chapter",
    vignettes: [
      {
        year: "2022",
        place: "Yangon",
        title: "Where Our Story Began",
        text: "Two lives quietly intersected on an autumn afternoon. What began as a heartfelt friendship quickly blossomed into a profound bond built on laughter and shared ideals."
      },
      {
        year: "2024",
        place: "Pathein & Beyond",
        title: "Growing Together",
        text: "Two years of quiet travels, thoughtful conversations over tea, and the gentle realization that home is simply being wherever the other is."
      },
      {
        year: "2026",
        place: "The Promise",
        title: "A Lifetime Ahead",
        text: "With the loving blessings of both our families, we made our eternal promise to walk hand in hand through every season of life."
      }
    ],
    portraitImage: "./assets/images/story.webp",
    portraitCaption: "Together in Love • 2026"
  },

  // Venue & Schedule
  venue: {
    name: "SWEN Hotel",
    tagline: "Grand Ballroom, Pathein",
    address: "SWEN Hotel, Merchant Street, Pathein, Ayeyarwady Region, Myanmar",
    // Google Maps direct navigation link
    mapsUrl: "https://maps.google.com/?q=SWEN+Hotel+Pathein+Myanmar",
    // Optional Google Maps Embed URL
    embedMapUrl: "https://www.google.com/maps?q=SWEN+Hotel+Pathein+Myanmar&output=embed",
    dressCode: {
      title: "Formal / Elegant Traditional",
      description: "Formal Western attire or elegant traditional Myanmar wedding attire. Warm neutral, pastel, gold, or dark formal palettes are warmly welcomed."
    },
    accommodations: {
      title: "Venue & Guest Parking",
      description: "Complimentary guest parking is available at the SWEN Hotel front gates. Reception staff will guide guests directly to the Grand Ballroom."
    }
  },

  // Schedule Timeline
  schedule: [
    {
      time: "9:00 AM",
      title: "Guest Arrival & Welcome Reception",
      location: "SWEN Hotel Grand Foyer",
      detail: "Warm welcome drinks, traditional light refreshments, and ambient acoustic music."
    },
    {
      time: "9:30 AM",
      title: "Sacred Wedding Ceremony & Vows",
      location: "The Grand Ballroom",
      detail: "Blessing ceremony, vow exchange, and ring presentation before our families and elders."
    },
    {
      time: "10:30 AM",
      title: "Wedding Feast & Toasts",
      location: "Grand Ballroom Dining Hall",
      detail: "A celebratory feast served in honour of all guests and loved ones."
    },
    {
      time: "11:30 AM",
      title: "Photography & Bride & Groom Send-off",
      location: "The Ballroom Stage",
      detail: "Commemorative group photos with the bride and groom, family, and cherished friends."
    }
  ],

  // Gallery (Pre-Wedding Photoshoot)
  gallery: {
    heading: "Pre-Wedding Moments",
    subheading: "Pathein • SWEN Hotel",
    images: [
      {
        src: "./assets/images/gallery-10.webp",
        thumb: "./assets/images/gallery-10.webp",
        aspect: "portrait"
      },
      {
        src: "./assets/images/gallery-1.webp",
        thumb: "./assets/images/gallery-1.webp",
        aspect: "portrait"
      },
      {
        src: "./assets/images/gallery-2.webp",
        thumb: "./assets/images/gallery-2.webp",
        aspect: "portrait"
      },
      {
        src: "./assets/images/gallery-9.webp",
        thumb: "./assets/images/gallery-9.webp",
        aspect: "landscape"
      },
      {
        src: "./assets/images/gallery-3.webp",
        thumb: "./assets/images/gallery-3.webp",
        aspect: "portrait"
      },
      {
        src: "./assets/images/gallery-4.webp",
        thumb: "./assets/images/gallery-4.webp",
        aspect: "portrait"
      },
      {
        src: "./assets/images/gallery-5.webp",
        thumb: "./assets/images/gallery-5.webp",
        aspect: "portrait"
      },
      {
        src: "./assets/images/gallery-8.webp",
        thumb: "./assets/images/gallery-8.webp",
        aspect: "portrait"
      },
      {
        src: "./assets/images/gallery-6.webp",
        thumb: "./assets/images/gallery-6.webp",
        aspect: "portrait"
      },
      {
        src: "./assets/images/gallery-7.webp",
        thumb: "./assets/images/gallery-7.webp",
        aspect: "portrait"
      },
      {
        src: "./assets/images/gallery-11.webp",
        thumb: "./assets/images/gallery-11.webp",
        aspect: "portrait"
      }
    ]
  },

  // Audio / Music Settings
  music: {
    enabled: true,
    file: "./assets/audio/ambient.mp3",
    title: "Wedding Celebration Melody",
    artist: "Soe Lin Htut & Htet Zarchi Win",
    // Autoplay policy: strictly false until user clicks "View Invitation" or audio toggle
    autoplayAfterIntro: true,
    initialVolume: 0.60
  },

  // Digital Wedding Gift & Blessings (KPay & Wave)
  gifts: {
    enabled: true,
    eyebrow: "Digital Wedding Blessing",
    title: "Send Love & Blessings",
    burmeseTitle: "",
    message: "Your warm presence is our greatest blessing. For loved ones wishing to send wedding gifts from afar:",
    accounts: [
      {
        id: "kpay",
        provider: "KBZPay",
        badge: "KPay",
        brandColor: "#104F9E",
        name: "Soe Lin Htut",
        phone: "09 792 245 717",
        rawPhone: "09792245717",
        qr: "./assets/images/qr-kpay.jpg",
        note: "Scan with KBZPay app to transfer"
      },
      {
        id: "wave",
        provider: "WavePay",
        badge: "Wave",
        brandColor: "#D97706",
        name: "Soe Lin Htut",
        phone: "09 792 245 717",
        rawPhone: "09792245717",
        qr: "./assets/images/qr-wave.svg",
        note: "Scan with WavePay app to transfer"
      }
    ]
  },

  // Final Closing Note
  closing: {
    heading: "With Gratitude",
    text: "Thank you for blessing our union with your love and kindness. We cannot wait to celebrate this special day with you.",
    monogram: "S & H",
    footerText: "Soe Lin Htut & Htet Zarchi Win • November 15, 2026 • SWEN Hotel, Pathein"
  }
};
