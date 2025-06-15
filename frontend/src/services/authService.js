const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class AuthService {
  async login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    return data.user
  }

  async register(email, password, name) {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password, name }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    return data.user
  }

  async logout() {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }

    return true
  }

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Not authenticated')
    }

    const data = await response.json()
    return data.user
  }

  async refreshToken() {
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Token refresh failed')
    }

    const data = await response.json()
    return data.user
  }
}

export const authService = new AuthService() 