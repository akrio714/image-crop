<template>
  <div class="top-header">
    <div class="left-icon"
         @click="toPrevPage">{{prevBtnText}}</div>
    <div class="title"></div>
    <div class="next-btn"
         @click="toNextPage">{{nextBtnText}}</div>
  </div>
</template>

<script>
export default {
  name: 'HeaderComponent',
  props: {
    type: { // crop:裁切页面 filter:滤镜 draw:涂鸦
      type: String,
      default: 'crop'
    }
  },
  methods: {
    toPrevPage () {
      this.$emit('prev')
    },
    toNextPage () {
      this.$emit('next')
    }
  },
  computed: {
    prevBtnText () {
      let text = ''
      switch (this.type) {
        case 'crop':
          text = '取消'
          break
        case 'filter':
          text = '后退'
          break
        case 'draw':
          text = '后退'
          break
        default:
          text = '位置'
      }
      return text
    },
    nextBtnText () {
      let text = ''
      switch (this.type) {
        case 'crop':
          text = '继续'
          break
        case 'filter':
          text = '继续'
          break
        case 'draw':
          text = '继续'
          break
        default:
          text = '继续'
      }
      return text
    }
  }
}
</script>

<style lang="less" scoped>
// 最上方头样式
.top-header {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  .left-icon {
    width: 44px;
    text-align: left;
    color: gray;
  }
  .title {
    flex: 1;
    color: black;
    text-align: center;
  }
  .next-btn {
    width: 44px;
    text-align: right;
    color: rgba(56, 151, 240);
  }
}
</style>