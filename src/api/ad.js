import request from '@/utils/request'

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

export function createAd(data) {
  return request({
    url: '/ads/',
    method: 'post',
    data
  })
}

export function updateAd(data) {
  return request({
    url: '/ads/',
    method: 'put',
    data
  })
}
