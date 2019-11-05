import BMF from 'browser-md5-file'
import ImageCompressor from 'image-compressor.js'
import './filter'
/**
 * 图片md5加密
 * @param image 图片文件
 * @returns {Promise}
 */
export function md5({ image }) {
  return new Promise((resolve, reject) => {
    const bmf = new BMF()
    bmf.md5(image,
      (err, md5) => {
        if (err) {
          reject(err)
        } else {
          resolve(md5)
        }
      }
    )
  })
}
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
  if (!image && !src) return Promise.reject(Error('请检查参数中是否有图片链接'))
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
export async function compressor({ image, original = false }) {
  const imageCompressor = new ImageCompressor()
  let params
  if (original) {
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
/**
 * canvas 转blob
 * @param canvas 需要转换的canvas
 * @returns {Promise<any>}
 */
export function canvasBlob({ canvas }) {
  const promise = new Promise(resolve => {
    canvas.toBlob((blob) => {
      resolve(blob)
    })
  })
  return promise
}