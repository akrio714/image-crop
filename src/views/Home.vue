<!--
 * @Author: your name
 * @Date: 2019-12-07 07:30:55
 * @LastEditTime : 2019-12-22 18:04:49
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /image-crop/src/views/Home.vue
 -->
<template>
  <div class="crop-image-frame"
       ref="parent">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<style lang="less" scoped>
.crop-image-frame {
  width: 100vw;
  height: 100vw;
}
</style>
<script>
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import img6 from '../../public/images/20.jpg'
// import img6 from '../../public/images/12.jpg'
export default {
  props:{
    image:{
      type:String,
      default:img6
    }
  },
  data () {
    return {
      app: null,
      viewport: null,
      spriteList: []
    }
  },
  mounted () {
    const parent = this.$refs.parent
    let app = new PIXI.Application({
      width: parent.clientWidth,
      height: parent.clientHeight,
      view: this.$refs.canvas
    });
    this.$set(this, 'app', app)
    app.loader
      .add(
        this.image
      )
      .load((loader, resources) => {
        const { width: imgWidth, height: imgHeight } = resources[this.image].data
        // create viewport
        const viewport = new Viewport({
          screenWidth: parent.clientWidth,
          screenHeight: parent.clientHeight,
          worldWidth: imgWidth,
          worldHeight: imgHeight,
          interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
        })
        // viewport.fitHeight()
        // add the viewport to the stage
        app.stage.addChild(viewport)
        viewport
          .drag()
          .pinch()
          .wheel()
          .decelerate()
          .clamp({
            direction: 'all'
          })
        this.$set(this, 'viewport', viewport)
        /**
        * 计算图片的最大最小缩放比
        * 1.单图模式中宽高比必须介于 1.91 - 0.8之间
        * 2.多图模式则按裁切框比例必须全覆盖为准
        * 3.图片最大值为最小值3倍
        **/
        const scale = 3
        const whRatio = imgWidth / imgHeight
        if (imgWidth > imgHeight) {
          // 宽大于高则要求比例必须小于1.91
          if (whRatio <= 1.91) {
            const min = imgWidth / scale
            viewport.clampZoom({
              minWidth: min,
              maxWidth: min * 3
            })
          } else {
            // 锁定宽度，计算高度放大多少倍可以达到1.91
            const min = imgWidth / 1.91 / scale
            viewport.clampZoom({
              minHeight: min,
              maxHeight: min * 3
            })
          }
        } else {
          // 高大于宽则要求比例必须大于0.8
          if (whRatio >= 0.8) {
            const min = imgHeight / scale
            viewport.clampZoom({
              minHeight: min,
              maxHeight: min * 3
            })
          } else {
            // 锁定高度，计算高度放大多少倍可以达到0.8
            const min = imgHeight * 0.8 / scale
            viewport.clampZoom({
              minWidth: min,
              maxWidth: min * 3
            })
          }
        }
        viewport.fitWorld()
        const sprite = new PIXI.Sprite(resources[this.image].texture);
        this.spriteList.push(sprite)
        sprite.interactive = true;
        sprite.cursor = 'grab';
        // Add the bunny to the scene we are building
        viewport.addChild(sprite);
      });
  }
}
</script>