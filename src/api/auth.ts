import request from '@/utils/request'

export interface LoginForm {
  username: string
  password: string
  code: string
  captchaToken: string
}

export function getCaptcha(): Promise<any> {
  return request.get('/auth/captcha')
}

export function login(data: LoginForm): Promise<any> {
  return request.post('/auth/login', data)
}

export function getUserInfo(): Promise<any> {
  return request.get('/auth/userinfo')
}

export function logout(): Promise<any> {
  return request.post('/auth/logout')
}
