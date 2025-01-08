import request from '@/utils/request'

// 查询商品参数列表
export function listParam(productId) {
  return request({
    url: '/business/param/list/' + productId,
    method: 'get'
  })
}

// 查询商品参数详细
export function getParam(id) {
  return request({
    url: '/business/param/' + id,
    method: 'get'
  })
}

// 新增商品参数
export function addParam(data) {
  return request({
    url: '/business/param',
    method: 'post',
    data: data
  })
}

// 修改商品参数
export function updateParam(data) {
  return request({
    url: '/business/param',
    method: 'put',
    data: data
  })
}

// 删除商品参数
export function delParam(id) {
  return request({
    url: '/business/param/' + id,
    method: 'delete'
  })
}
