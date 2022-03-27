const fs = require ('fs')
const fetch = require ("node-fetch") 
const FormData = require ('form-data')
   
const uploadPost = async (uploadUrl, filepath) => {

    const form = new FormData()
    const stats = fs.statSync(filepath)
    const fileSize = stats.size
    const fileStream = fs.createReadStream(filepath)
    form.append('video_file', fileStream, { knownLength: fileSize})

    const options = {
        method: 'POST',
        body: form,
    }

    const res = await fetch (uploadUrl, {...options})
    const result = await res.json()
    fs.unlinkSync(filepath)
    return result
}

module.exports = uploadPost

// (async () => {
//     uploadPost(
//         'https://ovu.mycdn.me/upload.do?sig=6be357e59c58878ed4661996bbda100139ab48a9&expires=1648469465141&clientType=14&appId=512000384397&id=3895937935506&userId=0&cid=2428317338258&vkOwnerId=649473682&vkVideoId=456239077&vkUserId=649473682&vkVideoHash=74d46509d48df44053&saveOriginal=1',
//         './tmp/83777317538086240214220822316584.mp4'
//     )
// })()