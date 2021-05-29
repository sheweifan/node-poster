// export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
// https://juejin.im/post/5ce53c786fb9a07f014ecbcd
// https://tech.youzan.com/shi-yong-puppeteerda-jian-tong-hai-bao-xuan-ran-fu-wu/
// https://juejin.im/post/5de62134518825122e0a5e3a

// api
// https://pptr.dev/#?product=Puppeteer&version=v3.3.0&show=api-pagescreenshotoptions

// const puppeteer = require('puppeteer')
const serve = require('koa-static')
var Koa = require('koa')
var Router = require('koa-router')

const mypuppeteer = require('./puppeteer')

const render = require('./images.js')

var app = new Koa()
var router = new Router()

router.get('/image', async ctx => {
  const imgurl = await render()
  ctx.body = imgurl
  ctx.type = 'jpg'
})

router.get('/poster', async ctx => {
  const config = {
    poster:
      'https://ossimg.xinli001.com/20200610/774a40097f12aa3259ba7111ef69c497.jpeg?ts=' +
      +new Date(),
    code:
      'https://ossimg.xinli001.com/20200610/38c5e1bc0697620cc9432aeb98e3190a.png?ts=' +
      +new Date(),
    name: 'sheweifan',
    width: 750,
    height: 1334,
    codeSize: 220,
    codeRight: 40,
    codeBottom: 40
  }
  try {
    const imgUrl = `/img/example.${
      +new Date() + '-' + ((Math.random() * 100000000) | 0)
    }.jpg`
    await mypuppeteer.screenshot(config, {
      path: `.${imgUrl}`,
      quality: 80,
      type: 'jpeg'
    })
    // ctx.body = {
    //   imgUrl,
    //   code: 0
    // }
    ctx.body = `<img src="${imgUrl}" />`
    ctx.type = 'html'
  } catch (e) {
    console.log(e)
  }
})

app.use(serve('./'))
app.use(router.routes()).use(router.allowedMethods())
mypuppeteer.init().then(() => {
  app.listen(3002)
})
