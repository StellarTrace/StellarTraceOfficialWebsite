import request from '@/utils/request'

export function getAiReplyTemplateList(): Promise<any> {
  return request.get('/ai-reply-template/list')
}
export function getAiReplyTemplate(id: number): Promise<any> {
  return request.get(`/ai-reply-template/${id}`)
}
export function addAiReplyTemplate(data: any): Promise<any> {
  return request.post('/ai-reply-template', data)
}
export function updateAiReplyTemplate(data: any): Promise<any> {
  return request.put(`/ai-reply-template/${data.id}`, data)
}
export function deleteAiReplyTemplate(id: number): Promise<any> {
  return request.delete(`/ai-reply-template/${id}`)
}
