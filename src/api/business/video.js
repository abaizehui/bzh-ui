import request from '@/utils/request'

// 查询门店视频列表
export function listVideo(query) {
  return request({
    url: '/business/video/list',
    method: 'get',
    params: query
  })
}

// 查询门店视频详细
export function getVideo(id) {
  return request({
    url: '/business/video/' + id,
    method: 'get'
  })
}

// 新增门店视频
export function addVideo(data) {
  return request({
    url: '/business/video',
    method: 'post',
    data: data
  })
}

// 修改门店视频
export function updateVideo(data) {
  return request({
    url: '/business/video',
    method: 'put',
    data: data
  })
}

// 删除门店视频
export function delVideo(id) {
  return request({
    url: '/business/video/' + id,
    method: 'delete'
  })
}
