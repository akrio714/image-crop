<template>
  <div class="filter-page">
    <div class="top-header">
      <div class="left-icon">关闭</div>
      <div class="title">裁切</div>
      <div class="next-btn">继续</div>
    </div>
    <div class="crop-container">

    </div>
    <div class="filter-list-container">
      <div v-for="i in 10" :key="i">
          <div class="filter-item"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterPage',
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.filter-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  // 最上方头样式
  .top-header {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    color: rgba(56, 151, 240);
    .left-icon {
      width: 44px;
      text-align: left;
    }
    .title {
      flex: 1;
      color: black;
      text-align: center;
    }
    .next-btn {
      width: 44px;
      text-align: right;
    }
  }
  .crop-container {
    width: 100vw;
    height: 100vw;
    background: gray;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .filter-list-container {
    flex: 1;
    overflow-x: scroll;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    white-space: nowrap;
    width: 100vw;
    .filter-item {
        height: 100px;
        width: 100px;
        background: red;
        margin: 0 10px;
        white-space: nowrap;
    }
  }
}
</style>
