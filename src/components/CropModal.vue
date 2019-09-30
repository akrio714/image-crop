<template>
  <el-dialog title="裁切"
             :visible.sync="showModal">
    <div></div>
  </el-dialog>
</template>
<style lang="less" scoped>
.crop-modal {
}
</style>
<script>
export default {
  name: 'CropModalComponent',
  data () {
    return {
      showModal: true
    }
  }
}
</script>