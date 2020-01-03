<!--
 * @Author: your name
 * @Date: 2019-12-07 07:30:55
 * @LastEditTime: 2019-12-09 20:57:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /image-crop/src/views/Demo.vue
 -->
<template>
  <div class="demo-page">
    <select-image :libraryList="imageList"></select-image>
  </div>
</template>

<script>
import img6 from '../../public/images/6.jpg'
import img18 from '../../public/images/18.jpg'
import img20 from '../../public/images/24.png'
import img21 from '../../public/images/23.png'
import SelectImage from '../components/SelectImage'
export default {
  name: 'DemoPage',
  components: { SelectImage },
  data () {
    return {
      imageList: [img18, img6,img20,img21], // 可选图片列表
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.demo-page {
}
</style>
