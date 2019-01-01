import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/ad_influencers/',
    method: 'get',
    params: query
  })
}

export function fetchAdInfluencer(id) {
  return request({
    url: '/ad_influencers/' + id,
    method: 'get',
    params: { id }
  })
}
export function fetchSumPrice(query) {
  return request({
    url: '/ad_influencers/filter/4/',
    method: 'get',
    params: query
  })
}

export function fetchPv(pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createAdInfluencer(data, token) {
  return request({
    url: '/admin/ad_influencers/',
    method: 'post',
    params: { token },
    data
  })
}

export function updateAdInfluencer(data, token) {


  return request({
    url: '/admin/ad_influencers/',
    method: 'put',
    params: { token },
    data
  })
}

export function deleteAdInfluencer(data, token) {


  return request({
    url: '/admin/ad_influencers/',
    method: 'delete',
    params: { token },
    data
  })
}
