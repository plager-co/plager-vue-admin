import request from '@/utils/request'
import { user } from '@/store/modules/user'

export function fetchList(query) {
  return request({
    url: '/ads/',
    method: 'get',
    params: query
  })
}

export function fetchAd(id) {
  return request({
    url: '/ads/' + id,
    method: 'get',
    params: { id }
  })
}


export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createAd(data, token) {
  return request({
    url: '/admin/ads/',
    method: 'post',
    params: { token },
    data
  })
}

export function updateAd(data, token) {


  return request({
    url: '/admin/ads/',
    method: 'put',
    params: { token },
    data
  })
}
