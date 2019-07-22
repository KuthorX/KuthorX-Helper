// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const test = await db.collection("poster").where({
    authorId: "93db88df603dbeccac52f65c68dfc21c86ff2cbb"
  }).get()
  return test
}