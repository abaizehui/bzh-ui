import request from '@/utils/request'

// 查询商品套装详情图列表
export function listImage(query) {
  return request({
    url: '/business/image/list',
    method: 'get',
    params: query
  })
}

// 查询商品套装详情图详细
export function getImage(id) {
  return request({
    url: '/business/image/' + id,
    method: 'get'
  })
}

// 新增商品套装详情图
export function addImage(data) {
  return request({
    url: '/business/image',
    method: 'post',
    data: data
  })
}

// 修改商品套装详情图
export function updateImage(data) {
  return request({
    url: '/business/image',
    method: 'put',
    data: data
  })
}

// 删除商品套装详情图
export function delImage(id) {
  return request({
    url: '/business/image/' + id,
    method: 'delete'
  })
}
