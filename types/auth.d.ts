declare namespace Auth {
  /** 注册请求参数 */
  export interface SignupRequestBody {
    /** 用户名 */
    name: string
    /** 邮箱 */
    email: string
    /** 密码 */
    password: string
  }

  /** 手机登录请求参数 */
  export interface PhoneLoginRequestBody {
    /** 手机 */
    phone: string
    /** 手机验证码 */
    code: string
  }

  /** 邮箱登录请求参数 */
  export interface EmailLoginRequestBody {
    /** 邮箱 */
    email: string
    /** 密码 */
    password: string
  }

  /** 忘记密码请求参数 */
  export interface ForgotPasswordRequestBody {
    /** 邮箱 */
    email: string
  }
}
