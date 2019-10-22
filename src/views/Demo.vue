<template>
  <div class="crop-page">
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
    hammer.set({'touch-action':'none'});
    hammer.on('panstart', (e) => {
        console.log('panstart')
    });
    hammer.on('panmove', (e) => {
      console.log('pan move',e.center)
    });
    hammer.on('panend', () => {
        console.log('panend')
    });
    hammer.on('panup',()=> {
        console.log('Panup')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.crop-page {
  .demo-container{
      width: 100vw;
      height: 100vw;
      background: red;
  }
}
</style>
