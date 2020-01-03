<template>
  <div class="crop-page">
    <crop-header type="crop"
                 @next="toFilterPage"></crop-header>
    <crop-item class="crop-item"
               ref="crop"
               v-model="selectList[selectIndex]">
      <div class="cut-icon"
           @click.stop="switchFull"></div>
      <div class="mul-icon"
           @click.stop="switchSelectType"></div>
    </crop-item>
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
      <div class="tool-btn">图库</div>
      <div class="tool-btn">照片</div>
      <div class="tool-btn">视频</div>
    </div>
  </div>
</template>

<script>
import img1 from '../../public/images/1.jpg'
import img2 from '../../public/images/2.jpg'
import img3 from '../../public/images/3.jpg'
import img4 from '../../public/images/4.jpg'
import img5 from '../../public/images/5.jpg'
import img6 from '../../public/images/6.jpg'
import img7 from '../../public/images/7.jpg'
import img8 from '../../public/images/8.jpg'
import img9 from '../../public/images/9.jpg'
import img10 from '../../public/images/10.jpg'
import img11 from '../../public/images/11.jpg'
import img12 from '../../public/images/12.jpg'
import img13 from '../../public/images/13.jpg'
import img14 from '../../public/images/14.jpg'
import img15 from '../../public/images/15.jpg'
import img16 from '../../public/images/16.jpg'
import img17 from '../../public/images/17.jpg'
import img18 from '../../public/images/18.jpg'
import img19 from '../../public/images/19.jpg'
import CropHeader from '@/components/Header'
import CropItem from '@/components/CropItem'
export default {
  name: 'CropPage',
  components: { CropHeader, CropItem },
  data () {
    return {
      lockSize: { // 裁切框size
        width: 0,
        height: 0
      },
      selectList: [],
      imageList: [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19],
      selectType: 'single', // 单选模式:single 多选模式: mul 
      selectIndex: 0, // 当前裁切模式选中的图片
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
        console.log(this.selectList[0])
        this.lockSize = {
          width: 10,
          height: 10
        }
      } else {
        // 如果从多图切换回单图则只选择第一项
        this.selectType = 'single'
        this.selectList.splice(1, this.selectList.length - 1)
        this.selectIndex = 0
      }
    },
    /**
     * 去滤镜页面
     */
    toFilterPage () {
      this.$router.push({ name: 'FilterPage' })
    },
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
        }
      }
    },
    /**
     * 图片点击事件
     */
    imgClick (url) {
      const item = {
        url,
        filter: 'normal',
        crop: {
          x: 0,
          y: 0,
          scale: 0,
          roate: 0
        }
      }
      // 查看当前是否为选中项，如果选中则进行取消
      const selectIndex = this.selectList.findIndex(i => i.url === url)
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
        const selectCurrent = this.selectList[this.selectIndex].url === url
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
      this.$nextTick(() => {
        this.$refs.crop.reload()
      })
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
  }
}
</script>

<style scoped lang="less">
.crop-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .crop-item {
    width: 100vw;
    height: 100vw;
    background: gray;
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
    padding-bottom: env(safe-area-inset-bottom);
    .tool-btn {
    }
  }
}
</style>