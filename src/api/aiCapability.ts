import request from '@/utils/request'

export function getAiCapabilityList(): Promise<any> {
  return request.get('/ai-capability/list')
}
export function getAiCapability(id: number): Promise<any> {
  return request.get(`/ai-capability/${id}`)
}
export function addAiCapability(data: any): Promise<any> {
  return request.post('/ai-capability', data)
}
export function updateAiCapability(data: any): Promise<any> {
  return request.put(`/ai-capability/${data.id}`, data)
}
export function deleteAiCapability(id: number): Promise<any> {
  return request.delete(`/ai-capability/${id}`)
}

export function getAiDashboardList(): Promise<any> {
  return request.get('/ai-dashboard/list')
}
export function addAiDashboard(data: any): Promise<any> {
  return request.post('/ai-dashboard', data)
}
export function updateAiDashboard(data: any): Promise<any> {
  return request.put(`/ai-dashboard/${data.id}`, data)
}
export function deleteAiDashboard(id: number): Promise<any> {
  return request.delete(`/ai-dashboard/${id}`)
}
