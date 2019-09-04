<template>
  <div class="demo-page">
    111
      <crop-modal></crop-modal>
  </div>
</template>

<script>
import CropModal from '../components/CropModal'
export default {
  name: 'DemoPage',
  components:{CropModal}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.demo-page{
    width: 100vw;
    height: 100vh;
}
</style>
