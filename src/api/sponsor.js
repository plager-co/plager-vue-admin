import request from '@/utils/request'

export function fetchList(query) {

  query.user_type = 'sponsor';
  query.is_removed = 0;

  return request({
    url: '/users/',
    method: 'get',
    params: query
  })
}

export function fetchSponsor(id) {
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

export function createSponsor(data, token) {
  return request({
    url: '/admin/users/',
    method: 'post',
    params: { token },
    data
  })
}

export function updateSponsor(data, token) {


  return request({
    url: '/admin/users/',
    method: 'put',
    params: { token },
    data
  })
}

export function deleteSponsor(data, token) {


  return request({
    url: '/admin/users/',
    method: 'delete',
    params: { token },
    data
  })
}
