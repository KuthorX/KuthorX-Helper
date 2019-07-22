// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const userId = event.userId
  const result = await db.collection("poster_user_follows").where({
    followingId: userId
  }).get()
  const followerIds = result.data.map(v => {
    return v.followerId
  })
  const followerInfos = await db.collection("poster_users").where({
    userId: db.command.in(followerIds)
  }).get()
  return followerInfos
}