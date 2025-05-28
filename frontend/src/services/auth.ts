import api from './api'
import { User, LoginCredentials, AuthToken } from '../types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const formData = new FormData()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)
    
    const response = await api.post<AuthToken>('/auth/token', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  async register(data: { email: string; password: string; full_name?: string; role?: string }): Promise<User> {
    const response = await api.post<User>('/auth/register', data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  }
}