const puppeteer = require('puppeteer')
const getHtml = require('./tpl')
const numCPUs = 1 // require('os').cpus().length
// console.log(`numCPUs`, numCPUs)

// https://www.npmjs.com/package/puppeteer-cluster

class Puppeteer {
  constructor() {
    this.browserList = []
    this.useBrowserIndex = 0
  }

  async init() {
    for (let i = 0; i < numCPUs; i++) {
      this.newBrower()
    }
  }

  get browser() {
    // const index = this.useBrowserIndex % this.browserList.length
    // console.log(`index`, index)
    const index = this.browserList.length - 1
    return this.browserList[index]
  }

  async newBrower() {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: './chrome-mac/Chromium.app/Contents/MacOS/Chromium',
      args: [
        '–disable-gpu',
        '–disable-dev-shm-usage',
        '–no-first-run',
        '–no-zygote',
        '–single-process',

        // for Centos
        '–no-sandbox',
        '–disable-setuid-sandbox'
      ]
    })
    this.browserList.push(browser)
    return browser
  }

  async screenshot(config, screenshotConfig) {
    this.useBrowserIndex++
    try {
      // const pages = await this.browser.pages()

      // if (pages.length > 10) {
      //   await new Promise(resolve => {
      //     pages[0].on('close', resolve)
      //     pages[0].on('error', resolve)
      //   })
      // }

      const page = await this.browser.newPage()
      await page.setViewport({
        width: config.width,
        height: config.height
      })
      await page.setContent(getHtml(config))
      await this.waitForNetworkIdle(page, 50)
      const imgUrl = `/img/example.${
        +new Date() + '-' + ((Math.random() * 100000000) | 0)
      }.jpg`
      await page.screenshot(screenshotConfig)

      // 尽快返回
      process.nextTick(() => {
        page.close()
      })
      return imgUrl
    } catch (e) {
      console.log(e)
    }
  }

  waitForNetworkIdle(page, timeout, maxInflightRequests = 0) {
    page.on('request', onRequestStarted)
    page.on('requestfinished', onRequestFinished)
    page.on('requestfailed', onRequestFinished)

    let inflight = 0
    let fulfill
    let promise = new Promise(x => (fulfill = x))
    let timeoutId = setTimeout(onTimeoutDone, timeout)
    return promise

    function onTimeoutDone() {
      page.removeListener('request', onRequestStarted)
      page.removeListener('requestfinished', onRequestFinished)
      page.removeListener('requestfailed', onRequestFinished)
      fulfill()
    }

    function onRequestStarted() {
      ++inflight
      if (inflight > maxInflightRequests) clearTimeout(timeoutId)
    }

    function onRequestFinished() {
      if (inflight === 0) return
      --inflight
      if (inflight === maxInflightRequests)
        timeoutId = setTimeout(onTimeoutDone, timeout)
    }
  }
}

module.exports = new Puppeteer()


// ➜  node-poster node siege.js

// GET:/poster
// 	done:20
// 	200 OK: 20
// 	rps: 2
// 	response: 802ms(min)	7101ms(max)	3884ms(avg)
// ➜  node-poster
// ➜  node-poster
// ➜  node-poster
// ➜  node-poster node siege.js

// GET:/poster
// 	done:20
// 	200 OK: 20
// 	rps: 2
// 	response: 769ms(min)	7178ms(max)	3869ms(avg)
// ➜  node-poster node siege.js

// GET:/poster
// 	done:20
// 	200 OK: 20
// 	rps: 2
// 	response: 1433ms(min)	9403ms(max)	5514ms(avg)
// https://github.com/thomasdondorf/puppeteer-cluster#clusterqueuedata--taskfunction

// const { Cluster } = require('puppeteer-cluster')

// class Puppeteer {
//   constructor() {
//     // this.browserList = []
//     // this.useBrowserIndex = 0
//   }

//   async init() {
//     // for (let i = 0; i < numCPUs; i++) {
//     //   this.newBrower()
//     // }

//     this.cluster = await Cluster.launch({
//       concurrency: Cluster.CONCURRENCY_CONTEXT,
//       maxConcurrency: 20,
//       puppeteerOptions: {
//         headless: true,
//         executablePath: './chrome-mac/Chromium.app/Contents/MacOS/Chromium',
//         args: [
//           '–disable-gpu',
//           '–disable-dev-shm-usage',
//           '–no-first-run',
//           '–no-zygote',
//           '–single-process',

//           // for Centos
//           '–no-sandbox',
//           '–disable-setuid-sandbox'
//         ]
//       }
//     })

//     await this.cluster.task(
//       async ({ page, data: { config, screenshotConfig } }) => {
//         // Store screenshot, do something else

//         // const page = await this.browser.newPage()
//         await page.setViewport({
//           width: config.width,
//           height: config.height
//         })
//         await page.setContent(getHtml(config))
//         await this.waitForNetworkIdle(page, 50)
//         const imgUrl = `/img/example.${
//           +new Date() + '-' + ((Math.random() * 100000000) | 0)
//         }.jpg`
//         await page.screenshot(screenshotConfig)

//         return imgUrl
//       }
//     )
//   }

//   async screenshot(config, screenshotConfig) {
//     try {
//       return this.cluster.execute({ config, screenshotConfig })
//     } catch (e) {
//       console.log(e)
//     }
//   }

//   waitForNetworkIdle(page, timeout, maxInflightRequests = 0) {
//     page.on('request', onRequestStarted)
//     page.on('requestfinished', onRequestFinished)
//     page.on('requestfailed', onRequestFinished)

//     let inflight = 0
//     let fulfill
//     let promise = new Promise(x => (fulfill = x))
//     let timeoutId = setTimeout(onTimeoutDone, timeout)
//     return promise

//     function onTimeoutDone() {
//       page.removeListener('request', onRequestStarted)
//       page.removeListener('requestfinished', onRequestFinished)
//       page.removeListener('requestfailed', onRequestFinished)
//       fulfill()
//     }

//     function onRequestStarted() {
//       ++inflight
//       if (inflight > maxInflightRequests) clearTimeout(timeoutId)
//     }

//     function onRequestFinished() {
//       if (inflight === 0) return
//       --inflight
//       if (inflight === maxInflightRequests)
//         timeoutId = setTimeout(onTimeoutDone, timeout)
//     }
//   }
// }

// module.exports = new Puppeteer()
