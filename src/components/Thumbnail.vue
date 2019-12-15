<!--
 * @Author: akrio
 * @Date: 2019-12-13 09:46:43
 * @LastEditTime: 2019-12-15 18:52:52
 * @LastEditors: Please set LastEditors
 * @Description: 缩略图DS
 * @FilePath: /image-crop/src/components/Thumbnail.vue
 -->
<template>
  <div class="thumbnail-crop-container"
       ref="thumbnail"
       :class="thumbnailClass"
       :style="style">
  </div>
</template>

<script>
export default {
  name: 'ThumbnailComponent',
  props: {
    image: {
      type: Object,
      required: true
    },
    cropSize: {
      type: Object,
      required: true
    },
    type: { // container铺满 mul 多图模式:宽高均为86vw single单图模式:宽高均为100vw
      type: String,
      default: 'mul'
    },
    filter: { // 是否为滤镜模式 滤镜模式为1:1 如果多图需加高斯模糊 单图不需要
      type: String
    }
  },
  computed: {
    thumbnailClass () {
      if (this.filter) {
        return this.filter
      } else {
        return this.image.filter
      }
    },
    style () {
      let scale = 1
      // 计算缩放比，单图无需缩放，多图需缩放到原比例的0.86
      if (this.type === 'mul') {
        scale = 0.86
      }
      // 单图模式宽高
      let cropWidth = this.cropSize.w
      let cropHeight = this.cropSize.h
      if (!this.filter) {
        return {
          'background-image': `url(${this.image.url})`,
          'background-size': `${this.image.image.width * this.image.crop.scale * scale}px auto`,
          width: `${cropWidth * scale}px`,
          height: `${cropHeight * scale}px`,
          'background-position': `-${this.image.crop.x * scale}px -${this.image.crop.y * scale}px`
        }
      } else {
        return {
          'background-image': `url(${this.image.url})`,
          width: `100px`,
          height: `100px`,
        }
      }
    }
  },
  mounted () {
    // 根据传入数据，动态生成图片的实际宽高
    console.log(this.cropSize, this.image)
  },
  methods: {
  }
}
</script>

<style lange="less" scoped>
.thumbnail-crop-container {
}
</style>