import request from '@/utils/request'

export function getMetaphorList(): Promise<any> {
  return request.get('/metaphor/list')
}
export function addMetaphor(data: any): Promise<any> {
  return request.post('/metaphor', data)
}
export function updateMetaphor(data: any): Promise<any> {
  return request.put(`/metaphor/${data.id}`, data)
}
export function deleteMetaphor(id: number): Promise<any> {
  return request.delete(`/metaphor/${id}`)
}

export function getMetaphorDesign(): Promise<any> {
  return request.get('/metaphor-design/detail')
}
export function updateMetaphorDesign(data: any): Promise<any> {
  return request.put('/metaphor-design', data)
}
