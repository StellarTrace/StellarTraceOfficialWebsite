import request from '@/utils/request'

export function getDashboardStats(): Promise<any> {
  return request.get('/dashboard/stats')
}
