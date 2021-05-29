const fs = require('fs')
const images = require('images')
const TextToSVG = require('text-to-svg')
const sharp = require('sharp')
const path = require('path')
const Promise = require('bluebird')
var QRCode = require('qrcode')

const imgPath = value => {
  return path.join(__dirname, value)
}

const textToSVG = TextToSVG.loadSync(imgPath('../font/weiruanyahei.ttf'))

Promise.promisifyAll(fs)

module.exports = async () => {
  try {
    const sourceImg = images(imgPath('../example.png'))

    console.time('load source image')
    const image = images(sourceImg) // 从文件中加载图片
    console.timeEnd('load source image')

    console.time('text svg')
    const svg1 = textToSVG.getSVG('测试2222', {
      x: 0, // 文本开头的水平位置（默认值：0）
      y: 0, // 文本的基线的垂直位置（默认值：0）
      fontSize: 50, // 文本的大小（默认：）72
      // letterSpacing: "",          // 设置字母的间距
      anchor: 'top', // 坐标中的对象锚点
      attributes: {
        color: '#000'
      }
    })

    const buffer2 = await sharp(Buffer.from(svg1)).png().toBuffer()
    image.draw(images(buffer2), 100, 100)
    // console.log(`123123`, buffer)
    console.timeEnd('text svg')

    console.time('render qrcode')
    const qrcode = await QRCode.toBuffer(
      'https://www.npmjs.com/package/qrcode',
      {
        margin: 1,
        width: 160
      }
    )
    image.draw(images(qrcode), 550, 1144) //Drawn logo at coordinates (10,10)
    console.timeEnd('render qrcode')

    const name = `./img/card.${+new Date()}.jpg`

    console.time('save')
    const img = await image.encode('jpg', {
      // 将图像保存到一个文件中，质量为90
      quality: 80
    })
    console.timeEnd('save')

    // fs.unlink(codePath, () => {})
    console.log(`--------------------------------`)

    return img
  } catch (e) {
    console.log(e)
  }
}
