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

const MAX_LIMIT = 100

async function getDbData(dbName, whereObj) {
  const totalCountsData = await db
    .collection(dbName)
    .where(whereObj)
    .count()
  const total = totalCountsData.total
  console.log(total)
  const batch = Math.ceil(total / 100)
  const tasks = []
  for (let i = 0; i < batch; i++) {
    const promise = db
      .collection(dbName)
      .where(whereObj)
      .skip(i * MAX_LIMIT)
      .limit(MAX_LIMIT)
      .get()
    tasks.push(promise)
  }
  const rrr = await Promise.all(tasks)
  if (rrr.length !== 0) {
    return rrr.reduce((acc, cur) => {
      console.log(acc)
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg
      }
    })
  } else {
    return {
      data: [],
      errMsg: "empty"
    }
  }
}

// 云函数入口函数
exports.main = async (event, context, cb) => {
  const userId = event.userId
  const isEveryOne = event.isEveryOne
  const isOnlyMe = event.isOnlyMe
  let followingResult
  let users
  let idNameMap = {}
  let followingIds = []
  if (isEveryOne) {
    // followingResult = await getDbData("poster_users", {})
    followingResult = await db.collection("poster_users").get()
    users = followingResult.data
    followingIds = users.map(u => {
      return u.userId
    })
  } else if (isOnlyMe) {
    // followingResult = await getDbData("poster_users", {
    //   userId: userId
    // })
    followingResult = await db
      .collection("poster_users")
      .where({
        userId: userId
      })
      .get()
    users = followingResult.data
    followingIds = users.map(u => {
      return u.userId
    })
  } else {
    // followingResult = await getDbData("poster_user_follows", {
    //   followerId: userId
    // })
    followingResult = await db
      .collection("poster_user_follows")
      .where({
        followerId: userId
      })
      .get()
    const following = followingResult.data
    followingIds = following.map(f => {
      return f.followingId
    })
    followingIds.push(userId)
    // const userData = await getDbData("poster_users", {
    //   userId: db.command.in(followingIds)
    // })
    userData = await db
      .collection("poster_users")
      .where({
        userId: db.command.in(followingIds)
      })
      .get()
    users = userData.data
  }
  users.map(u => {
    idNameMap[u.userId] = u.name
  })
  console.log(idNameMap)
  // 获取动态
  // const postResult = await getDbData("poster", {
  //   authorId: db.command.in(followingIds)
  // })
  const postResult = await db
    .collection("poster")
    .orderBy("date", "desc")
    .where({
      authorId: db.command.in(followingIds)
    })
    .get()
  const postData = postResult.data
  console.log(postData)
  postData.map(p => {
    p.author = idNameMap[p.authorId]
    p.formatDate = new Date(p.date).toLocaleDateString("zh-Hans", options)
  })
  console.log(postData)
  return postData
}
