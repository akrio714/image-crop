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
import img6 from '../../public/images/18.jpg'
export default {
  data () {
    return {
      app: null,
      spriteList: [],
      scale: 1
    }
  },
  methods: {
    testRotation () {
      const sprite = this.spriteList[0]
      sprite.anchor.set(0.9)
      this.scale += 0.1
      sprite.scale.set(this.scale)
      // this.spriteList[0].rotation += 0.3;
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
        img6
      )
      .load((loader, resources) => {
        const { width: imgWidth, height: imgHeight } = resources[img6].data
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
        // activate plugins
        viewport
          .drag()
          .pinch()
          .wheel()
          .decelerate()
          .fitWorld()
          .clamp({
            direction: 'all'
          })
          .clampZoom({
            minWidth: 1000,
            maxWidth: 2000
          })
        const sprite = new PIXI.Sprite(resources[img6].texture);
        this.spriteList.push(sprite)
        sprite.interactive = true;
        sprite.cursor = 'grab';
        // Add the bunny to the scene we are building
        viewport.addChild(sprite);

        // Listen for frame updates
        // app.ticker.add(() => {
        //   // each frame we spin the bunny around a bit
        //   sprite.rotation += 0.01;
        // });
      });
  }
}
</script>