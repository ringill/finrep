let google = require('googleapis');

const spreadsheetId = "1rsFLYEiJFIKcXZrJca7tHnwiEgH8QFAUoDSdGpBpAMc";

function getData(auth) {
  var sheets = new google.sheets_v4.Sheets();
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId,
    // Change Sheet1 if your worksheet's name is something else
    range: 'Sheet1!A2:C',
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.data.values;
    if (rows.length === 0) {
      console.log('No data found.');
    } else {
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        console.log(row.join(", "));
      }
    }
  });
}

function appendData(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: 'yourSpreadSheetIDHere',
    range: 'Sheet1!A2:B', //Change Sheet1 if your worksheet's name is something else
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [["Void", "Canvas", "Website"], ["Paul", "Shan", "Human"]]
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
      console.log("Appended");
    }
  });
}

function addSheet(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.create({
    auth: auth,
    resource: {
      properties: {
        title: "Anything-you-name"
      }
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
      console.log("Added");
    }
  });
}

module.exports = {
  getData,
  appendData,
  addSheet
};