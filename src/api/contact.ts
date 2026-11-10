import request from '@/utils/request'

export function getContactInfoList(): Promise<any> {
  return request.get('/contact-info/list')
}
export function addContactInfo(data: any): Promise<any> {
  return request.post('/contact-info', data)
}
export function updateContactInfo(data: any): Promise<any> {
  return request.put(`/contact-info/${data.id}`, data)
}
export function deleteContactInfo(id: number): Promise<any> {
  return request.delete(`/contact-info/${id}`)
}

export function getContactMessageList(params?: any): Promise<any> {
  return request.get('/contact-message/list', { params })
}
export function readContactMessage(id: number): Promise<any> {
  return request.put(`/contact-message/${id}/read`)
}
export function replyContactMessage(id: number, data: any): Promise<any> {
  return request.put(`/contact-message/${id}/reply`, data)
}
export function deleteContactMessage(id: number): Promise<any> {
  return request.delete(`/contact-message/${id}`)
}
