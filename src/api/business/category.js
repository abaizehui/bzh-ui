import request from '@/utils/request'

// 查询产品类目列表
export function listCategory(query) {
  return request({
    url: '/business/category/list',
    method: 'get',
    params: query
  })
}

// 查询产品类目详细
export function getCategory(id) {
  return request({
    url: '/business/category/' + id,
    method: 'get'
  })
}

// 新增产品类目
export function addCategory(data) {
  return request({
    url: '/business/category',
    method: 'post',
    data: data
  })
}

// 修改产品类目
export function updateCategory(data) {
  return request({
    url: '/business/category',
    method: 'put',
    data: data
  })
}

// 删除产品类目
export function delCategory(id) {
  return request({
    url: '/business/category/' + id,
    method: 'delete'
  })
}
