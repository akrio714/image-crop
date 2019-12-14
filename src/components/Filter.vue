<!--
 * @Author: akrio
 * @Date: 2019-12-09 21:17:42
 * @LastEditTime: 2019-12-13 10:35:56
 * @LastEditors: Please set LastEditors
 * @Description: 滤镜样式页面
 * @FilePath: /image-crop/src/components/Filter.vue
 -->
<template>
  <div class="filter-page-component">
    <crop-header type="filter"></crop-header>
    <div class="header-image-list">
      <draggable v-model="imageList"
                 group="people"
                 :delay="800"
                 :delayOnTouchOnly="true">
        <thumbnail class="image-item"
                   v-for="image in imageList"
                   :key="image.url"
                   @on-long-press="headerImagePress"></thumbnail>
      </draggable>
    </div>
  </div>
</template>

<script>
import CropHeader from '@/components/Header'
import Draggable from 'vuedraggable'
import Thumbnail from './Thumbnail'
import img6 from '../../public/images/6.jpg'
import img18 from '../../public/images/18.jpg'
import img20 from '../../public/images/24.png'
import img21 from '../../public/images/23.png'
export default {
  name: 'FilterComponent',
  components: { CropHeader, Draggable, Thumbnail },
  props: {
    imageList: { // 图片列表
      type: Array,
      default: () => { return [{ url: img6 }, { url: img18 }, { url: img20 }, { url: img21 }] }
    },
    cropSize: { // 裁切框大小
      type: Object,
      required: true
    }
  },
  methods: {
  },
  computed: {
    filterList () {
      return []
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped lang="less">
.filter-page-component {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .header-image-list {
    height: 100vw;
    width: 100vw;
    overflow-x: scroll;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    .image-item {
      @mul-crop-size: 86vw;
      @mul-margin: 2vw;
      height: @mul-crop-size;
      width: @mul-crop-size;
      background: red;
      margin: 0 @mul-margin;
      display: inline-block;
      &:first-child {
        margin-left: @mul-margin*2;
      }
      &:last-child {
        margin-right: @mul-margin*2;
      }
    }
  }
}
</style>