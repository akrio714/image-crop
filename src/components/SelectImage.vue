<!--
 * @Author: akrio
 * @Date: 2019-12-08 09:20:18
 * @LastEditTime: 2019-12-08 21:58:16
 * @LastEditors: Please set LastEditors
 * @Description: 图片裁切页面
 * @FilePath: /image-crop/src/components/SelectImage.vue
 -->
<template>
  <div class="select-image-component">
    <crop-header type="crop"></crop-header>
    <div class="crop-container">
      <div class="crop-img-container"
           ref="crop"
           :style="cropSize">
        <img class="center-img cube"
             :style="imgStyle"
             ref="img"
             :class="currentImg?currentImg.filter:''"
             :src="currentImg?currentImg.url:''" />
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
      <div class="image-item upload-image"
           @click="$refs.inputFile.click()">
        <input ref="inputFile"
               name="file"
               @change="uploadImg"
               style="display: none"
               type="file"
               accept="image/*" />
      </div>
      <div class="image-item"
           @click="imgClick(img.url)"
           v-for="img in bottomImageList"
           :key="img.url">
        <div class="img"
             :style="{'background-image':`url(${img.url})`}"
             :key="img.url"></div>
        <div class="select-mask"
             v-show="img.current"></div>
        <div class="select-icon"
             v-if="img.index">{{img.index}}</div>
      </div>
    </div>
    <div class="bottom-tool">
      <div class="tool-btn"
           @click="showLibrary">图库</div>
      <div class="tool-btn"
           @click="showCamera">照片</div>
      <div class="tool-btn"
           @click="showVideo">视频</div>
    </div>
  </div>
</template>

<script>
import CropHeader from '@/components/Header'
import { imageLoad } from '../utils/media'
export default {
  name: 'SelectImageComponent',
  components: { CropHeader },
  props: {
    params: {
      type: Object,
      default: () => {
        return {
          selectType: 'single', // 单选模式:single 多选模式: mul 
          maxPercentage: 1, // 接受的最大裁切比例
          minPercentage: 1 // 接受的最小裁切比例
        }
      }
    },
    libraryList: { // 所有可选的图片列表
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      lockSize: { // 裁切框size
        width: 0,
        height: 0
      },
      selectList: [],
      imageList: [],
      selectType: 'single', // 单选模式:single 多选模式: mul 
      selectIndex: 0, // 当前裁切模式选中的图片
    }
  },
  computed: {
    /**
 * 计算当前图片的translate样式
 */
    imgStyle () {
      if (!this.currentImg) {
        return {}
      }
      const crop = this.currentImg.crop
      return {
        transform: `translate3d(${-crop.x}px,${-crop.y}px,0px) scale(${crop.scale})`
      }
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
    },
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
 * 计算当前选中的图片
 */
    currentImg () {
      return this.selectList[this.selectIndex]
    },
  },
  methods: {

    /**
     * @description: 上传图片方法
     * @param {type} 
     * @return: 
     */
    uploadImg (event) {
      const that = this
      for (const file of event.target.files) {
        const fr = new FileReader(file)
        fr.readAsDataURL(file)
        fr.onload = function () {
          that.imageList.push(this.result)
          that.imgClick(this.result)
        }
      }
    },
    /**
 * 切换选中方式 single:单选 mul:多选
 */
    switchSelectType () {
      this.fullSwitch()
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
 * 切换展示比例，要不宽度撑满，要不高度撑满
 */
    switchFull () {
      // 计算默认的缩放
      let fullScale = 1
      const { clientWidth: cropWidth, clientHeight: cropHeight } = this.$refs.crop
      this.validateMargin()
    },
    /**
 * 通过按钮触发缩放
 * @param shrink 是否缩小
 */
    f (shrink) {
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
      // 防止缩放超出边界
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
    },

    /**
     * @description: 切换图片的宽高铺满状态，横向铺满则改为纵向铺满
     * @param init 是否为初始化
     * @return: 
     */
    fullSwitch (init = false) {
      // 计算获取裁切框大小
      let cropWidth = this.$refs.crop.clientWidth
      let cropHeight = this.$refs.crop.clientHeight
      if (this.selectType === 'single') {
        cropWidth = cropHeight = document.body.clientWidth
      }
      const { width: imgWidth, height: imgHeight } = this.currentImg.image
      // 先尝试使图片宽度和裁切框宽度相同,然后查看高度是否可以铺满整个裁切框，如果不能则调换一下
      let scale = cropWidth / imgWidth
      if (imgHeight * scale < cropHeight) {
        // 发现通篇缩放之后比裁切框小，则说明不合格，比例需要按照高度铺满去调整
        scale = cropHeight / imgHeight
      }
      if (init) {
        this.currentImg.crop.scale = scale
      }
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
        },
        pathList: []
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
      this.fullSwitch()
    },
    /**
* @description: 显示图库tab点击
*/
    showLibrary () {
      console.log('111')
    },
    /**
   * @description: 显示照片tab点击
   */
    showCamera () {
      const constraints = {
        video: true,
        audio: false
      };
      navigator.mediaDevices.getUserMedia(constraints)
    },
    /**
   * @description: 显示视频tab点击
   */
    showVideo () {
      alert('暂不支持')
    }
  },
  created () {
    this.selectType = this.params.selectType
    this.imageList = this.libraryList
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
      if (this.selectType === 'single') {
        this.switchFull()
      }
    })
  }
}
</script>

<style scoped lang="less">
.select-image-component {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
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
    .mul-icon,
    .filter-icon {
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
    // 单多选切换按钮
    .filter-icon {
      background-image: url("../assets/filter2.png");
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
      &.upload-image {
        background-image: url("../../public/images/add_image.png");
        background-size: 99%;
        background-position: center;
        background-repeat: no-repeat;
      }
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
  .bottom-tool {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 20px;
    .tool-btn {
    }
  }
}
</style>