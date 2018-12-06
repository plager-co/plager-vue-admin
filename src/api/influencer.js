import request from '@/utils/request'

export function fetchList(query) {

  query.user_type = 'influencer';
  query.is_removed = 0;

  return request({
    url: '/users/',
    method: 'get',
    params: query
  })
}

export function fetchInfluencer(id) {
  return request({
    url: '/users/' + id,
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

export function createInfluencer(data, token) {
  return request({
    url: '/admin/users/',
    method: 'post',
    params: { token },
    data
  })
}

export function updateInfluencer(data, token) {


  return request({
    url: '/admin/users/',
    method: 'put',
    params: { token },
    data
  })
}

export function avgInfluencerEffectRate() {
  return request({
    url: '/users/filters/2/',
    method: 'get',
  })
}
