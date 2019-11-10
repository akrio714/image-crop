<template>
  <div class="crop-page">
    <div class="crop-container"
         v-show="type === 'crop'">
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
      <div class="shrink-icon"
           @click.stop="shrinkClick(true)"></div>
      <div class="enlargement-icon"
           @click.stop="shrinkClick(false)"></div>
      <div class="cut-icon"
           v-show="selectType === 'single'"
           @click.stop="switchFull"></div>
      <div class="mul-icon"
           @click.stop="switchSelectType"></div>
      <!--锁定样式超出区域显示黑色-->
      <div class="crop-line-container"
           ref="elCrop">
      </div>
    </div>
    <div class="bottom-image-list">
      <div class="image-item"
           @click="imgClick(img.url)"
           v-for="img in bottomImageList"
           :key="img.url">
        <div class="img"
             :style="{'background-image':img.url}"
             :key="img.url"></div>
        <div class="select-mask"
             v-show="img.current"></div>
        <div class="select-icon"
             v-if="img.index">{{img.index}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { imageLoad } from '../utils/media'
import Hammer from 'hammerjs'
export default {
  name: 'CropPage',
  data () {
    return {
      filterIndex: 0, // 滤镜模式选中的图片索引
      selectType: 'single', // 单选模式:single 多选模式: mul 
      selectIndex: 0, // 当前裁切模式选中的图片
      selectList: [], // 已经选中的图片列表
    }
  },
  computed: {
    /**
     * 可选择图片列表
     */
    bottomImageList () {
      return this.imageList.map(img => {
        const selectIndex = this.selectList.findIndex(i => i.url === img)
        let index = selectIndex === -1 ? '' : selectIndex + 1
        let current = false
        if (this.currentImg) {
          current = this.currentImg.url === img
        }
        // 如果图片为单选模式则index = 0 不显示选中序号
        if (this.selectType === 'single') {
          index = ''
        }
        return {
          url: img,
          index,
          current
        }
      })
    },
    /**
     * 计算当前图片的translate样式
     */
    imgStyle () {
      if (!this.currentImg) {
        return {}
      }
      const crop = this.currentImg.crop
      return {
        transform: `translate(${-crop.x}px,${-crop.y}px) scale(${crop.scale})`
      }
    },
    /**
     * 计算当前选中的图片
     */
    currentImg () {
      return this.selectList[this.selectIndex]
    },
    /**
     * 计算裁切框大小
     */
    cropSize () {
      if (!this.currentImg) {
        return {}
      }
      let cropImg = this.currentImg.image
      const scale = this.currentImg.crop.scale
      let imgWidth = cropImg.width * scale
      let imgHeight = cropImg.height * scale
      if (this.selectType === 'mul') {
        // 多选则锁死裁切框
        imgWidth = this.lockSize.width
        imgHeight = this.lockSize.height
      }
      return {
        width: `${imgWidth}px`,
        height: `${imgHeight}px`,
        w: imgWidth,
        h: imgHeight
      }
    }
  },
  methods: {
    /**
     * 切换选中方式 single:单选 mul:多选
     */
    switchSelectType () {
      if (this.selectType === 'single') {
        this.selectType = 'mul'
        // 单选切换到多选直接锁定单选的裁切比例
        this.lockSize = {
          width: this.$refs.crop.clientWidth,
          height: this.$refs.crop.clientHeight
        }
      } else {
        // 如果从多图切换回单图则只选择第一项
        this.selectType = 'single'
        this.selectList.splice(1, this.selectList.length - 1)
        this.selectIndex = 0
      }
    },
    /**
     * 通过按钮触发缩放
     * @param shrink 是否缩小
     */
    shrinkClick (shrink) {
      let imgScale = 1
      if (shrink) {
        imgScale = this.currentImg.crop.scale * 0.9
      } else {
        imgScale = this.currentImg.crop.scale * 1.1
      }
      this.scale(imgScale)
    },
    scale (num) {
      let scale = num
      let minScale = 1
      // 单选模式，判断图片长边至少达到100%宽度
      if (this.selectType === 'single') {
        if (this.currentImg.image.width >= this.currentImg.image.height) {
          // 宽大于高，则说明宽度至少要达到100%宽度的缩放比
          minScale = this.fullScale({ type: 'width' })
        } else {
          minScale = this.fullScale({ type: 'height' })
        }
      } else {
        if (this.$refs.crop.clientWidth >= this.$refs.crop.clientHeight) {
          // 宽大于高，则说明宽度至少要达到100%宽度的缩放比
          minScale = this.fullScale({ type: 'width' })
        } else {
          minScale = this.fullScale({ type: 'height' })
        }
      }
      const maxScale = minScale * 3
      if (scale < minScale) {
        scale = minScale
      } else if (scale > maxScale) {
        scale = maxScale
      }
      this.currentImg.crop.scale = scale
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
      // 查看当前是否为选中项，如果选中则进行取消
      const selectIndex = this.selectList.findIndex(i => i.url === img)
      if (selectIndex === -1) {
        // 如果点的是新的则直接更改当前选中项
        if (this.selectType === 'single') {
          this.selectList = [item]
        } else {
          this.selectIndex = this.selectList.length
          this.selectList.push(item)
        }
      } else {
        // 计算是否选中的是自身
        const selectCurrent = this.selectList[this.selectIndex].url === img
        if (this.selectType === 'single') {
          // 单选模式点之前选项则不作处理，如果是新的则替换之前项
          if (selectCurrent) {
            return
          } else {
            this.selectList = [item]
          }
        } else {
          // 如果选中的是唯一的已选项则没有任何效果
          if (this.selectList.length === 1) {
            return
          } else {
            // 选中当前则是取消
            if (selectCurrent) {
              this.selectList.splice(selectIndex, 1)
              this.selectIndex = this.selectList.length - 1
            } else {
              // 如果已经选择多张图片
              this.selectIndex = selectIndex
            }
          }
        }
      }
      /**
       * 计算图片缩放比例以及坐标
       * 1.获取裁切框比例
       * 2.计算横纵坐标
       * */
      const { width: cropWidth, height: cropHeight } = item.image
      if (this.selectType === 'single') {
        // 如果裁切宽度大于高度 则按高度取值
        if (cropWidth > cropHeight) {
          item.crop.scale = this.fullScale({ type: 'width' })
        } else {
          item.crop.scale = this.fullScale({ type: 'height' })
        }
      } else if (this.selectType === 'mul') {
        if (this.$refs.crop.clientWidth > this.$refs.crop.clientHeight) {
          item.crop.scale = this.fullScale({ type: 'width' })
        } else if (this.$refs.crop.clientWidth === this.$refs.crop.clientHeight) {
          // 如果为多选且裁切框比例为1 则判断图片宽度
          if (cropWidth < cropHeight) {
            item.crop.scale = this.fullScale({ type: 'width' })
          } else {
            item.crop.scale = this.fullScale({ type: 'height' })
          }
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
        // 计算窄变
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
    var cropHammer = new Hammer(this.$refs.elCrop);
    // 开启纵向手势
    cropHammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    // 开启捏放手势
    cropHammer.get('pinch').set({ enable: true });
    let x = 0
    let y = 0
    let scale = 1
    cropHammer.on('panstart', (e) => {
      x = e.center.x
      y = e.center.y
    });
    cropHammer.on('panmove', (e) => {
      // 计算移动后坐标
      let relativeX = e.center.x - x
      let relativeY = e.center.y - y
      x = e.center.x
      y = e.center.y
      this.moving({ relativeX, relativeY })
      this.validateMargin()
    });
    cropHammer.on('panend', () => {
      this.validateMargin()
    });
    cropHammer.on('pinchstart', () => {
      scale = this.currentImg.crop.scale
    })
    cropHammer.on('pinchmove', (e) => {
      this.scale(scale * e.scale)
    });
    cropHammer.on('doubletap', () => {
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
    .cut-icon,
    .mul-icon {
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
    // 单多选切换按钮
    .mul-icon {
      background-image: url("../assets/mul.png");
      width: 35px;
      height: 35px;
      bottom: 20px;
      right: 20px;
      left: inherit;
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
      margin: 2px;
      cursor: pointer;
      border: 3px solid white;
      &.active {
        border-color: red;
      }
    }
  }
}
</style>
