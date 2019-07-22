// pages/circle/component/user-info/user-info.js
const db = wx.cloud.database()

Component({
  lifetimes: {
    attached: function() {}
  },

  observers: {
    "originId, userId": function(originId, userId) {
      const that = this
      if (originId && userId && originId !== userId) {
        wx.cloud
          .callFunction({
            name: "getIfFollow",
            data: {
              follwerId: originId,
              followingId: userId
            }
          })
          .then(res => {
            const len = res.result.data.length
            that.setData({
                isFollow: len > 0
              },
              function() {
                if (len > 0) {
                  this.setData({
                    followText: "取消关注"
                  })
                } else {
                  this.setData({
                    followText: "关注"
                  })
                }
              }
            )
          })
          .catch(err => {
            wx.showToast({
              title: "获取关系失败",
              image: "/images/error.png"
            })
          })
      }
    }
  },

  /**
   * Component properties
   */
  properties: {
    userId: {
      type: String,
      value: ""
    },
    originId: {
      type: String,
      value: undefined
    },
    userName: {
      type: String,
      value: "Loading"
    },
    posterCount: {
      type: String,
      value: "Loading"
    },
    followingCount: {
      type: String,
      value: "Loading"
    },
    followerCount: {
      type: String,
      value: "Loading"
    }
  },

  /**
   * Component initial data
   */
  data: {
    isFollow: undefined,
    followText: "获取关系中..."
  },

  /**
   * Component methods
   */
  methods: {
    onPosterCountTap: function() {
      if (this.properties.userId !== "") {
        wx.navigateTo({
          url: "/pages/circle/user-poster/user-poster?userId=" +
            this.properties.userId
        })
      }
    },

    onFollowerCountTap: function() {
      if (this.properties.userId !== "") {
        wx.navigateTo({
          url: "/pages/circle/user-follower/user-follower?userId=" +
            this.properties.userId
        })
      }
    },

    onFollowingCountTap: function() {
      if (this.properties.userId !== "") {
        wx.navigateTo({
          url: "/pages/circle/user-following/user-following?userId=" +
            this.properties.userId
        })
      }
    },

    onFollowTap: function() {
      const that = this
      if (this.data.isFollow) {
        wx.showLoading({
          title: "操作中",
          mask: true
        })
        wx.cloud
          .callFunction({
            name: "cancelFollowing",
            data: {
              followerId: this.properties.originId,
              followingId: this.properties.userId
            }
          })
          .then(res => {
            wx.showToast({
              title: "取消关注成功"
            })
            that.setData({
              isFollow: false,
              followText: "关注"
            })
          })
          .catch(error => {
            wx.showToast({
              title: "取消关注失败",
              image: "/images/error.png"
            })
          })
          .finally(wx.hideLoading())
      } else if (this.data.isFollow !== undefined) {
        wx.showLoading({
          title: "操作中",
          mask: true
        })
        const data = {
          followerId: this.properties.originId,
          followingId: this.properties.userId
        }
        db.collection("poster_user_follows")
          .add({
            data: {
              ...data
            }
          })
          .then(res => {
            wx.showToast({
              title: "关注成功"
            })
            that.setData({
              isFollow: true,
              followText: "取消关注"
            })
          })
          .catch(error => {
            wx.showToast({
              title: "关注失败",
              image: "/images/error.png"
            })
          })
          .finally(wx.hideLoading())
      }
    }
  }
})