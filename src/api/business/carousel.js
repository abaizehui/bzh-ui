import request from '@/utils/request'

// 查询轮播图列表
export function listCarousel(storeId) {
  return request({
    url: '/business/carousel/list/' + storeId,
    method: 'get'
  })
}

// 查询轮播图详细
export function getCarousel(id) {
  return request({
    url: '/business/carousel/' + id,
    method: 'get'
  })
}

// 新增轮播图
export function addCarousel(data) {
  return request({
    url: '/business/carousel',
    method: 'post',
    data: data
  })
}

// 修改轮播图
export function updateCarousel(data) {
  return request({
    url: '/business/carousel',
    method: 'put',
    data: data
  })
}

// 删除轮播图
export function delCarousel(id) {
  return request({
    url: '/business/carousel/' + id,
    method: 'delete'
  })
}

// 查询所有门店列表
export function listAllStore() {
  return request({
    url: '/business/store/listAll',
    method: 'get',
  })
}
