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
  const posterData = await db.collection("poster").doc(event.posterId).get()
  const posterInner = posterData.data
  const authorId = posterInner.authorId
  const authorInfo = await db.collection("poster_users").where({
    userId: authorId
  }).get()
  const name = authorInfo.data[0].name
  posterInner.author = name
  posterInner.formatDate = new Date(posterInner.date).toLocaleDateString("zh-Hans", options)
  return posterInner
}