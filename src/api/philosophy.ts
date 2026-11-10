import request from '@/utils/request'

export function getPhilosophyList(): Promise<any> {
  return request.get('/philosophy/list')
}
export function getPhilosophy(id: number): Promise<any> {
  return request.get(`/philosophy/${id}`)
}
export function addPhilosophy(data: any): Promise<any> {
  return request.post('/philosophy', data)
}
export function updatePhilosophy(data: any): Promise<any> {
  return request.put(`/philosophy/${data.id}`, data)
}
export function deletePhilosophy(id: number): Promise<any> {
  return request.delete(`/philosophy/${id}`)
}
