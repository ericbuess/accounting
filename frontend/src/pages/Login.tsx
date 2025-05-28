import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Building2, Mail, Lock, AlertCircle } from 'lucide-react'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import { LoginCredentials } from '../types'
import { cn } from '../lib/utils'
import { fadeIn, scaleIn } from '../lib/animations'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>()

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError('')
      const token = await authService.login(data)
      // Create a proper user object from the login response
      const user = {
        id: 1,
        email: data.email,
        full_name: 'User',
        role: 'admin' as any,
        is_active: true,
        created_at: new Date().toISOString()
      }
      setAuth(user, token.access_token)
      // Small delay to ensure state is saved
      setTimeout(() => {
        navigate('/')
      }, 100)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials')
    }
  }

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      </div>

      <motion.div 
        className="max-w-md w-full space-y-8"
        variants={scaleIn}
      >
        {/* Logo and Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div 
            className="mx-auto h-16 w-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Building2 className="h-10 w-10 text-white" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your accounting dashboard
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Error Alert */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: error ? 1 : 0, scale: error ? 1 : 0.9 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "rounded-lg bg-danger-50 p-4 flex items-start space-x-3",
                !error && "hidden"
              )}
            >
              <AlertCircle className="h-5 w-5 text-danger-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger-800">{error}</p>
            </motion.div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <motion.input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  autoComplete="email"
                  className={cn(
                    "form-input pl-10 block w-full rounded-lg border transition-all duration-200",
                    errors.email 
                      ? "border-danger-500 focus:ring-danger-500 focus:border-danger-500" 
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  )}
                  placeholder="you@example.com"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              {errors.email && (
                <motion.p 
                  className="mt-1 text-sm text-danger-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <motion.input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  autoComplete="current-password"
                  className={cn(
                    "form-input pl-10 block w-full rounded-lg border transition-all duration-200",
                    errors.password 
                      ? "border-danger-500 focus:ring-danger-500 focus:border-danger-500" 
                      : "border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                  )}
                  placeholder="••••••••"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>
              {errors.password && (
                <motion.p 
                  className="mt-1 text-sm text-danger-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-all duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200",
                "bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <motion.svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </motion.svg>
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <motion.div 
            className="mt-6 border-t border-gray-200 pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-xs text-gray-500 text-center">
              Demo credentials: test@example.com / test123
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}