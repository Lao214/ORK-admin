import request from './tduckRequest'

export default {
  /**
   * 根据分类获取report内容
   * @param {string} categoryId 
   * @returns 
   */
  getList () {
    return request.get('/evaluate/get/sick')
  },
}
