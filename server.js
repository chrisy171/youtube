require('dotenv').config()
const cron = require('node-cron');
const {google} = require('googleapis');
const {analytics} = require("googleapis/build/src/apis/analytics");
const OAuth2 = google.auth.OAuth2;
const VIDEO_ID = process.env.VIDEO_ID



cron.schedule('* * * * *', async function() {
    try {
        const auth = authorize()

        const {views,likes,comments} = await getVideosViews(auth)
        const videoTitle = await updateVideoTitle(auth, views,likes,comments)

        console.log(views, likes, comments)

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

function getVideosViews(auth){
    const service = google.youtube('v3');

    return new Promise((resolve,reject)=>{
        service.videos.list({
            auth: auth,
            part: 'statistics',
            id: VIDEO_ID
        },function (err, res){
            if(err) {
                console.error("Error fetching video stats:", err);
                return reject({views: 0, likes: 0, comments: 0});
            }

            if (!res.data.items || res.data.items.length === 0) {
                console.error("No video data found.");
                return resolve({ views: 0, likes: 0, comments: 0 });
            }

            const stats = res.data.items[0].statistics;
            const views = stats.viewCount || 0;
            const likes = stats.likeCount || 0;
            const comments = stats.commentCount || 0;

            resolve({ views, likes, comments });
        })
    })
}

function updateVideoTitle(auth, views,likes,comments){
    const service = google.youtube('v3')
    return new Promise((resolve, reject)=>{
        service.videos.update({
            auth:auth,
            part: 'snippet',
            resource:{
                id: VIDEO_ID,
                snippet:{
                    title: `This Video has ${new Intl.NumberFormat('en-US').format(views)} Views ${likes} Likes ${comments} Comments!`,
                    categoryId: 20
                }
            }
        }, function (err,res){
            if(err) return reject(err)
            resolve(res.data.snippet.title)
        })
    })
}