// 云函数入口文件
const cloud = require("wx-server-sdk")
cloud.init()
const db = cloud.database()

const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23"
}

// 云函数入口函数
exports.main = async (event, context) => {
  const likesData = await db.collection("poster_likes").where({
    posterId: event.posterId
  }).get()
  const likesInner = likesData.data
  const likeUserIds = likesInner.map(l => {
    return l.likeId
  })
  const userInfos = await db.collection("poster_users").where({
    userId: db.command.in(likeUserIds)
  }).get()
  const userInner = userInfos.data
  const idNameMap = {}
  userInner.map(u => {
    idNameMap[u.userId] = u.name
  })
  likesInner.map(l => {
    l.name = idNameMap[l.likeId]
  })
  return likesInner
}