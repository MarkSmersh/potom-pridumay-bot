const https = require('https')
const Stream = require('stream').Transform

async function awaitedGet (url) {
    const Data = new Stream.PassThrough
    const response = await new Promise ((resolve) => {
        https.get(url, res => {
            res.on('data', data => {
                Data.write(data)
            })
            res.on('end', () => {
                resolve(JSON.parse(Data.read()))
            })
        }).on('error', (e) => {
            return
        })
    })
    return response
}

module.exports = awaitedGet