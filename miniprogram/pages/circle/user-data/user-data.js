// miniprogram/pages/circle/user-data.js
Page({
  /**
   * Page initial data
   */
  data: {
    userName: "Loading",
    posterCount: "Loading",
    followingCount: "Loading",
    followerCount: "Loading",
    userId: "",
    originId: ""
  },

  getUserData: function(userId, originId) {
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
          ...res.result
        })
        wx.hideLoading()
      })
      .catch(err => {
        wx.showToast({
          title: "获取个人信息失败",
          image: "/images/error.png"
        })
        wx.hideLoading()
      })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "个人信息"
    })
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    if (options) {
      if (options.userId) {
        this.setData({
          userId: options.userId
        })
        this.getUserData(options.userId)
      }
      if (options.originId) {
        this.setData({
          originId: options.originId
        })
      }
    }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {},

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {},

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
