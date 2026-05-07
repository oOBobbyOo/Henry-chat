import { useState } from 'react'

export function useAuth() {
  const [isTyping, setIsTyping] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  return {
    isTyping,
    password,
    showPassword,
    setShowPassword,
  }
}
