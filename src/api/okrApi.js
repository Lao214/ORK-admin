import request from '../axios'

export default{
  // Okr(deptId){
  //   return request.get(`/okr/list/${deptId}/2021`)
  // }
  Okr(){
    return request.get('/okr/list/0/2021')
  }
}