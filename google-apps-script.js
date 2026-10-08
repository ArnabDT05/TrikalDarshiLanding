/* eslint-disable */
/**
 * =========================================================================
 * TRIKAL DARSHI - GOOGLE SHEETS WAITLIST AUTOMATION SCRIPT
 * Target Sheet: https://docs.google.com/spreadsheets/d/1gjwkvx40ctEomDY0JQPhAhhqX_CYh0BHELDF1WlDhdU/edit
 * =========================================================================
 * 
 * STEP-BY-STEP INSTRUCTIONS TO ACTIVATE (Takes 1 minute):
 * 
 * 1. Open your Google Spreadsheet:
 *    https://docs.google.com/spreadsheets/d/1gjwkvx40ctEomDY0JQPhAhhqX_CYh0BHELDF1WlDhdU/edit
 * 
 * 2. In the Google Sheets top menu bar:
 *    Click: Extensions > Apps Script
 * 
 * 3. In the script editor that opens:
 *    - Delete any sample code like myFunction() {}
 *    - Paste this entire code into the editor
 *    - Click the Save icon (💾) or press Cmd + S / Ctrl + S
 * 
 * 4. Click the blue "Deploy" button at the top right, then select:
 *    "New deployment"
 * 
 * 5. In the modal that appears:
 *    - Click the gear icon (⚙️) next to "Select type" and choose "Web app"
 *    - Description: Trikal Darshi Waitlist Webhook
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone"  <-- CRITICAL: Choose "Anyone" so early access seekers can submit!
 *    - Click "Deploy"
 * 
 * 6. Review Permissions (if prompted by Google):
 *    - Click "Authorize access"
 *    - Choose your Google Account
 *    - If Google shows "Google hasn't verified this app", click "Advanced" -> "Go to Untitled project (unsafe)" -> Click "Allow"
 * 
 * 7. Copy the "Web app URL" (it ends with /exec).
 *    Example: https://script.google.com/macros/s/AKfycbx.../exec
 * 
 * 8. Paste that Web App URL in your .env file:
 *    VITE_GOOGLE_SHEETS_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
 * 
 * That's it! Every time a person clicks "Secure Early Access", their Name, Email,
 * and exact Timestamp will automatically populate in your Google Sheet!
 * =========================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 30 seconds for other concurrent requests to clear
  lock.tryLock(30000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // Check if header row exists, create if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Full Name", "Email Address", "Date & Time (IST)", "Source"]);
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#D7B46A");
      headerRange.setFontColor("#0B0E1B");
    }

    var name = "";
    var email = "";
    var clientTimestamp = "";

    // 1. Check URL-encoded or FormData parameters
    if (e && e.parameter) {
      name = e.parameter.Name || e.parameter.name || name;
      email = e.parameter.Email || e.parameter.email || email;
      clientTimestamp = e.parameter.Timestamp || e.parameter.timestamp || clientTimestamp;
    }

    // 2. Check JSON payload in postData
    if ((!name || !email) && e && e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        name = parsed.Name || parsed.name || name;
        email = parsed.Email || parsed.email || email;
        clientTimestamp = parsed.Timestamp || parsed.timestamp || clientTimestamp;
      } catch (jsonErr) {
        // Not JSON formatted, ignore
      }
    }

    // Format IST Timestamp
    var formattedDateIST = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy HH:mm:ss");

    // Append submission row
    sheet.appendRow([
      new Date(),
      name ? name.toString().trim() : "Anonymous Seeker",
      email ? email.toString().trim() : "",
      formattedDateIST,
      "Trikal Darshi Portal"
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Your place is reserved in the stars.",
        name: name,
        email: email
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  return ContentService
    .createTextOutput("Trikal Darshi Waitlist Webhook is Active. Connected to Sheet: " + doc.getName())
    .setMimeType(ContentService.MimeType.TEXT);
}
