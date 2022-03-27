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
        url = page.url().match(expectedTTUrl)[0]
        var element = await page.waitForSelector(`video`)
        var videoUrl = await page.evaluate(element => element.src, element) 
        browser.close()
    } catch (e) {
        videoUrl = null
    }
    return videoUrl
}

module.exports = scrapPage
// (async () => console.log(await scrapPage('https://vm.tiktok.com/ZSdNSh1PKAdadad')))()