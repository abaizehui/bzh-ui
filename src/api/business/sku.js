import request from '@/utils/request'

// 查询SKU列表
export function listSku(query) {
  return request({
    url: '/business/sku/list',
    method: 'get',
    params: query
  })
}

// 查询SKU详细
export function getSku(id) {
  return request({
    url: '/business/sku/' + id,
    method: 'get'
  })
}

// 新增SKU
export function addSku(data) {
  return request({
    url: '/business/sku',
    method: 'post',
    data: data
  })
}

// 修改SKU
export function updateSku(data) {
  return request({
    url: '/business/sku',
    method: 'put',
    data: data
  })
}

// 删除SKU
export function delSku(id) {
  return request({
    url: '/business/sku/' + id,
    method: 'delete'
  })
}
