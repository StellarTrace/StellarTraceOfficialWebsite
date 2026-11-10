import request from '@/utils/request'

export function getFounderList(): Promise<any> {
  return request.get('/founder/list')
}
export function getFounder(id: number): Promise<any> {
  return request.get(`/founder/${id}`)
}
export function addFounder(data: any): Promise<any> {
  return request.post('/founder', data)
}
export function updateFounder(data: any): Promise<any> {
  return request.put(`/founder/${data.id}`, data)
}
export function deleteFounder(id: number): Promise<any> {
  return request.delete(`/founder/${id}`)
}
