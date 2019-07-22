// pages/circle/component/image-wrapper/image-wrapper.js
Component({
  lifetimes: {
    attached: function() {
      const p = this.properties.placeholder
      this.setData({
        placeText: p
      })
    }
  },
  /**
   * Component properties
   */
  properties: {
    src: {
      type: String,
      value: ""
    },
    placeholder: {
      type: String,
      value: "加载中"
    }
  },

  /**
   * Component initial data
   */
  data: {
    isShowPlaceholdler: true,
    placeText: "",
  },

  /**
   * Component methods
   */
  methods: {
    onImageLoad: function () {
      this.setData({
        isShowPlaceholdler: false,
      })
    },
    onImageError: function() {
      this.setData({
        placeText: "加载失败"
      })
    }
  }
})
