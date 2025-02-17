require('dotenv').config();
const {google} = require('googleapis');

// Function to authorize the API
function authorize() {
    const credentials = JSON.parse(process.env.CLIENT_SECRET);
    const OAuth2 = google.auth.OAuth2;
    const clientSecret = credentials.installed.client_secret;
    const clientId = credentials.installed.client_id;
    const redirectUrl = credentials.installed.redirect_uris[0];

    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    oauth2Client.credentials = JSON.parse(process.env.OAuth_Token);
    return oauth2Client;
}

// Function to get video views
async function getVideosViews(auth) {
    try {
        const service = google.youtube('v3');
        const res = await service.videos.list({
            auth: auth,
            part: 'statistics',
            id: process.env.VIDEO_ID
        });
        if (!res.data.items.length) {
            throw new Error("No video found. Check VIDEO_ID.");
        }
        console.log(`View Count: ${res.data.items[0].statistics.viewCount}`);
    } catch (err) {
        console.error("Error fetching video views:", err.message);
    }
}

// Run the test
const auth = authorize();
getVideosViews(auth);
