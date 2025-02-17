require('dotenv').config()
const cron = require('node-cron');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const VIDEO_ID = process.env.VIDEO_ID



cron.schedule('* * * * *', async function() {
    try {
        const auth = authorize()
        const videoViews = await getVideosViews(auth)
        const videoTitle = await updateVideoTitle(auth, videoViews)
        console.log(videoViews)
        console.log(videoTitle)
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

function updateVideoTitle(auth, views){
    const service = google.youtube('v3')
    return new Promise((resolve, reject)=>{
        service.videos.update({
            auth:auth,
            part: 'snippet',
            resource:{
                id: VIDEO_ID,
                snippet:{
                    title: `This video has ${new Intl.NumberFormat('en-Us').format(views)} views`,
                    categoryId: 20
                }
            }
        }, function (err,res){
            if(err) return reject(err)
            resolve(res.data.snippet.title)
        })
    })
}