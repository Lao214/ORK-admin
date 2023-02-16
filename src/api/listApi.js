import request from '../axios'

export default{
  okr(id){
    return request.get(`/okr/list/${id}/2021`)
  },
  // getId(){
  //   return request.get
  // }
}