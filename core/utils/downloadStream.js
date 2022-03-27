const Stream = require('stream').Transform
const https = require('https')
const fs = require('fs')

const downloadStream = async (url, filepath, type) => {
    const Data = new Stream
    const result = await new Promise ((resolve) => {
        const fileID = (() => {
            const random_id = [] 
            for (let i = 0; i < 32; i++) {
                random_id.push(Math.floor(Math.random() * 9))
            }
            const result = random_id.join('')
            return result
        })()
        
        https.get(url, (res) => {
            res.on('data', data => {
                Data.push(data)
            })
            res.on('end', () => {
                let path = fs.existsSync(filepath)
                if (!path) fs.mkdirSync(filepath)
                fs.writeFile(`${filepath}${fileID}.${type}`, Data.read(), "utf-8", (e) => {
                    if (e) resolve({"ok": false, "error": e.message})
                    else resolve ({"ok": true, "response": { "path": filepath, "name": fileID, "type": type}})
                })
            })  
            res.on('error', e => {
                resolve({"ok": false, "error": e.message})
                console.log(e)
            })
        })
    })
    return result
}

module.exports = downloadStream
// const url = 'https://v16-webapp.tiktok.com/1723e37bdfa3da35f46d39d294dd282e/623e59e9/video/tos/alisg/tos-alisg-pve-0037c001/c906403f20e6448ca2d8eea6e13f2c7b/?a=1988&br=1920&bt=960&cd=0%7C0%7C1%7C0&ch=0&cr=0&cs=0&cv=1&dr=0&ds=3&er=&ft=XOQ9-3EHnz7Thk4uJDXq&l=2022032518100501022309817126EEDA06&lr=tiktok_m&mime_type=video_mp4&net=0&pl=0&qs=0&rc=aml4OTw6Zm00OzMzODczNEApPDVnODg0OGU8Nzc2NTlnO2dqcDRxcjQwaWFgLS1kMS1zc2NeMy0tMy5jXy0uYV4yXmE6Yw%3D%3D&vl=&vr='
// downloadStream (url, './tmp/', 'mp4')