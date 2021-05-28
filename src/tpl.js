
const getHtml = config => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    *{
      margin: 0;padding:0;border: 0;outline: 0
    }
    .img{
      position: relative;width: ${config.width}px; height: ${config.height}px;
    }
    .poster{
      width: 100%;
      display: block
    }
    .code{
      position: absolute;
      right: ${config.codeRight}px;
      bottom: ${config.codeBottom}px;
      width: ${config.codeSize}px;
    }
    .name{
      position: absolute;
      left: 20px;
      top: 20px;
    }
  </style>
</head>
<body>
  <div class="img">
    <img class="poster" src="${config.poster}" />
    <img class="code" src="${config.code}" />
    <span class="name">${config.name}</span>
  </div>
</body>
</html>
`

module.exports = getHtml