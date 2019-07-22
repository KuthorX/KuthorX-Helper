// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const followingResult = await db.collection("poster_user_follows")
    .where({
      followingId: event.followingId,
      followerId: event.followerId
    }).get()
  return followingResult
}