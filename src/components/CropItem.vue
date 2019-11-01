<template>
  <div class="thumbnail-crop-container"
       ref="component">
    <div class="thumbnail-crop-img-container"
         ref="crop"
         :style="cropSize">
      <img class="thumbnail-center-img cube"
           :style="imgStyle"
           :class="filter"
           ref="img"
           :src="currentImg.url"
           :key="currentImg.url" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'CropItemComponent',
  props: {
    /**
     * 当前的图片
     */
    currentImg: {
      type: Object,
      required: true
    },
    filter: {
      type: String,
      default: 'normal'
    }
  },
  data () {
    return {
      scale: 1
    }
  },
  computed: {
    /**
     * 计算图片样式
     */
    imgStyle () {
      const crop = this.currentImg.crop
      return {
        transform: `translate3d(${-crop.x * this.scale}px,${-crop.y * this.scale}px,0px) scale(${crop.scale * this.scale})`
      }
    },
    cropSize () {
      const { width: imgWidth, height: imgHeight } = this.currentImg.image
      const scale = this.currentImg.crop.scale
      return {
        width: `${imgWidth * scale* this.scale}px`,
        height: `${imgHeight * scale* this.scale}px`
      }
    }
  },
  mounted () {
    const componentSize = this.$refs.component.clientWidth
    const pageSize = document.body.clientWidth
    this.scale = componentSize / pageSize

  }
}
</script>
<style lang="less" scoped>
// 主体的裁切容器
.thumbnail-crop-container {
  background: gray;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  .thumbnail-crop-img-container {
    overflow: hidden;
    max-width: 100%;
    max-height: 100%;
    .thumbnail-center-img {
      transform-origin: 0 0;
      position: relative;
    }
  }
}
</style>