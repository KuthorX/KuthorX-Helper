// pages/circle/post-item/post-item.js
const db = wx.cloud.database()

Component({
  lifetimes: {
    attached: function() {
      this.refreshLike()
    }
  },
  /**
   * Component properties
   */
  properties: {
    data: {
      type: Object,
      value: {}
    },
    originId: {
      type: String,
      value: undefined
    },
    dontGoDetail: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {
    photoUrl: "",
    likeCount: "loading",
    liked: false,
  },

  /**
   * Component methods
   */
  methods: {
    onItemTap: function() {
      if(!this.properties.dontGoDetail) {
        wx.navigateTo({
          url: `/pages/circle/poster-detail/poster-detail?posterId=${this.properties.data._id}&originId=${this.properties.originId}`
        })
      }
    },
    refreshLike: function() {
      const that = this
      db.collection("poster_likes").where({
        posterId: this.properties.data._id
      }).count().then(res => {
        that.setData({
          likeCount: res.total,
        })
      }).catch(error => {
        that.setData({
          likeCount: 0,
        })
      })
      db.collection("poster_likes").where({
        posterId: this.properties.data._id,
        likeId: this.properties.originId,
      }).get().then(res => {
        that.setData({
          liked: res.data.length > 0,
        })
      }).catch(error => {
        that.setData({
          liked: false,
        })
      })
    },
    onAuthorTap: function() {
      wx.navigateTo({
        url: `/pages/circle/user-data/user-data?userId=${
          this.properties.data.authorId
        }&originId=${this.properties.originId}`
      })
    },
    onImgTap: function() {
      const photoId = this.properties.data.photoId
      wx.previewImage({
        urls: [photoId],
        fail: function() {
          wx.showToast({
            title: "读取大图失败",
            image: "/images/error.png"
          })
        }
      })
    },
    onLikeTap: function() {
      if (!this.properties.originId) return
      const that = this
      if (this.data.liked) {
        wx.showLoading({
          title: "操作中",
          mask: true
        })
        wx.cloud
          .callFunction({
            name: "cancelLiked",
            data: {
              posterId: this.properties.data._id,
              likeId: this.properties.originId
            }
          })
          .then(res => {
            wx.showToast({
              title: "取消成功"
            })
            that.refreshLike()
            that.triggerEvent('likeEvent');
          })
          .catch(error => {
            wx.showToast({
              title: "取消失败",
              image: "/images/error.png"
            })
          })
          .finally(wx.hideLoading())
      } else {
        wx.showLoading({
          title: "操作中",
          mask: true
        })
        db.collection("poster_likes").add({
            data: {
              posterId: this.properties.data._id,
              likeId: this.properties.originId
            }
          }).then(res => {
            wx.showToast({
              title: "已赞"
            })
            that.refreshLike()
            that.triggerEvent('likeEvent');
          })
          .catch(error => {
            wx.showToast({
              title: "赞失败",
              image: "/images/error.png"
            })
          })
          .finally(wx.hideLoading())
      }

    },
    onItemLongTap: function() {
      const that = this
      if (this.properties.originId === this.properties.data.authorId) {
        wx.showActionSheet({
          itemList: ["删除此动态"],
          success: function(e) {
            const i = e.tapIndex
            if (i === 0) {
              wx.cloud
                .callFunction({
                  name: "deletePoster",
                  data: {
                    _id: that.properties.data._id
                  }
                })
                .then(res => {
                  wx.showToast({
                    title: "删除成功"
                  })
                  that.triggerEvent('deleteEvent');
                })
                .catch(err => {
                  console.log(err)
                  wx.showToast({
                    title: "删除失败",
                    image: "/images/error.png"
                  })
                })
            }
          }
        })
      }
    }
  }

})