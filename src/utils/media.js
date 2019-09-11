import ImageCompressor from 'image-compressor.js'
import './filter'
/**
 * 图片滤镜
 * @param image 图片
 * @param type 类型
 */
export function imgFilter({ image, type }) {
  // eslint-disable-next-line
  const fi = filterous.importImage(image).applyInstaFilter(type)
  return fi.canvas
}
/**
 * 将页面加载完成处理成promise
 * @param image image对象
 */
export function imageLoad({ image, src }) {
  if (!image && !src) return
  let img = image
  if (src) {
    img = new Image()
    img.src = src
  }
  const promise = new Promise((resolve, reject) => {
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject(Error('图片加载失败'))
    }
  })
  return promise
}
/**
 * 图片压缩
 * @param image 需要压缩的图片
 * @param original 是否为原尺寸，即不进行任何压缩
 * @returns {Promise<Blob>}
 */
export async function compressor({ image, ins = false }) {
  const imageCompressor = new ImageCompressor()
  imageCompressor.crossOrigin = 'Anonymous'
  let params
  // 如果是ins账号限定宽度
  if (ins) {
    params = {
      quality: 1,
      minWidth: 320,
      maxWidth: 1080,
      mimeType: 'image/jpeg'
    }
  } else {
    params = {
      quality: 0.6,
      minWidth: 50,
      minHeight: 50,
      maxHeight: 300,
      maxWidth: 300,
      mimeType: 'image/jpeg'
    }
  }
  const result = await imageCompressor.compress(image, params)
  return result
}
