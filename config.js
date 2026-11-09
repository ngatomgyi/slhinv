/**
 * WEDDING INVITATION CONFIGURATION
 * 
 * Instructions:
 * Edit the values in this file to customize your wedding invitation.
 * All image paths are relative to the website root (e.g. './assets/images/hero.webp')
 * ensuring compatibility with subdirectories such as /wedding-2/ on Cloudflare Pages.
 */

window.WEDDING_CONFIG = {
  // Couple Information
  couple: {
    partner1: {
      firstName: "Elena",
      lastName: "Vance",
      role: "Bride"
    },
    partner2: {
      firstName: "Julian",
      lastName: "Thorne",
      role: "Groom"
    },
    // Monogram initials displayed on intro screen and stamps
    initials: "E & J",
    // Combined title format
    displayTitle: "Elena & Julian"
  },

  // Wedding Date & Time
  // Format: YYYY-MM-DDTHH:mm:ss in ISO format
  eventDate: "2027-09-18T16:00:00",
  timezone: "Europe/Rome",
  timezoneLabel: "CET (GMT+1)",
  
  // Date Display Formats
  dateDisplay: {
    dayOfWeek: "Saturday",
    fullDate: "September 18, 2027",
    shortDate: "18 . 09 . 2027",
    time: "4:00 PM",
    year: "2027"
  },

  // Intro Screen
  intro: {
    subtitle: "The Wedding Of",
    quote: "A quiet celebration of love, art, and timeless devotion.",
    buttonText: "View Invitation",
    footnote: "Scroll or click to open"
  },

  // Hero Section
  hero: {
    leadTag: "Save The Date & Formal Invitation",
    locationShort: "Lake Como, Italy",
    image: "./assets/images/hero.webp",
    imageAlt: "Elena and Julian — Editorial portrait at Lake Como",
    scrollHint: "Scroll down to discover"
  },

  // Invitation Message
  invitation: {
    heading: "We Request The Pleasure Of Your Company",
    subheading: "A Union of Two Lives",
    body: [
      "Together with their beloved families, Elena Vance and Julian Thorne invite you to join them in celebrating their wedding under the timeless Italian sky.",
      "Surrounded by ancient cypresses, still waters, and those dearest to our hearts, we will exchange our vows and embark on a new chapter of devotion, laughter, and lifelong partnership.",
      "Your presence has shaped the people we have become, and sharing this quiet milestone with you means everything to us."
    ],
    monogramSignoff: "With love and gratitude,",
    hosts: "The Vance & Thorne Families"
  },

  // Love Story / Editorial Vignettes
  story: {
    enabled: true,
    heading: "Our Story",
    subheading: "Chapter by Chapter",
    vignettes: [
      {
        year: "2021",
        place: "Florence",
        title: "A Serendipitous Encounter",
        text: "Introduced on an autumn evening along the Arno river. What began as a discussion on renaissance architecture unfolded into hours of conversation over bitter espresso."
      },
      {
        year: "2023",
        place: "Paris & Kyoto",
        title: "Miles & Quiet Mornings",
        text: "Two years of quiet travels, long walks through narrow alleys, shared sketchbooks, and discovering that home is not a place, but a person."
      },
      {
        year: "2025",
        place: "Lake Como",
        title: "The Promise",
        text: "At sunset overlooking the terraced gardens of Villa Balbiano, Julian asked Elena to be his wife. A quiet whisper, an embrace, and a resounding yes."
      }
    ],
    portraitImage: "./assets/images/story.webp",
    portraitCaption: "Tremezzo, Summer 2025"
  },

  // Venue & Schedule
  venue: {
    name: "Villa Balbiano",
    tagline: "Historic 16th-century Italian Palazzo",
    address: "Piazza Cardinal Durini 5, 22010 Ossuccio CO, Italy",
    // Google Maps direct navigation link
    mapsUrl: "https://maps.google.com/?q=Villa+Balbiano+Ossuccio+Italy",
    // Optional Google Maps Embed URL (leave empty string "" if you prefer only direct button)
    embedMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2777.6256247920153!2d9.1772412!3d45.9687483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4784260a9f5d3099%3A0xe7bc32fcf2609059!2sVilla%20Balbiano!5e0!3m2!1sen!2sit!4v1715000000000!5m2!1sen!2sit",
    dressCode: {
      title: "Black Tie Optional",
      description: "Tuxedo or dark formal suit with tie. Floor-length or elegant cocktail gown. We warmly invite a palette of muted neutrals, olive, charcoal, and warm earth tones. We kindly request that guests reserve white, cream, and ivory for the bride."
    },
    accommodations: {
      title: "Accommodations & Travel",
      description: "A private ferry shuttle will depart from Grand Hotel Tremezzo and Bellagio dock directly to Villa Balbiano dock. Valet parking will be available at the main gate."
    }
  },

  // Schedule Timeline
  schedule: [
    {
      time: "3:30 PM",
      title: "Guest Arrival & Welcome Aperitivo",
      location: "The Cypress Alley & Fountain Lawn",
      detail: "Chilled prosecco, sparkling elderflower spritz, and classical harp accompaniment."
    },
    {
      time: "4:30 PM",
      title: "The Ceremony",
      location: "Lakeside Loggia",
      detail: "Exchange of vows overlooking the tranquil waters of Como."
    },
    {
      time: "5:30 PM",
      title: "Cocktails & Canapés",
      location: "The Rose Garden & Terraces",
      detail: "Artisanal Italian antipasti, vintage champagne, and sunset photography."
    },
    {
      time: "7:00 PM",
      title: "Seated Dinner & Toasts",
      location: "The Grand Pergola",
      detail: "A multi-course Northern Italian dinner paired with Lombardy wines."
    },
    {
      time: "9:00 PM",
      title: "Cake Cutting & Evening Celebration",
      location: "Palazzo Courtyard",
      detail: "Live jazz trio, dessert station, and dancing beneath fairy lights."
    }
  ],

  // Gallery
  gallery: {
    heading: "Visual Impressions",
    subheading: "Memories & Atmosphere",
    images: [
      {
        src: "./assets/images/hero.webp",
        thumb: "./assets/images/hero.webp",
        title: "Golden Hour in Como",
        subtitle: "Lakeside Portrait",
        aspect: "tall"
      },
      {
        src: "./assets/images/gallery-1.webp",
        thumb: "./assets/images/gallery-1.webp",
        title: "The Ceremony Aisle",
        subtitle: "Open Air & Flora",
        aspect: "wide"
      },
      {
        src: "./assets/images/gallery-2.webp",
        thumb: "./assets/images/gallery-2.webp",
        title: "Bespoke Details",
        subtitle: "Handmade Paper & Bands",
        aspect: "square"
      },
      {
        src: "./assets/images/gallery-3.webp",
        thumb: "./assets/images/gallery-3.webp",
        title: "Villa Balbiano Grounds",
        subtitle: "Historic Palazzo Architecture",
        aspect: "wide"
      },
      {
        src: "./assets/images/gallery-4.webp",
        thumb: "./assets/images/gallery-4.webp",
        title: "The Pergola Tablescape",
        subtitle: "Linen, Olive Leaves & Beeswax",
        aspect: "tall"
      },
      {
        src: "./assets/images/gallery-5.webp",
        thumb: "./assets/images/gallery-5.webp",
        title: "A Shared Smile",
        subtitle: "Unscripted Intimacy",
        aspect: "tall"
      },
      {
        src: "./assets/images/gallery-6.webp",
        thumb: "./assets/images/gallery-6.webp",
        title: "Evening Toast",
        subtitle: "Crystal Coupes & Sparkling Wine",
        aspect: "square"
      },
      {
        src: "./assets/images/gallery-7.webp",
        thumb: "./assets/images/gallery-7.webp",
        title: "Twilight Stroll",
        subtitle: "The Waters Edge",
        aspect: "wide"
      },
      {
        src: "./assets/images/gallery-8.webp",
        thumb: "./assets/images/gallery-8.webp",
        title: "Nightfall in the Courtyard",
        subtitle: "Luminaries & Music",
        aspect: "wide"
      }
    ]
  },

  // Audio / Music Settings
  music: {
    enabled: true,
    file: "./assets/audio/ambient.mp3",
    title: "Clair de Lune & Strings",
    artist: "Acoustic Ambient Ensemble",
    // Autoplay policy: strictly false until user clicks "View Invitation" or audio toggle
    autoplayAfterIntro: true,
    initialVolume: 0.55
  },

  // Final Closing Note
  closing: {
    heading: "With All Our Love",
    text: "We cannot wait to celebrate this sacred day in the presence of our family and most cherished friends. Thank you for walking this road with us.",
    monogram: "E & J",
    footerText: "Elena Vance & Julian Thorne • September 18, 2027 • Lake Como, Italy"
  }
};
