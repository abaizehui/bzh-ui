import request from '@/utils/request'

// 查询商品功能配置列表
export function listConfig(query) {
  return request({
    url: '/business/config/list',
    method: 'get',
    params: query
  })
}

// 查询商品功能配置详细
export function getConfig(id) {
  return request({
    url: '/business/config/' + id,
    method: 'get'
  })
}

// 新增商品功能配置
export function addConfig(data) {
  return request({
    url: '/business/config',
    method: 'post',
    data: data
  })
}

// 修改商品功能配置
export function updateConfig(data) {
  return request({
    url: '/business/config',
    method: 'put',
    data: data
  })
}

// 删除商品功能配置
export function delConfig(id) {
  return request({
    url: '/business/config/' + id,
    method: 'delete'
  })
}
