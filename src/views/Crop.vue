<template>
  <div class="crop-page">
    <div class="top-header">
      <div class="left-icon"
           @click="toPrevPage">{{prevBtnText}}</div>
      <div class="title">{{title}}</div>
      <div class="next-btn"
           @click="toNextPage">{{nextBtnText}}</div>
    </div>
    <div class="export-img-modal"
         v-if="showCropPage">
      <div class="original-image"
           v-lazy:background-image="cropImgList[cropImgIndex].url"
           :key="cropImgList[cropImgIndex].id"></div>
      <div class="cover-image-list">
        <div class="image-item"
             v-for="img in cropImgList"
             :key="img.id">
          <div class="img"
               @click="cropImgIndex = img.id"
               v-lazy:background-image="img.url"
               :key="img.id"></div>
        </div>
      </div>
    </div>
    <div class="bottom-image-list"
         v-show="type === 'show'">
      <div class="image-item"
           v-for="(img,index) in cropImgList"
           :key="index">
        <img class="img"
             v-lazy:background-image="img.coverUrl"
             :key="img.coverUrl" />
      </div>
    </div>
    <div class="crop-container"
         v-show="type === 'crop' || (type === 'filter' && selectList.length === 1)">
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
           v-show="type === 'crop'"
           @click.stop="switchSelectType"></div>
      <div class="filter-icon"
           v-show="type !== 'crop'"
           @click.stop="drawClick"></div>
      <!--锁定样式超出区域显示黑色-->
      <div class="crop-line-container"
           ref="elCrop">
      </div>
    </div>
    <swiper v-if="type === 'filter' && selectList.length > 1"
            :options="swiperOption"
            class="crop-container"
            ref="filterSwiper">
      <!-- slides -->
      <swiper-slide v-for="image in selectList"
                    :key="image.url">
        <crop-item class="filter-item"
                   :filter="image.filter"
                   :imgCropSize="cropSize"
                   :currentImg="image">
          <div class="filter-icon"></div>
        </crop-item>
      </swiper-slide>
      <div class="swiper-pagination"
           slot="pagination"></div>
    </swiper>
    <div class="bottom-image-list"
         v-show="this.type === 'crop'">
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
                     :imgCropSize="cropSize"
                     :class="{active:filterType.name === selectList[filterIndex].filter}"
                     :currentImg="selectList[filterIndex]"></crop-item>
          <div>{{filterType.name}}</div>
        </div>
      </div>
    </div>
    <!-- 涂鸦弹出框 -->
    <div class="draw-component"
         v-if="type === 'draw'">
      <div class="draw-container"
           ref="elDraw"
           :style="cropSize"></div>
      <crop-item class="draw-item"
                 :filter="currentImg.name"
                 :imgCropSize="cropSize"
                 :currentImg="currentImg"></crop-item>
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
import { imageLoad, imgFilter, canvasBlob, compressor, md5 } from '../utils/media'
import Hammer from 'hammerjs'
import CropItem from '../components/CropItem'
export default {
  name: 'CropPage',
  components: { CropItem },
  data () {
    return {
      cropImgList: [],
      showCropPage: false,
      cropImgIndex: 0,
      swiperOption: { // swiper配置文件
        pagination: {
          el: '.swiper-pagination',
          dynamicBullets: true
        }
      },
      lockSize: { // 裁切框size
        width: 0,
        height: 0
      },
      filterIndex: 0, // 滤镜模式选中的图片索引
      type: 'crop', // 裁切模式:crop 滤镜模式:filter 涂鸦模式:draw
      selectType: 'single', // 单选模式:single 多选模式: mul 
      imageList: [img18, img6, img17, img19, img1, img2, img3, img4, img5, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16], // 可选图片列表
      selectIndex: 0, // 当前裁切模式选中的图片
      selectList: [], // 已经选中的图片列表
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
      } else if (this.type === 'draw') {
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
      } else if (this.type === 'draw') {
        return '保存'
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
      } else if (this.type === 'draw') {
        return '涂鸦'
      }
      return '未知'
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
     * 涂鸦按钮点击 - 未完成
     */
    drawClick () {
      this.type = 'draw'
      this.$nextTick(() => {
        // 如果是划线类型则记录路径
        let points = []
        // 监听点击滑动事件
        var drawHammer = new Hammer(this.$refs.elDraw);
        drawHammer.on('panstart', () => {
          points = []
        });
        drawHammer.on('panmove', (e) => {
          const x = e.center.x
          const y = e.center.y
          points.push({ x, y })
        });
        drawHammer.on('panend', () => {

        });
      })
    },
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
     * 导出当前图片
     */
    async exportImg () {
      this.cropImgList = []
      // 获取当前裁切框的大小和其中图片大小
      let cropWidth = 0
      let cropHeight = 0
      if (this.selectType === 'single') {
        cropWidth = this.$refs.crop.clientWidth
        cropHeight = this.$refs.crop.clientHeight
      } else {
        cropWidth = this.lockSize.width
        cropHeight = this.lockSize.height
      }
      for (let i = 0; i < this.selectList.length; i++) {
        const model = this.selectList[i]
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const cropX = model.crop.x / model.crop.scale
        const cropY = model.crop.y / model.crop.scale
        const exportCropWidth = cropWidth / model.crop.scale
        const exportCropHeight = cropHeight / model.crop.scale
        canvas.width = exportCropWidth
        canvas.height = exportCropHeight
        ctx.drawImage(
          model.image,
          cropX,
          cropY,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height
        )
        // 添加滤镜
        let currentCropImage = new Image()
        currentCropImage.src = canvas.toDataURL('image/jpeg')
        await imageLoad({ image: currentCropImage })
        const filterCanvas = imgFilter({ image: currentCropImage, type: model.filter })
        // 将图片转成file便于压缩
        const imageFile = await canvasBlob({ canvas: filterCanvas })
        // 分别获取裁切图片和缩略图
        const coverImage = await compressor({ image: imageFile, original: false })
        const originalImage = await compressor({ image: imageFile, original: true })
        // 在获取2图片的md5码以确认是否存在重复项，这样可以减少请求
        const coverImageName = await md5({ image: coverImage })
        const originalImageName = await md5({ image: originalImage })
        this.cropImgList.push({
          id: i,
          url: window.URL.createObjectURL(originalImage),
          coverUrl: window.URL.createObjectURL(coverImage),
          coverImageName,
          originalImageName
        })
        console.log(`原图(${originalImageName}):${window.URL.createObjectURL(originalImage)}\n缩略(${coverImageName}):${window.URL.createObjectURL(coverImage)}`)
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
      // 防止缩放超出边界
      this.validateMargin()
    },
    /**
     * 切换当前图片滤镜
     */
    switchFilter (filterType) {
      this.selectList[this.filterIndex].filter = filterType.type
    },
    /**
     * 右侧按钮点击事件
     */
    async toNextPage () {
      if (this.type === 'crop') {
        // 重置滤镜索引
        this.filterIndex = 0
        this.type = 'filter'
        this.$nextTick(() => {
          if (this.selectList.length > 1) {
            const swiper = this.$refs.filterSwiper.swiper
            swiper.slideTo(this.filterIndex)
            swiper.on('slideChange', () => {
              this.filterIndex = swiper.realIndex
            });
          }
        })
      } else if (this.type === 'filter') {
        await this.exportImg()
        // 主要为了演示裁切所做
        this.cropImgIndex = 0
        this.showCropPage = true
      } else if (this.type === 'draw') {
        this.type = 'filter'
      }
    },
    /**
     * 左侧按钮点击事件
     */
    toPrevPage () {
      if (this.showCropPage) {
        this.type = 'filter'
        this.showCropPage = false
        return
      }
      if (this.type === 'filter') {
        this.type = 'crop'
      } else if (this.type === 'draw') {
        this.type = 'filter'
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
      if (this.selectType === 'single') {
        this.switchFull()
      }
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
  .export-img-modal {
    position: fixed;
    left: 0;
    top: 44px;
    bottom: 0;
    right: 0;
    z-index: 99;
    background: white;
    display: flex;
    flex-direction: column;
    .original-image {
      width: 100vw;
      height: 100vw;
      background: gray;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
    .cover-image-list {
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      display: flex;
      flex-flow: wrap;
      align-content: flex-start;
      flex: 1;
      .image-item {
        width: 25vw;
        height: 25vw;
        padding: 1px;
        box-sizing: border-box;
        .img {
          height: 100%;
          width: 100%;
          background: gray;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
    }
  }
  .draw-component {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100vw;
    height: 100vw;
    .draw-container {
      position: absolute;
    }
    .draw-item {
      width: 100vw;
      height: 100vw;
      position: absolute;
    }
  }
}
</style>
