import request from '@/utils/request'

export function fetchList(query) {

  query.user_type = 'sponser';

  return request({
    url: '/users/',
    method: 'get',
    params: query
  })
}

export function fetchSponser(id) {
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

export function createSponser(data, token) {
  return request({
    url: '/admin/users/',
    method: 'post',
    params: { token },
    data
  })
}

export function updateSponser(data, token) {


  return request({
    url: '/admin/users/',
    method: 'put',
    params: { token },
    data
  })
}
