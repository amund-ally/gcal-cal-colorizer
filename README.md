# gcal-cal-colorizer
Script for google app scripts to automatically set your calendar event colors based on custom criteria.

Adapted from a Medium post by Mathias Wagner. https://mathiasw.medium.com/automate-your-google-calendar-coloring-4e7b15ed5560

How to use
* Head to https://script.google.com/home
* Click on "New Project"
* Delete the function in the Code.gs file of your new project and paste this repo's Code.gs file into it
* Modify the script
  * Most likely all you need to do is add your own rules to the colorizeByRegex
  * You can click the Run button to test your rule and see if it changes your events as desired
  * Note: if an event already has a color the script will skip it, but you can change this behavior
* Once you have made and saved your changes, you will want to setup a trigger
  * On the left menu, click on Triggers (an alarm clock icon)
  * Click the "Add Trigger" button in the lower right of the page
  * Set the Function to colorizeCalendar
  * Choose your deployment. If you haven't deployed, Head will just use your latest code
  * Set the event source to "From Calendar"
  * "Enter calendar details" should be "Calendar Updated"
  * Enter the email address of the owner of the calendar you want to trigger updates. This is probably your own email.
  * Choose how often you want notifications if the script fails
