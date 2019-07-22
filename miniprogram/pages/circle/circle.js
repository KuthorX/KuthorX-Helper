// miniprogram/pages/circle.js

wx.cloud.init()
const db = wx.cloud.database()

Page({
  /**
   * Page initial data
   */
  data: {
    pageMainLoaded: false,
    pageMeLoaded: false,
    userId: undefined,
    addPosterBtnBottom: "190rpx",
    mainHeaderMaxHeight: "80rpx",
    mainAreaHeight: "calc(100vh - 200rpx)",
    mainAreaMarginTop: "80rpx",
    groupArray: ["关注动态", "所有动态"],
    groupArrayIndex: 0,
    // main, msg, me
    currentPage: "main",
    pageMainData: [],
    userName: "Loading",
    posterCount: "Loading",
    followingCount: "Loading",
    followerCount: "Loading"
  },

  onItemDelete: function() {
    this.refreshMainPageData()
  },

  onAddPosterTap: function() {
    wx.navigateTo({
      url: "add-poster/add-poster"
    })
  },

  onMainPageScroll: function(e) {
    if (e.detail.deltaY < 0) {
      this.setData({
        addPosterBtnBottom: "-190rpx",
        mainHeaderMaxHeight: "0",
        mainAreaHeight: "calc(100vh - 120rpx)",
        mainAreaMarginTop: "0rpx"
      })
    } else {
      this.setData({
        addPosterBtnBottom: "190rpx",
        mainHeaderMaxHeight: "80rpx",
        mainAreaHeight: "calc(100vh - 200rpx)",
        mainAreaMarginTop: "80rpx"
      })
    }
  },

  bindGroupPickerChange: function(e) {
    const that = this
    this.setData(
      {
        groupArrayIndex: e.detail.value
      },
      function() {
        that.refreshMainPageData()
      }
    )
  },

  onSearchTap: function() {
    wx.navigateTo({
      url: "/pages/circle/search-user/search-user?userId=" + this.data.userId
    })
  },

  onPageMainTap: function() {
    if (this.data.currentPage === "main") {
      this.refreshMainPageData()
    }
    this.setData({
      currentPage: "main"
    })
  },

  onPageMsgTap: function() {
    this.setData({
      currentPage: "msg"
    })
  },

  onPageMeTap: function() {
    if (this.data.currentPage === "me") {
      this.refreshMePageData()
    }
    this.setData({
      currentPage: "me"
    })
  },

  getUserId: function(cb) {
    let that = this
    var value = this.data.userId || wx.getStorageSync("userId")
    console.log(value)
    if (value) {
      if (cb) {
        cb(value)
      }
      return value
    }
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            withCredentials: true,
            success: function(userData) {
              wx.setStorageSync("userId", userData.signature)
              that.setData({
                userId: userData.signature
              })
              db.collection("poster_users")
                .where({
                  userId: userData.signature
                })
                .get()
                .then(searchResult => {
                  if (searchResult.data.length === 0) {
                    wx.showToast({
                      title: "新用户录入中"
                    })
                    db.collection("poster_users")
                      .add({
                        data: {
                          userId: userData.signature,
                          date: db.serverDate(),
                          name: userData.userInfo.nickName,
                          gender: userData.userInfo.gender
                        }
                      })
                      .then(res => {
                        console.log(res)
                        if (res.errMsg === "collection.add:ok") {
                          wx.showToast({
                            title: "录入完成"
                          })
                          if (cb) cb()
                        }
                      })
                      .catch(err => {
                        wx.showToast({
                          title: "录入失败，请稍后重试",
                          image: "/images/error.png"
                        })
                        wx.navigateTo({
                          url: "/pages/index/index"
                        })
                      })
                  } else {
                    if (cb) cb()
                  }
                })
            }
          })
        } else {
          wx.showToast({
            title: "登陆失效，请重新授权登陆",
            image: "/images/error.png"
          })
          wx.navigateTo({
            url: "/pages/index/index"
          })
        }
      }
    })
  },

  onAllLoad: function() {
    wx.hideLoading()
  },

  getMainPageData: function(userId) {
    const that = this
    wx.cloud
      .callFunction({
        name: "getMainPageData",
        data: {
          userId: userId,
          isEveryOne: that.data.groupArrayIndex === 0 ? false : true
        }
      })
      .then(res => {
        that.setData({
          pageMainData: res.result,
          pageMainLoaded: true
        })
      })
      .catch(err => {
        wx.showToast({
          title: "获取动态失败",
          image: "/images/error.png"
        })
        wx.hideLoading()
      })
  },

  refreshMainPageData: function(userId) {
    try {
      userId = userId || this.data.userId || wx.getStorageSync("userId")
      if (!userId) {
        throw Error
      }
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      this.getMainPageData(userId)
    } catch (e) {
      console.log(e)
      wx.hideLoading()
      wx.showToast({
        title: "获取用户信息失败，请重新授权登陆",
        image: "/images/error.png"
      })
      wx.navigateTo({
        url: "/pages/index/index"
      })
    }
  },

  getMePageData: function(userId) {
    const that = this
    wx.cloud
      .callFunction({
        name: "getMePageData",
        data: {
          userId: userId
        }
      })
      .then(res => {
        that.setData({
          ...res.result,
          pageMeLoaded: true
        })
      })
      .catch(err => {
        wx.showToast({
          title: "获取信息失败",
          image: "/images/error.png"
        })
        wx.hideLoading()
      })
  },

  refreshMePageData: function(userId) {
    try {
      userId = userId || this.data.userId || wx.getStorageSync("userId")
      if (!userId) {
        throw Error
      }
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      this.getMePageData(userId)
    } catch (e) {
      wx.hideLoading()
      wx.showToast({
        title: "获取用户信息失败，请重新授权登陆",
        image: "/images/error.png"
      })
      wx.navigateTo({
        url: "/pages/index/index"
      })
    }
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "小圈圈"
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    const that = this
    function cb(userId) {
      that.refreshMainPageData(userId)
      that.refreshMePageData(userId)
    }
    this.getUserId(cb)
  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {},

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {},

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {},

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {}
})
