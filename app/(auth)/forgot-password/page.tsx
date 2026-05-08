import { ForgotPasswordForm } from '../_components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-3xl md:mb-2.5 md:text-4xl lg:text-5xl">忘记密码</h1>
        <p className="text-base leading-relaxed font-medium text-gray-600 md:text-base">输入注册邮箱，我们将为您发送密码重置链接</p>
      </div>

      {/* Forgot Password Form */}
      <ForgotPasswordForm />
    </>
  )
}
