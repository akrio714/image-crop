<!--
 * @Author: akrio
 * @Date: 2019-12-13 09:46:43
 * @LastEditTime: 2019-12-13 10:53:38
 * @LastEditors: Please set LastEditors
 * @Description: 缩略图DS
 * @FilePath: /image-crop/src/components/Thumbnail.vue
 -->
<template>
  <div class="thumbnail-crop-container"
       ref="thumbnail">
  </div>
</template>

<script>
import Hammer from 'hammerjs'
export default {
  name: 'ThumbnailComponent',
  mounted () {
    // Create an instance of Hammer with the reference.
    const thumbnailHammer = new Hammer(this.$refs.thumbnail);
    thumbnailHammer.get('press').set({
        time: 1000,
        pointers: 1,
        threshold: 10
    });
    // 监听长按和放手事件
    thumbnailHammer.on('press', () => {
        console.log('press')
    });
    thumbnailHammer.on('pressup', () => {
        console.log('pressup')
    });
  }
}
</script>

<style>
</style>