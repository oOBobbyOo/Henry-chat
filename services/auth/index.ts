import { request } from '@/lib/request'

export const AuthService = {
  signup: (body: Auth.SignupRequestBody) =>
    request.post('/api/auth/signup', {
      body,
    }),
  phoneLogin: (body: Auth.PhoneLoginRequestBody) =>
    request.post('/api/auth/phone/login', {
      body,
    }),
  emailLogin: (body: Auth.EmailLoginRequestBody) =>
    request.post('/api/auth/email/login', {
      body,
    }),
  forgotPassword: (body: Auth.ForgotPasswordRequestBody) =>
    request.post('/api/auth/forgot-password', {
      body,
    }),
}
