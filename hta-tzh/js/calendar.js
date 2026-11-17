/**
 * CALENDAR INTEGRATION
 * Generates .ics file download and Google Calendar web link
 */

class WeddingCalendar {
  constructor(config) {
    this.config = config || {};
  }

  getGoogleCalendarUrl() {
    const startDate = new Date(this.config.eventDate || "2026-11-22T09:00:00");
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // 9:00 AM - 12:00 PM

    const formatUTC = (d) => {
      return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const coupleTitle = this.config.couple?.displayTitle || "Hein Thant Aung & Thazin Htet";
    const venueName = this.config.venue?.burmeseName || "ဟိုစိန်တရုတ်ဘုံကျောင်း၊ ဝါးခယ်မမြို့";
    const title = encodeURIComponent(`${coupleTitle} — Wedding Celebration`);
    const dates = `${formatUTC(startDate)}/${formatUTC(endDate)}`;
    const location = encodeURIComponent(venueName);
    const details = encodeURIComponent(
      `Celebrating the auspicious wedding ceremony of ${coupleTitle}.\n\nDate: 22 November 2026 (Sunday)\nTime: 9:00 AM – 12:00 PM\nVenue: ${venueName}\n\nWe warmly look forward to celebrating together!`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }

  downloadICS() {
    const startDate = new Date(this.config.eventDate || "2026-11-22T09:00:00");
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

    const formatICSDate = (d) => {
      return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const coupleTitle = this.config.couple?.displayTitle || "Hein Thant Aung & Thazin Htet";
    const venueName = this.config.venue?.burmeseName || "ဟိုစိန်တရုတ်ဘုံကျောင်း၊ ဝါးခယ်မမြို့";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DigiVite//Chinese Wedding Invitation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:Wedding: ${coupleTitle}`,
      `UID:${Date.now()}@hta-tzh.internal`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `LOCATION:${venueName}`,
      `DESCRIPTION:Join us to celebrate the wedding ceremony of ${coupleTitle} at ${venueName}. Sunday, 22 November 2026, 9:00 AM – 12:00 PM.`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Wedding-${coupleTitle.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

window.WeddingCalendar = WeddingCalendar;
