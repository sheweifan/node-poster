const fs = require('fs')
const images = require('images')
const TextToSVG = require('text-to-svg')
const svg2png = require('svg2png')
const sharp = require('sharp')
const path = require('path')
const Promise = require('bluebird')
var QRCode = require('qrcode')

const imgPath = value => {
  return path.join(__dirname, value)
}

// // 引入默认背景图
// const sWidth = sourceImg.width()
// const sHeight = sourceImg.height()
const textToSVG = TextToSVG.loadSync(imgPath('../font/weiruanyahei.ttf'))

Promise.promisifyAll(fs)

module.exports = async () => {
  try {
    const sourceImg = images(imgPath('../example.png'))
    
    console.time('text svg')

    const svg1 = textToSVG.getSVG('测试', {
      x: 0, // 文本开头的水平位置（默认值：0）
      y: 0, // 文本的基线的垂直位置（默认值：0）
      fontSize: 50, // 文本的大小（默认：）72
      // letterSpacing: "",          // 设置字母的间距
      anchor: 'top' // 坐标中的对象锚点
    })
    const svgOne = svg1.replace(
      `xmlns="http://www.w3.org/2000/svg"`,
      `fill="#000" xmlns="http://www.w3.org/2000/svg"`
    )

    console.timeEnd('text svg')

    console.time('text to buffer')

    // const buffer = await sharp(svgOne)
    // .resize(200, 200)
    //   .composite([
    //     {
    //       input: Buffer.from(svgOne),
    //     }
    //   ])
    //   .png() // await svg2png(svgOne)
    // .toBuffer()
    // console.log(buffer)
    const svgpath = imgPath(`../img/svg${+new Date()}.svg`)
    await fs.writeFileAsync(svgpath, svgOne)

    const buffer = await sharp(svgpath).png().toBuffer()
    // console.log(`123123`, buffer)

    console.timeEnd('text to buffer')

    // console.log(buffer)

    console.time('load source image')
    const image = images(sourceImg) // 从文件中加载图片
    console.timeEnd('load source image')

    // console.log(1, image)

    console.time('render text')
    image.draw(images(buffer), 20, 20)
    console.timeEnd('render text')

    console.time('render qrcode img')
    const codePath = imgPath(`../img/code${+new Date()}.png`)
    const qrcode = await QRCode.toFile(codePath, 'I am a pony!', {
      margin: 1
    })
    // await fs.writeFileAsync(codePath, dataBuffer)
    // console.log(qrcode)
    console.timeEnd('render qrcode img')

    console.time('render qrcode')
    image.draw(images(codePath), 300, 500) //Drawn logo at coordinates (10,10)
    console.timeEnd('render qrcode')

    // console.log(2, image)
    const name = `./img/card.${+new Date()}.jpg`

    console.time('save')
    await image.save(name, {
      // 将图像保存到一个文件中，质量为90
      quality: 80
    })
    console.timeEnd('save')

    console.log(`--------------------------------`)
    // console.log(`images.getUsedMemory()`, images.getUsedMemory())

    setImmediate(() => {
      console.time('delete')
      fs.unlink(svgpath, () => {})
      fs.unlink(codePath, () => {})
      console.timeEnd('delete')
    })

    return name
  } catch (e) {
    console.log(e)
  }
}
