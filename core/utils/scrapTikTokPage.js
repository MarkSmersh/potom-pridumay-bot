const puppeteer = require('puppeteer')

const scrapPage = async (url) => {
    var videoUrl = null
    let expectedTTUrl = /^https\:\/\/(?:vm|www)\.tiktok\.com\/(?:[a-zA-Z0-9]+)?(?:@[a-zA-Z0-9\.\_]*\/video\/[0-9]+)?/gm
    url = url.match(expectedTTUrl)
    if (url === null) return null
    url = url[0]

    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
        const page = await browser.newPage()
        await page.goto(url)
        var element = await page.waitForSelector(`video`)
        if (page.url().match(expectedTTUrl)[0] === 'https://www.tiktok.com/') return null
        var videoUrl = await page.evaluate(element => element.src, element) 
        browser.close()
    } catch (e) {
        videoUrl = null
        console.log(e)
    }
    return videoUrl
}

module.exports = scrapPage
// (async () => console.log(await scrapPage('https://vm.tiktok.com/ZSdNSh1PKAdadad')))()