# 图片裁切

单图模式：图片默认会长边顶满屏幕，短边比例自适应。图片可进行放大，可视区域即为裁切后图片。所以图片比例会随着放大逐渐趋近于1。

多图模式：单图模式选择好比例后，多图选中后都会沿用之前单图比例，保持裁切出的多张图片比例一致。

## 功能
![http://www.giphy.com/gifs/W0cwDeVq34ScB9rgvz](http://www.giphy.com/gifs/W0cwDeVq34ScB9rgvz)
### 图片缩放

图片最小缩放为长边顶满,最大缩放为最小的3倍。

### 图片一键铺满

实现图片是宽度100%,还是高度100%的切换。

### 多图裁切

统一一个比例对图片进行裁切

### 图片滤镜

支持6种滤镜

### 缩略图

图片裁切的时候会同时获取2张图片，1张为高清原图，1张为缩略，缩略图会限制图片的最大300x300，最小50x50，图片质量压缩0.6(没写配置直接写死了)

## 优化

### iphone拖拽卡顿

拖拽主要靠translate实现x,y坐标的移动，在pc和安卓设备中很流畅。但是iphone上会有明显卡顿。实际是由于没有开启gpu加速问题，只要使用translate3d即可开启gpu加速。

### 图片上传去重

我们在使用qq的时候发送同文件会秒传，实际是比较了一下服务器和上传文件是否相同，相同则直接读取服务器文件。同理，每次上传的图片的时候获取图片md5码并作为名字进行上传，以后每次上传的时候通过head请求判断服务器上是否有同名文件，相同则不进行上传。

### 图片压缩

图片上传一般会对图片的大小进行限制，这里直接写死最小宽度320，最大宽度1080，图片质量不压缩(没写配置直接写死了)

### 选择滤镜优化

由于滤镜使用js进行计算，每次拖动图片就会重新计算多张滤镜，即使滤镜部分图片已经压缩到50x50每次计算时间也是相当耗时。所以在选择滤镜页面使用css实现一个相同效果的滤镜，裁切的时候在使用js计算。

tip:为什么一定使用js计算滤镜，因为canvas绘图的时候css滤镜不支持。

## Demo

![./public/demo.png](./public/demo.png)

## Dependencies

* [browser-md5-file](https://github.com/forsigner/browser-md5-file)
* [hammerjs](https://github.com/hammerjs/hammer.js)
* [image-compressor.js](https://github.com/fengyuanchen/compressorjs)
* [normalize.css](https://github.com/necolas/normalize.css)
* [vue-awesome-swiper](https://github.com/surmon-china/vue-awesome-swiper)
* [vue-lazyload](https://github.com/hilongjw/vue-lazyload)

## License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
