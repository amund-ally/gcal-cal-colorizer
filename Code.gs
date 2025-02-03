/* Written by Mathias Wagner www.linkedin.com/in/mathias-wagner */
/* Modified by Arren Mund https://www.linkedin.com/in/arren-mund/ */

// Global debug setting
// true: print info for every event
// false: print info for only newly colorized event
const DEBUG = false

// Enumeration to map UI names to backend colors
var colorMap = {
  Peacock:CalendarApp.EventColor.CYAN,
  Sage:CalendarApp.EventColor.PALE_GREEN,
  Grape:CalendarApp.EventColor.MAUVE,
  Flamingo:CalendarApp.EventColor.PALE_RED,
  Banana:CalendarApp.EventColor.YELLOW,
  Tangerine:CalendarApp.EventColor.ORANGE,
  Lavender:CalendarApp.EventColor.PALE_BLUE,
  Graphite:CalendarApp.EventColor.GRAY,
  Blueberry:CalendarApp.EventColor.BLUE,
  Basil:CalendarApp.EventColor.GREEN,
  Tomato:CalendarApp.EventColor.RED
}

/* Entry for the whole colorizing magic.
   Select this function when deploying it and assigning a trigger function
*/
function colorizeCalendar() {
 
  const pastDays = 1 // looking 1 day back to catch last minute changes
  const futureDays = 7 * 4 // looking 4 weeks into the future
 
  const now       = new Date()
  const startDate = new Date(now.setDate(now.getDate() - pastDays))
  const endDate   = new Date(now.setDate(now.getDate() + futureDays))
  // Extracting the domain of your email, e.g. company.com
  const myOrg     = CalendarApp.getDefaultCalendar().getName().split("@")[1];
 
  // Get all calender events within the defined range
  // For now only from the default calendar
  var calendarEvents = CalendarApp.getDefaultCalendar().getEvents(startDate, endDate)
  var calendars = CalendarApp.getAllOwnedCalendars()

  if (DEBUG) {
    for (var i=0; i<calendars.length; i++) {
      console.log("Owned calendar: " + calendars[i].getName())

    }
    console.log("Calendar default org: " + myOrg)
    console.log("Total calendar events: " + calendarEvents.length)
    console.log("first event guest list: ", calendarEvents[0].getGuestList())
  }

  // Walk through all events, check and colorize
  for (var i=0; i<calendarEvents.length; i++) {
    // Skip for better performance, else go to colorizing below
    if (skipCheck(calendarEvents[i])) {
      continue
    }

    colorizeByRegex(calendarEvents[i], myOrg)
  }
}


/* Performance tweak: skip all events that no longer have the DEFAULT color,
   or have been declined already.
   This avoids overriding user settings and doesn't burn regex / string ops
   for already adjusted event colors.

   @param CalendarEvent
*/  
function skipCheck(event) {
  if(event.getColor() != "" || event.getMyStatus() == CalendarApp.GuestStatus.NO) {
    if(DEBUG) {
      console.log("Skipping already colored / declined event:" + event.getTitle())
    }
    return true
  }

  return false
}


/* Set the color of the event based on Regex matching
  Only makes sense for frequent stuff you want to auto colorize.
  Order matters for performance! Function exits after first matching color set.

  https://developers.google.com/apps-script/reference/calendar/event-color
  Mapping of Google Calendar color names to API color names (Kudos to Jason!):
  https://lukeboyle.com/blog/posts/google-calendar-api-color-id
  @param CalendarEvent
  @param String
*/
function colorizeByRegex(event, myOrg) {
  // Converting to lower case for easier matching.
  // Keep lower case in mind when defining your regex(s) below!
  eventTitle = event.getTitle().toLowerCase()

  for (const guest of event.getGuestList()) {
    guestEmail = guest.getEmail()

/*
  //Example to set the color of an event that has the team name in
  //its title for a team named Code Alchemists
  if (/code alchemists/.test(eventTitle)) {
    console.log("Colorizing Code Alchemists event: " + eventTitle)
    setEventColor(event, colorMap.Flamingo)
    return
  }
*/
/*
  //Example to set the color of an event that does not have a
  //specific domain in the email. Useful to color events from 
  //outside your org. Example org is bestaichatbot.com.

  if (!(/colorizers/.test(guestEmail))) {
    console.log("Colorizing event from email outside bestaichatbot: " + eventTitle)
    setEventColor(event, colorMap.Peacock)
    return
  }
*/

  // No match found, therefore no colorizing
  console.log("No matching rule for: " + eventTitle)
}

/* Sets the color of the event to the specified color.
   If the event is in a series, it will update the color of the entire series

   @param CalendarEvent
   @param int
*/
function setEventColor(event, color) {
  if (event.isRecurringEvent()) {
    event.getEventSeries().setColor(color)
  }
  else {
    event.setColor(color)
  }
}
