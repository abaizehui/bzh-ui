import request from '@/utils/request'

// 查询门店预约列表
export function listReservation(query) {
  return request({
    url: '/business/reservation/list',
    method: 'get',
    params: query
  })
}

// 查询门店预约详细
export function getReservation(id) {
  return request({
    url: '/business/reservation/' + id,
    method: 'get'
  })
}

// 新增门店预约
export function addReservation(data) {
  return request({
    url: '/business/reservation',
    method: 'post',
    data: data
  })
}

// 修改门店预约
export function updateReservation(data) {
  return request({
    url: '/business/reservation',
    method: 'put',
    data: data
  })
}

// 删除门店预约
export function delReservation(id) {
  return request({
    url: '/business/reservation/' + id,
    method: 'delete'
  })
}
