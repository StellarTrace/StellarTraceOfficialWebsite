import request from '@/utils/request'

export function getEcosystemList(): Promise<any> {
  return request.get('/ecosystem/list')
}
export function getEcosystem(id: number): Promise<any> {
  return request.get(`/ecosystem/${id}`)
}
export function addEcosystem(data: any): Promise<any> {
  return request.post('/ecosystem', data)
}
export function updateEcosystem(data: any): Promise<any> {
  return request.put(`/ecosystem/${data.id}`, data)
}
export function deleteEcosystem(id: number): Promise<any> {
  return request.delete(`/ecosystem/${id}`)
}
