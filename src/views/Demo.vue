<template>
  <div class="demo-page">
      <div id="test" class="demo-container"></div>
  </div>
</template>

<script>
import Hammer from 'hammerjs'
export default {
  name: 'DemoPage',
  mounted () {
    // Create an instance of Hammer with the reference.
    var hammer = new Hammer(document.getElementById("test"));
    // 开启纵向手势
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    // 开启捏放手势
    hammer.get('pinch').set({ enable: true });
    hammer.on('panstart', (e) => {
        console.log('panstart')
    });
    hammer.on('panmove', (e) => {
      console.log('pan move',e.center)
    });
    hammer.on('pinch', (e) => {
      console.log('pan pinch',e)
    });
    hammer.on('panend', () => {
        console.log('panend')
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.demo-page {
  .demo-container{
      width: 100vw;
      height: 100vw;
      background: red;
  }
}
</style>
