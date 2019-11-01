<template>
  <div class="crop-page">
    <div class="top-header">
      <div class="left-icon"
           @click="toPrevPage">{{prevBtnText}}</div>
      <div class="title">{{title}}</div>
      <div class="next-btn"
           @click="toNextPage">{{nextBtnText}}</div>
    </div>
    <div class="crop-container">
      <div class="crop-img-container"
           ref="crop"
           :style="cropSize">
        <img class="center-img cube"
             :style="imgStyle"
             ref="img"
             :class="currentImg?currentImg.filter:''"
             :src="currentImg?currentImg.url:''"
             :key="currentImg?currentImg.url:''" />
      </div>
      <div class="cut-icon"
           @click.stop="switchFull"></div>
      <!--锁定样式超出区域显示黑色-->
      <div class="crop-line-container"
           ref="elCrop">
      </div>
    </div>
    <div class="bottom-image-list"
         v-if="this.type === 'crop'">
      <div class="image-item"
           @click="imgClick(img.url)"
           v-for="img in bottomImageList"
           :key="img.url">
        <div class="img"
             v-lazy:background-image="img.url"
             :key="img.url"></div>
        <div class="select-mask"
             v-show="img.current"></div>
        <div class="select-icon"
             v-if="img.index">{{img.index}}</div>
      </div>
    </div>
    <div class="filter-list-container"
         v-if="this.type === 'filter'">
      <div v-for="filterType in filterTypes"
           :key="filterType.name"
           @click="switchFilter(filterType)">
        <div>
          <crop-item class="filter-item"
                     :filter="filterType.name"
                     :class="{active:filterType.name === currentImg.filter}"
                     :currentImg="currentImg"></crop-item>
          <div>{{filterType.name}}</div>
        </div>
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
import img13 from '@/assets/13.jpg'
import img14 from '@/assets/14.jpg'
import img15 from '@/assets/15.jpg'
import img16 from '@/assets/16.jpg'
import img17 from '@/assets/17.jpg'
import img18 from '@/assets/18.jpg'
import img19 from '@/assets/19.jpg'
import { imageLoad, imgFilter } from '../utils/media'
import Hammer from 'hammerjs'
import CropItem from '../components/CropItem'
export default {
  name: 'DemoPage',
  components: { CropItem },
  data () {
    return {
      type: 'crop', // crop filter
      selectType: 'single',
      imageList: [img6, img1, img2, img3, img4, img5, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19],
      selectIndex: 0,
      selectList: [],
      filterTypes: [ // 滤镜类型
        { name: 'normal', type: 'normal' },
        { name: 'clarendon', type: 'clarendon' },
        { name: 'lark', type: 'lark' },
        { name: 'gingham', type: 'gingham' },
        { name: 'valencia', type: 'valencia' },
        { name: 'xpro2', type: 'xpro2' },
        { name: 'lofi', type: 'lofi' }
      ],
    }
  },
  computed: {
    /**
     * 左侧按钮文案
     */
    prevBtnText () {
      if (this.type === 'crop') {
        return '关闭'
      } else if (this.type === 'filter') {
        return '后退'
      }
      return '未知'
    },
    /**
     * 右侧按钮文案
     */
    nextBtnText () {
      if (this.type === 'crop') {
        return '继续'
      } else if (this.type === 'filter') {
        return '完成'
      }
      return '未知'
    },
    /**
     * 标题
     */
    title () {
      if (this.type === 'crop') {
        return '裁切'
      } else if (this.type === 'filter') {
        return '滤镜'
      }
      return '未知'
    },
    bottomImageList () {
      return this.imageList.map(img => {
        const index = this.selectList.findIndex(i => i.url === img)
        const current = index === this.selectIndex
        return {
          url: img,
          index: index === -1 ? '' : index + 1,
          current
        }
      })
    },
    imgStyle () {
      if (!this.currentImg) {
        return {}
      }
      const crop = this.currentImg.crop
      return {
        transform: `translate(${-crop.x}px,${-crop.y}px) scale(${crop.scale})`
      }
    },
    currentImg () {
      return this.selectList[this.selectIndex]
    },
    cropSize () {
      if (!this.currentImg) {
        return {}
      }
      if (this.selectType === 'single') {
        const { width: imgWidth, height: imgHeight } = this.currentImg.image
        const scale = this.currentImg.crop.scale
        return {
          width: `${imgWidth * scale}px`,
          height: `${imgHeight * scale}px`
        }
      } else if (this.selectType === 'mul') {
        return {
          width: `${100}vw`,
          height: `${100}vw`
        }
      } else {
        console.error('既不是单选又不是多选')
        return {}
      }
    }
  },
  methods: {
    /**
     * 导出当前图片
     */
    exportImg () {
      // 获取当前裁切框的大小和其中图片大小
      const {clientWidth:cropWidth,clientHeight:cropHeight} = this.$refs.crop
      
    },
    /**
     * 切换当前图片滤镜
     */
    switchFilter (filterType) {
      this.currentImg.filter = filterType.type
    },
    /**
     * 右侧按钮点击事件
     */
    toNextPage () {
      if (this.type === 'crop') {
        this.type = 'filter'
      }
    },
    /**
     * 左侧按钮点击事件
     */
    toPrevPage () {
      if (this.type === 'filter') {
        this.type = 'crop'
      }
    },
    /**计算图片铺满缩放 */
    fullScale ({ type }) {
      const { width: imgWidth, height: imgHeight } = this.currentImg.image
      let cropWidth = 0
      let cropHeight = 0
      if (this.selectType === 'single') {
        // 获取裁切框的大小，宽高都是100%宽度
        const pageSize = document.body.clientWidth
        // 计算图片真实宽高比
        const imgWHRatio = imgWidth / imgHeight
        if (type === 'width') {
          // 图片宽大于高则说明宽度100% 高度自适应
          cropWidth = pageSize
          cropHeight = cropWidth / imgWHRatio
        } else {
          cropHeight = pageSize
          cropWidth = cropHeight * imgWHRatio
        }
      } else if (this.selectType === 'mul') {
        cropWidth = this.$refs.crop.clientWidth
        cropHeight = this.$refs.crop.clientHeight
      }
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
      // 查看当前是否为选中项，如果选中则进行取消
      const selectIndex = this.selectList.findIndex(i => i.url === img)
      if (selectIndex !== -1) {
        // 是否选中的是当前项
        const selectCurrent = this.selectList[this.selectIndex].url === img
        // 如果选中的是唯一的已选项则没有任何效果
        if (this.selectList.length === 1) {
          return
        } else {
          if (selectCurrent) {
            this.selectList.splice(selectIndex, 1)
            this.selectIndex = this.selectList.length - 1
          } else {
            // 如果已经选择多张图片
            this.selectIndex = selectIndex
          }
        }
      } else {
        // 如果点的是新的则直接更改当前选中项
        this.selectIndex = this.selectList.length
        const image = await imageLoad({ src: img })
        // 初始化选中项数据
        const item = {
          url: img,
          image,
          filter: 'normal',
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
        const { width: cropWidth, height: cropHeight } = item.image
        // 如果裁切宽度大于高度 则按高度取值
        if (cropWidth > cropHeight) {
          item.crop.scale = this.fullScale({ type: 'width' })
        } else {
          item.crop.scale = this.fullScale({ type: 'height' })
        }
      }
    },
    /**
     * 切换展示比例，要不宽度撑满，要不高度撑满
     */
    switchFull () {
      // 计算默认的缩放
      let fullScale = 1
      const { clientWidth: cropWidth, clientHeight: cropHeight } = this.$refs.crop

      if (cropWidth > cropHeight) {
        fullScale = this.fullScale({ type: 'width' })
      } else {
        fullScale = this.fullScale({ type: 'height' })
      }
      if (fullScale === this.currentImg.crop.scale) {
        if (cropWidth > cropHeight) {
          this.currentImg.crop.scale = this.fullScale({ type: 'height' })
        } else {
          this.currentImg.crop.scale = this.fullScale({ type: 'width' })
        }
      } else {
        if (cropWidth > cropHeight) {
          this.currentImg.crop.scale = this.fullScale({ type: 'width' })
        } else {
          this.currentImg.crop.scale = this.fullScale({ type: 'height' })
        }
      }
      this.validateMargin()
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
      this.$nextTick(() => {
        const currentImg = this.selectList[this.selectIndex]
        const { x, y, scale } = currentImg.crop
        const { clientWidth, clientHeight } = this.$refs.crop
        const maxX = currentImg.image.width * scale - clientWidth
        const maxY = currentImg.image.height * scale - clientHeight
        //首先不能小于(0,0)点,不能大于图片宽高
        if (x <= 0) {
          currentImg.crop.x = 0
        }
        if (y <= 0) {
          currentImg.crop.y = 0
        }
        if (x > maxX) {
          currentImg.crop.x = maxX
        }
        if (y > maxY) {
          currentImg.crop.y = maxY
        }
      })
    }
  },
  async created () {
    // 默认选中第一张
    await this.imgClick(this.imageList[0])
  },
  mounted () {
    // Create an instance of Hammer with the reference.
    var hammer = new Hammer(this.$refs.elCrop);
    // 开启纵向手势
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    // 开启捏放手势
    hammer.get('pinch').set({ enable: true });
    let x = 0
    let y = 0
    let scale = 1
    hammer.on('panstart', (e) => {
      x = e.center.x
      y = e.center.y
    });
    hammer.on('panmove', (e) => {
      // 计算移动后坐标
      let relativeX = e.center.x - x
      let relativeY = e.center.y - y
      x = e.center.x
      y = e.center.y
      this.moving({ relativeX, relativeY })
      this.validateMargin()
    });
    hammer.on('panend', () => {
      this.validateMargin()
    });
    hammer.on('pinchstart', () => {
      scale = this.currentImg.crop.scale
    })
    hammer.on('pinchmove', (e) => {
      this.currentImg.crop.scale = scale * e.scale
    });
    hammer.on('doubletap', () => {
      this.switchFull()
    })
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
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    .crop-img-container {
      overflow: hidden;
      max-width: 100vw;
      max-height: 100vw;
      .center-img {
        transform-origin: 0 0;
        position: relative;
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
      position: relative;
      .select-icon {
        width: 17px;
        height: 17px;
        background: rgba(221, 8, 8, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 5px;
        right: 5px;
        color: white;
        font-size: 13px;
        line-height: 17px;
        z-index: 2;
      }
      &:hover {
        opacity: 0.7;
      }
      .select-mask {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background: rgba(255, 255, 255, 0.6);
        z-index: 1;
      }
      .img {
        height: 100%;
        width: 100%;
        background: gray;
        background-size: cover;
      }
    }
  }
  // 滤镜样式
  .filter-list-container {
    flex: 1;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    white-space: nowrap;
    width: 100vw;
    .filter-item {
      height: 100px;
      width: 100px;
      margin: 5px;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
      &.active {
        opacity: 0.7;
      }
    }
  }
}
</style>
