import request from '@/utils/request'

export function getHomeBannerList(): Promise<any> {
  return request.get('/home-banner/list')
}
export function getHomeBanner(id: number): Promise<any> {
  return request.get(`/home-banner/${id}`)
}
export function addHomeBanner(data: any): Promise<any> {
  return request.post('/home-banner', data)
}
export function updateHomeBanner(data: any): Promise<any> {
  return request.put(`/home-banner/${data.id}`, data)
}
export function deleteHomeBanner(id: number): Promise<any> {
  return request.delete(`/home-banner/${id}`)
}
