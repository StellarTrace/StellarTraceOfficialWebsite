import request from '@/utils/request'

export function getCoreTechList(): Promise<any> {
  return request.get('/core-tech/list')
}
export function getCoreTech(id: number): Promise<any> {
  return request.get(`/core-tech/${id}`)
}
export function addCoreTech(data: any): Promise<any> {
  return request.post('/core-tech', data)
}
export function updateCoreTech(data: any): Promise<any> {
  return request.put(`/core-tech/${data.id}`, data)
}
export function deleteCoreTech(id: number): Promise<any> {
  return request.delete(`/core-tech/${id}`)
}
