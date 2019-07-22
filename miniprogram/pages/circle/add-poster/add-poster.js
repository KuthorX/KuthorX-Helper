// miniprogram/pages/circle/add-poster/add-poster.js

wx.cloud.init()
const db = wx.cloud.database()

Page({
  /**
   * Page initial data
   */
  data: {
    userId: undefined,
    text: "",
    remainLen: 140,
    imageSrc: "",
    clickable: true
  },

  bindTextInput: function(e) {
    const t = e.detail.value
    const len = e.detail.value.length
    const r = 140 - len
    this.setData({
      text: e.detail.value,
      remainLen: r
    })
  },

  sendToDb: function(fileId = "") {
    const that = this
    const posterData = {
      authorId: that.data.userId,
      msg: that.data.text,
      photoId: fileId,
      date: db.serverDate()
    }
    db.collection("poster")
      .add({
        data: {
          ...posterData
        }
      })
      .then(res => {
        wx.showToast({
          title: "发送成功"
        })
        wx.navigateBack({
          delta: 1
        })
      })
      .catch(error => {
        that.onSendFail()
      })
      .finally(wx.hideLoading())
  },

  onSendFail: function() {
    wx.hideLoading()
    wx.showToast({
      title: "发送失败",
      image: "/images/error.png"
    })
    this.setData({
      clickable: true
    })
  },

  onSendTap: function() {
    if (this.data.text === "" && this.data.imageSrc === "") {
      wx.showModal({
        title: "错误",
        content: "不能发送空内容",
        showCancel: false,
        confirmText: "好的"
      })
      return
    }
    if (!this.data.clickable) return
    this.setData({
      clickable: false
    })
    const that = this
    wx.showLoading({
      title: "发送中",
      mask: true
    })
    const imageSrc = this.data.imageSrc
    if (imageSrc !== "") {
      const finalPath = imageSrc.replace("//", "/").replace(":", "")
      wx.cloud
        .uploadFile({
          cloudPath: finalPath,
          filePath: imageSrc // 文件路径
        })
        .then(res => {
          that.sendToDb(res.fileID)
        })
        .catch(error => {
          that.onSendFail()
        })
    } else {
      that.sendToDb()
    }
  },

  onImageTap: function() {
    let that = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          imageSrc: tempFilePaths[0]
        })
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "编辑新动态"
    })
    try {
      var value = wx.getStorageSync("userId")
      if (!value) {
        wx.showToast({
          title: "获取用户信息失败，请重新授权登陆",
          image: "/images/error.png"
        })
        wx.navigateTo({
          url: "/pages/index/index"
        })
      } else {
        this.setData({
          userId: value
        })
      }
    } catch (e) {
      wx.showToast({
        title: "获取用户信息失败，请重新授权登陆",
        image: "/images/error.png"
      })
      wx.navigateTo({
        url: "/pages/index/index"
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
