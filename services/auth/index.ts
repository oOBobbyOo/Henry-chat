import { request } from '@/lib/request'

export const AuthService = {
  signup: (params: Auth.SignupParams) => request.post('/api/auth/signup', params),
  phoneLogin: (params: Auth.PhoneLoginParams) => request.post('/api/auth/phone/login', params),
  emailLogin: (params: Auth.EmailLoginParams) => request.post('/api/auth/email/login', params),
  forgotPassword: (params: Auth.ForgotPasswordParams) => request.post('/api/auth/forgot-password', params),
}
