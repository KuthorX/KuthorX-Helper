// miniprogram/pages/circle/search-user/search-user.js
Page({
  /**
   * Page initial data
   */
  data: {
    text: "",
    searchData: [],
    userId: undefined
  },

  onSearchItemTap: function(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/circle/user-data/user-data?userId=${id}&originId=${
        this.data.userId
      }`
    })
  },

  bindTextInput: function(e) {
    const t = e.detail.value
    this.setData({
      text: t
    })
  },

  onSearchTap: function() {
    wx.showLoading({
      title: "查找中",
      mask: true
    })
    const that = this
    wx.cloud
      .callFunction({
        name: "searchUsers",
        data: {
          text: that.data.text
        }
      })
      .then(res => {
        wx.hideLoading()
        that.setData({
          searchData: res.result.data
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
      title: "搜索用户"
    })
    if (options) {
      if (options.userId) {
        this.setData({
          userId: options.userId
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
