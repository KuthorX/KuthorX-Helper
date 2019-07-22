// miniprogram/pages/circle/poster-detail/poster-detail.js
wx.cloud.init();
const db = wx.cloud.database();

Page({

  /**
   * Page initial data
   */
  data: {
    posterId: undefined,
    originId: undefined,
    posterData: undefined,
    likeList: [],
    currentPage: "like"
  },

  onItemDelete: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  onItemLike: function() {
    if (this.data.posterId) {
      this.getLikeList(this.data.posterId)
    }
  },

  onLikeItemTap: function(e) {
    const id = e.currentTarget.dataset.likeId
    wx.navigateTo({
      url: `/pages/circle/user-data/user-data?userId=${this.data.posterData.authorId}&originId=${this.data.originId}`
    })
  },

  onLikeBtnTap: function() {
    if(this.data.posterId) {
      this.getLikeList(this.data.posterId)
    }
  },

  getLikeList: function(posterId) {
    const that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: "getPosterLikes",
      data: {
        posterId: posterId
      }
    }).then(res => {
      that.setData({
        likeList: res.result
      })
    }).catch(err => {
      wx.showToast({
        title: '加载失败',
        image: "/images/error.png"
      })
      wx.navigateBack({
        delta: 1
      })
    }).finally(() => {
      wx.hideLoading()
    })
  },

  getPosterData: function(posterId) {
    const that = this
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.cloud.callFunction({
      name: "getPosterData",
      data: {
        posterId: posterId
      }
    }).then(res => {
      that.setData({
        posterData: res.result
      })
    }).catch(err => {
      wx.showToast({
        title: '加载失败',
        image: "/images/error.png"
      })
      wx.navigateBack({
        delta: 1
      })
    }).finally(() => {
      wx.hideLoading()
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "动态详情"
    })
    if (options.posterId) {
      this.setData({
        posterId: options.posterId,
        originId: options.originId
      })
      this.getPosterData(options.posterId)
      this.getLikeList(options.posterId)
    }

  },



  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})