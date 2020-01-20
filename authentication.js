const fs = require('fs');
const readline = require('readline');
const path = require('path');
const shell = require("shelljs");
const { OAuth2Client } = require('google-auth-library');

// you can add more scopes according to your permission need. 
// But in case you chang the scope, make sure you deleted the ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json file
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// the directory where we're going to save the token
const TOKEN_DIR = path.join("C:\\", (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE), ".credentials");
// the file which will contain the token
const TOKEN_PATH = path.join(TOKEN_DIR, "sheets.googleapis.com-nodejs-quickstart.json");

class Authentication {

  authenticate() {
    return new Promise((resolve, reject) => {
      const credentials = this.getClientSecret();
      const authorizePromise = this.authorize(credentials);
      authorizePromise.then(resolve, reject);
    });
  }
  getClientSecret() {
    return require('./credentials.json');
  }
  authorize(credentials) {
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];
    const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

    return new Promise((resolve, reject) => {
      // Check if we have previously stored a token.
      fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
          this.getNewToken(oauth2Client).then((oauth2ClientNew) => {
            resolve(oauth2ClientNew);
          }, (err) => {
            reject(err);
          });
        } else {
          oauth2Client.credentials = JSON.parse(token);
          resolve(oauth2Client);
        }
      });
    });
  }
  getNewToken(oauth2Client, _callback) {
    return new Promise((resolve, reject) => {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      });
      console.log('Authorize this app by visiting this url: \n ', authUrl);
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('\n\nEnter the code from that page here: ', (code = "4/owDxhnyyOuYo0h1wU2nRuaEo0mS_czrXvkWqTzUnRtcB4eiKCdUQYPQ") => {
        rl.close();
        oauth2Client.getToken(code, (err, token) => {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            reject();
          }
          oauth2Client.credentials = token;
          this.storeToken(token);
          resolve(oauth2Client);
        });
      });
    });
  }
  storeToken(token) {
    console.log('Store token: \n ', JSON.stringify(token));
    try {
      shell.mkdir('-p', TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
  }
}

module.exports = new Authentication();
