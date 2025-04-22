import request from '@/utils/request'

// 查询商品套装列表
export function listSet(query) {
  return request({
    url: '/business/set/list',
    method: 'get',
    params: query
  })
}

// 查询商品套装详细
export function getSet(id) {
  return request({
    url: '/business/set/' + id,
    method: 'get'
  })
}

// 新增商品套装
export function addSet(data) {
  return request({
    url: '/business/set',
    method: 'post',
    data: data
  })
}

// 修改商品套装
export function updateSet(data) {
  return request({
    url: '/business/set',
    method: 'put',
    data: data
  })
}

// 删除商品套装
export function delSet(id) {
  return request({
    url: '/business/set/' + id,
    method: 'delete'
  })
}
