var siege = require('siege')
siege() // node server.js为服务启动脚本
  .wait(5000)
  .on(3002) //被压测的服务端口
  .concurrent(20) //并发数
  .for(20)
  .times //或者.seconds
  .get('/poster') //需要压测的页面
  .attack() //执行压测

// siege('npm run dev') // node server.js为服务启动脚本
//   .wait(5000)
//   .on(3001) //被压测的服务端口
//   .concurrent(20) //并发数
//   .for(20)
//   .times //或者.seconds
//   .get('/poster') //需要压测的页面
//   .attack() //执行压测
