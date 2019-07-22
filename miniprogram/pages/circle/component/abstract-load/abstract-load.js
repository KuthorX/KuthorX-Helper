// pages/circle/component/abstract-load.js
Component({
  /**
   * Component properties
   */
  properties: {
    pageMainLoaded: {
      type: Boolean,
      value: false
    },
    pageMeLoaded: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Component initial data
   */
  data: {},

  observers: {
    "pageMainLoaded, pageMeLoaded": function(pageMainLoaded, pageMeLoaded) {
      if (pageMainLoaded && pageMeLoaded) {
        this.triggerEvent("allLoadEvent")
      }
    }
  },

  /**
   * Component methods
   */
  methods: {}
})
