<!--
 * @Author: your name
 * @Date: 2019-12-07 07:30:55
 * @LastEditTime: 2019-12-09 21:36:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /image-crop/src/views/Filter.vue
 -->
<template>
  <div class="filter-page">
    <image-filter></image-filter>
  </div>
</template>

<script>
import imageFilter from '../components/Filter'
export default {
  name: 'FilterPage',
  components:{imageFilter}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.filter-page {
}
</style>
