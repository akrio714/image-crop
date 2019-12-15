<!--
 * @Author: akrio
 * @Date: 2019-12-09 21:17:42
 * @LastEditTime: 2019-12-15 19:06:16
 * @LastEditors: Please set LastEditors
 * @Description: 滤镜样式页面
 * @FilePath: /image-crop/src/components/Filter.vue
 -->
<template>
  <div class="filter-page-component">
    <crop-header type="filter"
                 @prev="toCropPage"></crop-header>
    <div class="header-image-list">
      <draggable v-model="imageListCopy"
                 class="outer"
                 :class="type"
                 group="people"
                 :delay="800"
                 :delayOnTouchOnly="true">
        <thumbnail class="image-item"
                   v-for="image in imageListCopy"
                   :image="image"
                   :cropSize="cropSize"
                   :type="type"
                   :key="image.url"></thumbnail>
      </draggable>
    </div>
    <div v-if="currentImage"
         class="filter-list">
      <div class="outer">
        <thumbnail v-for="filter in filterTypes"
                   @click.native="switchFilter(filter)"
                   class="image-item"
                   :image="currentImage"
                   :cropSize="cropSize"
                   :type="type"
                   :filter="filter.type"
                   :key="filter.type"></thumbnail>
      </div>
    </div>
    <div class="bottom-tool">
      <div class="tool-btn">滤镜</div>
      <div class="tool-btn">编辑</div>
    </div>
  </div>
</template>

<script>
import CropHeader from '@/components/Header'
import Draggable from 'vuedraggable'
import Thumbnail from './Thumbnail'
import _ from 'lodash'
export default {
  name: 'FilterComponent',
  components: { CropHeader, Draggable, Thumbnail },
  props: {
    imageList: { // 图片列表
      type: Array,
      required: true
    },
    cropSize: { // 裁切框大小
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  methods: {
    toCropPage () {
      this.$parent.type = 'crop'
    },
    /**
     * 切换当前图片滤镜效果
     */
    switchFilter (filter) {
      this.imageListCopy[this.currentIndex].filter = filter.type
    }
  },
  computed: {
    /**
     * 当前选中的图片
     */
    currentImage () {
      return this.imageListCopy[this.currentIndex]
    }
  },
  data () {
    return {
      currentIndex: 0, // 当前选中的图片
      imageListCopy: [],
      filterTypes: [ // 滤镜类型
        { name: 'normal', type: 'normal' },
        { name: 'clarendon', type: 'clarendon' },
        { name: 'lark', type: 'lark' },
        { name: 'gingham', type: 'gingham' },
        { name: 'valencia', type: 'valencia' },
        { name: 'xpro2', type: 'xpro2' },
        { name: 'lofi', type: 'lofi' }
      ]
    }
  },
  created () {
    this.imageListCopy = _.cloneDeep(this.imageList)
  }
}
</script>

<style scoped lang="less">
.filter-page-component {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: -webkit-fill-available;
  display: flex;
  background: white;
  z-index: 2;
  flex-direction: column;
  .header-image-list {
    height: 100vw;
    width: 100vw;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    display: flex;
    align-items: center;
    justify-content: center;
    .outer {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      flex-direction: row;
      float: left;
      &.mul .image-item {
        padding: 0 20px;
        @mul-margin: 2vw;
        margin: 0 @mul-margin;
      }
    }
  }
  .filter-list {
    flex: 1;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    display: flex;
    align-items: center;
    .outer {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 0 20px;
      flex-direction: row;
      float: left;
      .image-item {
        @mul-margin: 2vw;
        margin: 0 @mul-margin;
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