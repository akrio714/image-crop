<template>
  <div class="crop-img-container"
       ref="crop"
       :style="cropSize">
    <img class="center-img"
         :style="imgStyle"
         ref="img"
         :src="currentImg?currentImg.url:''"
         :key="currentImg?currentImg.url:''" />
  </div>
</template>
<script>
export default {
  name: 'CropItemComponent',
  props: {
    currentImg: {
      type: Object,
      required: true
    }
  },
  computed: {
    /**
     * 计算图片样式
     */
    imgStyle () {
      const crop = this.currentImg.crop
      return {
        transform: `translate(${-crop.x}px,${-crop.y}px) scale(${crop.scale})`
      }
    },
        cropSize () {
      if (!this.currentImg) {
        return {}
      }
      if (this.type === 'single') {
        const { width: imgWidth, height: imgHeight } = this.currentImg.image
        const scale = this.currentImg.crop.scale
        return {
          width: `${imgWidth * scale}px`,
          height: `${imgHeight * scale}px`
        }
      } else if (this.type === 'mul') {
        return {
          width: `${100}vw`,
          height: `${100}vw`
        }
      } else {
        console.error('既不是单选又不是多选')
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>