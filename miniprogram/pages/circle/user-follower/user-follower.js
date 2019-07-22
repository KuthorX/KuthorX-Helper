// miniprogram/pages/circle/user-follower/user-follower.js
Page({
  /**
   * Page initial data
   */
  data: {
    followerData: []
  },

  onItemTap: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/circle/user-data/user-data?userId=${id}&originId=${
        this.data.userId
      }`
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "TA的粉丝"
    })
    const userId = options.userId
    if (userId) {
      const that = this
      wx.showLoading({
        title: "加载中",
        mask: true
      })
      wx.cloud
        .callFunction({
          name: "getFollowers",
          data: {
            userId: userId
          }
        })
        .then(res => {
          console.log(res)
          that.setData({
            followerData: res.result.data
          })
        })
        .catch(err => {
          wx.showToast({
            title: "加载失败",
            image: "/images/error.png"
          })
        })
        .finally(function() {
          wx.hideLoading()
        })
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
