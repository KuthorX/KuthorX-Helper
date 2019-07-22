// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)

  const content = event.Content
  if (content === "推理小说") {
    const db = cloud.database()
    const countResult = await db.collection('books').count()
    const id = getRandomInt(countResult.total) + 1
    const result = await db.collection('books').where({
        id: id
      })
      .get()
    const data = result.data[0]
    const resultString = `中文基本信息:\n${data.ch}\n英文基本信息:\n${data.en}\n基本介绍:\n${data.intro}`
    await cloud.openapi.customerServiceMessage.send({
      touser: wxContext.OPENID,
      msgtype: 'text',
      text: {
        content: resultString,
      },
    })

    return 'success'
  }

  const test = {
    "ToUserName": "toUser",
    "FromUserName": "fromUser",
    "CreateTime": 1482048670,
    "MsgType": "text",
    "Content": "this is a test",
    "MsgId": 1234567890123456
  }

  await cloud.openapi.customerServiceMessage.send({
    touser: wxContext.OPENID,
    msgtype: 'text',
    text: {
      content: '不识别的信息哦，请输入其他信息吧！\n目前客服支持：\n1. 推理小说推荐：发送“推理小说”即可随机获得一本推理小说信息\n即将上线：\n1. 淘金记',
    },
  })

  // return 'success'
}