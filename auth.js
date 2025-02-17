require('dotenv').config();
const { google } = require('googleapis');
const readline = require('readline');
const OAuth2 = google.auth.OAuth2;

const credentials = JSON.parse(process.env.CLIENT_SECRET);
const clientSecret = credentials.installed.client_secret;
const clientId = credentials.installed.client_id;
const redirectUrl = credentials.installed.redirect_uris[0];

const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

function getNewToken() {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.force-ssl']
    });
    console.log('Authorize this app by visiting this URL:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error('Error retrieving access token', err);
                return;
            }
            console.log('New Token:', JSON.stringify(token));
        });
    });
}

getNewToken();
