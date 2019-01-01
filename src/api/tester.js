import request from '@/utils/request'

export function fetchList(query) {

  return request({
    url: '/testers/',
    method: 'get',
    params: query
  })
}

export function fetchInfluencer(id) {
  return request({
    url: '/testers/' + id,
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

export function createTester(data, token) {
  return request({
    url: '/admin/testers/',
    method: 'post',
    params: { token },
    data
  })
}

export function updateTester(data, token) {


  return request({
    url: '/admin/testers/',
    method: 'put',
    params: { token },
    data
  })
}

export function deleteTester(data, token) {


  return request({
    url: '/admin/testers/',
    method: 'delete',
    params: { token },
    data
  })
}
