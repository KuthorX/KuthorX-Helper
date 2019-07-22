// 云函数入口文件
const cloud = require("wx-server-sdk")
cloud.init()
const db = cloud.database()

async function getPosterCount(userId) {
  return {
    value: (await db.collection("poster").where({
      authorId: userId
    }).count()).total,
    key: "posterCount"
  }
}

async function getFollowingCount(userId) {
  return {
    value: (await db.collection("poster_user_follows").where({
      followerId: userId
    }).count()).total,
    key: "followingCount"
  }
}

async function getFollowerCount(userId) {
  return {
    value: (await db.collection("poster_user_follows").where({
      followingId: userId
    }).count()).total,
    key: "followerCount"
  }
}


async function getUserName(userId) {
  return {
    value: (await db.collection("poster_users").where({
      userId: userId
    }).get()).data[0].name,
    key: "userName"
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const userId = event.userId
  // const userName = await db.collection("poster_users").where({
  //   userId: userId
  // })
  // const posterCount = await db.collection("poster").where({
  //   authorId: userId
  // }).count()
  // const followingCount = await db.collection("poster_user_follows").where({
  //   followerId: userId
  // }).count()
  // const followerCount = await db.collection("poster_user_follows").where({
  //   followingId: userId
  // }).count()

  const tasks = []
  tasks.push(getPosterCount(userId))
  tasks.push(getFollowerCount(userId))
  tasks.push(getFollowingCount(userId))
  tasks.push(getUserName(userId))

  const allData = await Promise.all(tasks)
  const finalData = {}
  allData.map(d => {
    finalData[d.key] = d.value
  })

  return finalData
}