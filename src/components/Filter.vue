<!--
 * @Author: akrio
 * @Date: 2019-12-09 21:17:42
 * @LastEditTime: 2019-12-09 22:20:31
 * @LastEditors: Please set LastEditors
 * @Description: 滤镜样式页面
 * @FilePath: /image-crop/src/components/Filter.vue
 -->
<template>
  <div class="filter-page-component">
    <crop-header type="filter"></crop-header>
    <div class="header-image-list">
        <div class="image-item" v-for="i in 10" :key="i">1</div>
    </div>
  </div>
</template>

<script>
import CropHeader from '@/components/Header'
export default {
  name: 'FilterComponent',
  components: { CropHeader }
}
</script>

<style scoped lang="less">
.filter-page-component {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .header-image-list {
      height: 100vw;
      width: 100vw;
      overflow-x: scroll;
      .image-item{
        height: 150px;
        width: 150px;
        background: red;
        margin: 0 7px;
        display: inline-block;
      }
  }
}
</style>