# 图片裁切

## 功能

参数 |是否必填 | 意义
----|------|----
image_src | 必须  | 需要裁剪图片的src地址
className | 不必须  | 裁剪 DOM 容器的 class
circle | 不必须，默认是false  | 代表选取的是否是圆形还是矩形，默认是矩形，注意:圆形选取裁剪出来的也是正方形图片
width | 必须  | 选区的宽
height | 必须  | 选区的高
output | 必须 | 输出的倍率。比如如果output为2，选区的宽300，选区的高100，输出的图像的分辨率为 (2×300，2×100）
ok | 必须  | 点击ok按钮的回调
cancel | 必须  | 点击cancel按钮的回调
ok_text | 不必须，默认是ok  | ok按钮的文本
cancel_text | 不必须，默认是cancel  | cancel按钮的文本

## Demo

![./public/demo.png](./public/demo.png)

## License
This content is released under the [MIT](http://opensource.org/licenses/MIT) License.
