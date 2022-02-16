const https = require('https')

async function awaitedGet (url) {
    const data = new Promise ((resolve, reject) => {
        https.get(url, res => {
            res.on('data', data => {
                data = JSON.parse(data)
                resolve(data)
            })
        }).on('error', (e) => {
            // doNothing()
        })
    })
    return data
}

module.exports = awaitedGet