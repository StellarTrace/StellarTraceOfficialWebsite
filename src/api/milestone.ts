import request from '@/utils/request'

export function getMilestoneList(): Promise<any> {
  return request.get('/milestone/list')
}
export function getMilestone(id: number): Promise<any> {
  return request.get(`/milestone/${id}`)
}
export function addMilestone(data: any): Promise<any> {
  return request.post('/milestone', data)
}
export function updateMilestone(data: any): Promise<any> {
  return request.put(`/milestone/${data.id}`, data)
}
export function deleteMilestone(id: number): Promise<any> {
  return request.delete(`/milestone/${id}`)
}
