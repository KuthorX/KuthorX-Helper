// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const result = await db.collection("poster_user_follows")
    .where({
      followerId: event.followerId,
      followingId: event.followingId,
    })
    .remove()
  return result
}