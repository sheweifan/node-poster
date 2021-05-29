const fs = require('fs')
const images = require('images')
const TextToSVG = require('text-to-svg')
const svg2png = require('svg2png')
const sharp = require('sharp')
const path = require('path')
const Promise = require('bluebird')
var QRCode = require('qrcode')
var text2png = require('text2png')



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

    console.time('load source image')
    const image = images(sourceImg) // 从文件中加载图片
    console.timeEnd('load source image')

    console.time('text svg')
    const svg1 = textToSVG.getSVG('测试2222', {
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

    const buffer2 = await sharp(svgpath).png().toBuffer()
    image.draw(images(buffer2), 100, 100)
    // console.log(`123123`, buffer)
    console.timeEnd('text svg')


    // console.log(1, image)

    // 首次600ms
    // console.time('render text')
    // const buffer = text2png('测试中文', {
    //   output: 'buffer',
    //   fontSize: 50,
    //   color: '#000'
    // })
    // image.draw(images(buffer), 20, 20)
    // console.timeEnd('render text')


    console.time('render qrcode')
    const qrcode = await QRCode.toBuffer('I am a pony!', {
      margin: 1
    })
    image.draw(images(qrcode), 300, 500) //Drawn logo at coordinates (10,10)
    console.timeEnd('render qrcode')

    const name = `./img/card.${+new Date()}.jpg`

    console.time('save')
    await image.save(name, {
      // 将图像保存到一个文件中，质量为90
      quality: 80
    })
    console.timeEnd('save')

    // fs.unlink(codePath, () => {})
    console.log(`--------------------------------`)


    setImmediate(() => {
      console.time('delete')
      fs.unlink(svgpath, () => {})
      // fs.unlink(codePath, () => {})
      console.timeEnd('delete')
    })

    return name
  } catch (e) {
    console.log(e)
  }
}
