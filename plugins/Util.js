import Vue from 'vue'

Vue.mixin({
  methods: {
    axiosNoAuthCheck(error) {
      return (error.response && (error.response.status === 401 || error.response.status === 403));
    }
  }
})
