/**
 * CALENDAR INTEGRATION
 * Generates .ics file download and Google Calendar web link
 */

class WeddingCalendar {
  constructor(config) {
    this.config = config || {};
  }

  getGoogleCalendarUrl() {
    const startDate = new Date(this.config.eventDate || "2027-09-18T16:00:00");
    // Default 6-hour duration
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);

    const formatUTC = (d) => {
      return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const title = encodeURIComponent(`${this.config.couple?.displayTitle || "Elena & Julian"} — Wedding Celebration`);
    const dates = `${formatUTC(startDate)}/${formatUTC(endDate)}`;
    const location = encodeURIComponent(`${this.config.venue?.name || "Villa Balbiano"}, ${this.config.venue?.address || "Como, Italy"}`);
    const details = encodeURIComponent(
      `Celebrating the wedding of ${this.config.couple?.displayTitle || "Elena & Julian"}.\n\nVenue: ${this.config.venue?.name}\nDress Code: ${this.config.venue?.dressCode?.title}\n\nWe look forward to celebrating together!`
    );

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  }

  downloadICS() {
    const startDate = new Date(this.config.eventDate || "2027-09-18T16:00:00");
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);

    const formatICSDate = (d) => {
      return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const coupleTitle = this.config.couple?.displayTitle || "Elena & Julian";
    const venueName = this.config.venue?.name || "Villa Balbiano";
    const venueAddr = this.config.venue?.address || "Ossuccio, Italy";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Digital Wedding//Invitation//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `SUMMARY:Wedding: ${coupleTitle}`,
      `UID:${Date.now()}@weddinginvitation.internal`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `LOCATION:${venueName}, ${venueAddr}`,
      `DESCRIPTION:Join us to celebrate the wedding of ${coupleTitle} at ${venueName}. Dress code: ${this.config.venue?.dressCode?.title}.`,
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
