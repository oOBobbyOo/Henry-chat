import { SignupForm } from '../_components/SignupForm'

export default function SignupPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl leading-tight font-bold tracking-tight text-gray-900 sm:text-3xl md:mb-2.5 md:text-4xl lg:text-5xl">创建账户</h1>
        <p className="text-base leading-relaxed font-medium text-gray-600 md:text-base">创建您的账户</p>
      </div>

      {/* Signup Form */}
      <SignupForm />
    </>
  )
}
