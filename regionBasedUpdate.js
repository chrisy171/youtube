require('dotenv').config()
const cron = require('node-cron');
const {google} = require('googleapis');
const {analytics} = require("googleapis/build/src/apis/analytics");
const OAuth2 = google.auth.OAuth2;
const VIDEO_ID = process.env.VIDEO_ID



cron.schedule('* * * * *', async function() {
    try {
        const auth = authorize()
        const analytics = await getTopRegion(auth)
        console.log(analytics)
        const videoViews = await getVideosViews(auth)
        const videoTitle = await updateVideoTitle(auth, videoViews,analytics)

        // console.log(videoViews)
        //
        // console.log(videoTitle)
        console.log(`updated Title ${videoTitle}`)
    }catch(e){
        console.error(e);
    }
})

function authorize() {
    const credentials = JSON.parse(process.env.CLIENT_SECRET)
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];

    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    oauth2Client.credentials = JSON.parse(process.env.OAuth_Token);
    return oauth2Client
}
async function getTopRegion(auth) {
    const service = google.youtubeAnalytics('v2');
    try {
        const response = await service.reports.query({
            auth: auth,
            ids: 'channel==MINE', // Fetch for the authenticated channel
            startDate: '2024-01-01', // Change as needed
            endDate: new Date().toISOString().split('T')[0], // Today's date
            metrics: 'views',
            dimensions: 'country',
            sort: '-views',
            maxResults: 1
        });

        if (response.data.rows.length === 0) {
            console.log("No view data found.");
            return "Unknown";
        }

        const topCountryCode = response.data.rows[0][0]; // ISO country code
        console.log(`Top Viewing Country: ${topCountryCode}`);
        return topCountryCode;
    } catch (error) {
        console.error("Error fetching top region:", error);
        return "Unknown";
    }
}

function getVideosViews(auth){
    const service = google.youtube('v3');
    return new Promise((resolve,reject)=>{
        service.videos.list({
            auth: auth,
            part: 'statistics',
            id: VIDEO_ID
        },function (err, res){
            if(err) return reject(err)
            console.log(res.data.items)
            resolve(res.data.items[0].statistics.viewCount)
        })
    })
}

function updateVideoTitle(auth, views,analytics){
    const service = google.youtube('v3')
    return new Promise((resolve, reject)=>{
        service.videos.update({
            auth:auth,
            part: 'snippet',
            resource:{
                id: VIDEO_ID,
                snippet:{
                    title: `${new Intl.NumberFormat('en-US').format(views)} Views from ${analytics} - Watch Now!`,
                    categoryId: 20
                }
            }
        }, function (err,res){
            if(err) return reject(err)
            resolve(res.data.snippet.title)
        })
    })
}