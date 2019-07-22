// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

const MAX_LIMIT = 100

async function getDbData(dbName, whereObj) {
  const totalCountsData = await db.collection(dbName).where(whereObj).count()
  const total = totalCountsData.total
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
exports.main = async (event, context) => {
  const text = event.text
  const data = await getDbData("poster_users", {
    name: {
      $regex: text
    }
  })
  return data
}