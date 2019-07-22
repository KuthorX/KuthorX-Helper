// miniprogram/pages/circle/user-poster/user-poster.js
Page({
  /**
   * Page initial data
   */
  data: {
    userId: undefined,
    search: undefined,
    userPostData: []
  },

  getUserPostData: function(userId) {
    const that = this
    wx.cloud
      .callFunction({
        name: "getMainPageData",
        data: {
          userId: userId,
          isOnlyMe: true
        }
      })
      .then(res => {
        wx.hideLoading()
        console.log(res)
        that.setData({
          userPostData: res.result
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

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "个人动态"
    })
    wx.showLoading({
      title: "加载中",
      mask: true
    })
    this.setData({
      search: options
    })
    if (options) {
      if (options.userId) {
        this.setData({
          userId: options.userId
        })
        this.getUserPostData(options.userId)
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
