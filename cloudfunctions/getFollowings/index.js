// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const userId = event.userId
  const result = await db.collection("poster_user_follows").where({
    followerId: userId
  }).get()
  const followingIds = result.data.map(v => {
    return v.followingId
  })
  const followingInfos = await db.collection("poster_users").where({
    userId: db.command.in(followingIds)
  }).get()
  return followingInfos
}