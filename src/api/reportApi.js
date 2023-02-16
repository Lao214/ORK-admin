import request from './request'

export default {
  /**
   * 根据分类获取report内容
   * @param {string} categoryId 
   * @returns 
   */
  getList () {
    return request.get('/evaluate/get/sick')
  },
  getAllList(){
    return request.get('/evaluate/get/a7378a8b499b4fbc923334bb0683c518')

  }
}
