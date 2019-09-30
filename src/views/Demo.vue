<template>
  <div class="crop-page">
    <div class="top-header">
      <div class="left-icon">关闭</div>
      <div class="title">裁切</div>
      <div class="next-btn">继续</div>
    </div>
    <div class="crop-container"
         ref="elCrop">
      <div v-if="currentImg"
           class="crop-img-container"
           ref="crop"
           :style="cropSize">
        <img class="center-img"
             :style="imgStyle"
             ref="img"
             :src="currentImg.url"
             :key="currentImg.url" />
      </div>
      <div class="shrink-icon"></div>
      <div class="enlargement-icon"></div>
      <div class="rotate-icon"></div>
      <div class="cut-icon"></div>
      <!--锁定样式超出区域显示黑色-->
      <div class="crop-line-container">
      </div>
    </div>
    <div class="bottom-image-list">
      <div class="image-item"
           @click="imgClick(img)"
           v-for="img in imageList"
           :key="img">
        <div class="img"
             v-lazy:background-image="img"
             :key="img"></div>
      </div>
    </div>
  </div>
</template>

<script>
import img1 from '@/assets/1.jpg'
import img2 from '@/assets/2.jpg'
import img3 from '@/assets/3.jpg'
import img4 from '@/assets/4.jpg'
import img5 from '@/assets/5.jpg'
import img6 from '@/assets/6.jpg'
import img7 from '@/assets/7.jpg'
import img8 from '@/assets/8.jpg'
import img9 from '@/assets/9.jpg'
import img10 from '@/assets/10.jpg'
import img11 from '@/assets/11.jpg'
import img12 from '@/assets/12.jpg'
import { imageLoad, imgFilter } from '../utils/media'
export default {
  name: 'DemoPage',
  data () {
    return {
      imageList: [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12],
      selectIndex: 0,
      selectList: []
    }
  },
  computed: {
    imgStyle () {
      const crop = this.currentImg.crop
      return {
        transform: `translate(${-crop.x}px,${-crop.y}px) scale(${crop.scale})`
      }
    },
    currentImg () {
      return this.selectList[this.selectIndex]
    },
    cropSize () {
      return {
        width: `${100}vw`,
        height: `${70}vw`
      }
    }
  },
  methods: {
    /**计算图片铺满缩放 */
    fullScale ({ type }) {
      const { width: imgWidth, height: imgHeight } = this.currentImg.image
      const { clientWidth: cropWidth, clientHeight: cropHeight } = this.$refs.crop.clientWidth
      let scale = 1
      if (type === 'width') {
        // 计算宽度100%所需缩放
        scale = cropWidth / imgWidth
      } else {
        // 计算高度100%所需缩放
        scale = cropHeight / imgHeight
      }
      return scale
    },
    async imgClick (img) {
      // 更改当前选中项
      this.selectIndex = this.imageList.findIndex(i => i === img)
      const image = await imageLoad({ src: img })
      // 初始化选中项数据
      const item = {
        url: img,
        image,
        crop: {
          x: 0,
          y: 0,
          scale: 0.5,
          roate: 0
        }
      }
      this.selectList.push(item)
            /**
       * 计算图片缩放比例以及坐标
       * 1.获取裁切框比例
       * 2.计算横纵坐标
       * */
      const { clientWidth: cropWidth, clientHeight: cropHeight } = this.$refs.crop.clientWidth
      // 如果裁切宽度大于高度 则按高度取值
      if (cropWidth > cropHeight) {
        this.crop.scale = this.fullScale ({ type:'height' })
      }else {
        this.crop.scale = this.fullScale ({ type:'width' })
      }
    },

    switchFull () {
    },
    /**
       * 旋转
       */
    async rotate () {
    },
    /**
       * 移动中
       */
    async moving ({ relativeX, relativeY }) {
      const currentImg = this.selectList[this.selectIndex]
      currentImg.crop.x -= relativeX
      currentImg.crop.y -= relativeY
    },
    /**
     * 计算边缘回弹
     */
    validateMargin () {
      const currentImg = this.selectList[this.selectIndex]
      const { x, y, scale } = currentImg.crop
      const { clientWidth, clientHeight } = this.$refs.crop
      const maxX = currentImg.image.width * scale - clientWidth
      const maxY = currentImg.image.height * scale - clientHeight
      //首先不能小于(0,0)点,不能大于图片宽高
      if (x < 0) {
        currentImg.crop.x = 0
      }
      if (y < 0) {
        currentImg.crop.y = 0
      }
      if (x > maxX) {
        currentImg.crop.x = maxX
      }
      if (y > maxY) {
        currentImg.crop.y = maxY
      }
    }
  },
  async created () {
    // 默认选中第一张
    await this.imgClick(this.imageList[0])
  },
  mounted () {
    this.$refs.elCrop.onmousedown = e => {
      let x = e.pageX
      let y = e.pageY
      // 监听坐标变化
      e.preventDefault()
      // 同时监听鼠标移动
      document.onmousemove = e => {
        // 计算移动后坐标
        let relativeX = e.pageX - x
        let relativeY = e.pageY - y
        x = e.pageX
        y = e.pageY
        this.moving({ relativeX, relativeY })
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        console.log('eeee',this.$refs.img.offsetLeft)
        // 最后验证图片是否超出边界，如果超出则进行修正
        this.validateMargin()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.crop-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  // 最上方头样式
  .top-header {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    color: rgba(56, 151, 240);
    .left-icon {
      width: 44px;
      text-align: left;
    }
    .title {
      flex: 1;
      color: black;
      text-align: center;
    }
    .next-btn {
      width: 44px;
      text-align: right;
    }
  }
  // 主体的裁切容器
  .crop-container {
    width: 100vw;
    height: 100vw;
    background: gray;
    position: relative;
    overflow: scroll;
    display: flex;
    align-items: center;
    justify-content: center;
    .crop-img-container {
      overflow: hidden;
      .center-img {
        transform: translate(1px, 1px) scale(0.6);
        transform-origin: 0 0;
        left: 0;
        top: 0;
      }
    }
    .shrink-icon,
    .enlargement-icon,
    .rotate-icon,
    .cut-icon {
      width: 24px;
      height: 24px;
      background-size: contain;
      position: absolute;
      left: 15px;
      cursor: pointer;
      z-index: 2;
      &:hover {
        opacity: 0.7;
      }
    }
    // 缩小按钮
    .enlargement-icon {
      background-image: url("../assets/enlargement.png");
      top: 20px;
    }
    // 放大按钮
    .shrink-icon {
      background-image: url("../assets/shrink.png");
      top: 60px;
    }
    // 旋转按钮
    .rotate-icon {
      background-image: url("../assets/rotate.png");
      top: 100px;
    }
    // 伸缩按钮
    .cut-icon {
      background-image: url("../assets/cut.png");
      width: 35px;
      height: 35px;
      bottom: 20px;
    }
    // 裁切图片之上的遮罩
    .crop-line-container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      z-index: 1;
      box-sizing: border-box;
    }
  }
  // 最下方的图片选择样式
  .bottom-image-list {
    flex: 1;
    background: #dfdfdf;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    display: flex;
    flex-flow: wrap;
    align-content: flex-start;
    .image-item {
      width: 25vw;
      height: 25vw;
      padding: 1px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
      .img {
        height: 100%;
        width: 100%;
        background: gray;
        background-size: cover;
      }
    }
  }
}
</style>
