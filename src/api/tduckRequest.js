import Axios from 'axios'

const tduckRequest = Axios.create({
  // baseURL: 'http://127.0.0.1:8080',
  baseURL: 'https://tduck-api-new.foxconnedu.com',
})

// 请求拦截 一般做 token 处理
tduckRequest.interceptors.request.use(config => {
  // const token = localStorage.getItem('token')
  // console.debug('request token', token)
  // if (token) {
  //   config.headers.token = token
  // }
  return config
})

export default tduckRequest