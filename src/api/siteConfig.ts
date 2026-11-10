import request from '@/utils/request'

export function getSiteConfig(): Promise<any> {
  return request.get('/site-config/all')
}
