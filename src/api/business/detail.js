import request from '@/utils/request'

// 查询商品详情图列表
export function listDetail(productId) {
  return request({
    url: '/business/detail/list/'+ productId,
    method: 'get',
  })
}

// 查询商品详情图详细
export function getDetail(id) {
  return request({
    url: '/business/detail/' + id,
    method: 'get'
  })
}

// 新增商品详情图
export function addDetail(data) {
  return request({
    url: '/business/detail',
    method: 'post',
    data: data
  })
}

// 修改商品详情图
export function updateDetail(data) {
  return request({
    url: '/business/detail',
    method: 'put',
    data: data
  })
}

// 删除商品详情图
export function delDetail(id) {
  return request({
    url: '/business/detail/' + id,
    method: 'delete'
  })
}
