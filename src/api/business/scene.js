import request from '@/utils/request'

// 查询商品实景图列表
export function listScene(productId) {
  return request({
    url: '/business/scene/list/' + productId,
    method: 'get'
  })
}

// 查询商品实景图详细
export function getScene(id) {
  return request({
    url: '/business/scene/' + id,
    method: 'get'
  })
}

// 新增商品实景图
export function addScene(data) {
  return request({
    url: '/business/scene',
    method: 'post',
    data: data
  })
}

// 修改商品实景图
export function updateScene(data) {
  return request({
    url: '/business/scene',
    method: 'put',
    data: data
  })
}

// 删除商品实景图
export function delScene(id) {
  return request({
    url: '/business/scene/' + id,
    method: 'delete'
  })
}
