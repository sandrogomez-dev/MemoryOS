const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

class AuthService {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Login failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (jsonError) {
          // If JSON parsing fails, use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      // Check if response has content before parsing JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format')
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('🚫 Cannot connect to server. Please check if the backend is running on http://localhost:5001')
      }
      if (error.message.includes('Unexpected end of JSON input')) {
        throw new Error('🚫 Server returned empty response. Backend may not be running properly.')
      }
      throw error
    }
  }

  async register(email, password, name) {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        let errorMessage = 'Registration failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (jsonError) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format')
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('🚫 Cannot connect to server. Please check if the backend is running on http://localhost:5001')
      }
      if (error.message.includes('Unexpected end of JSON input')) {
        throw new Error('🚫 Server returned empty response. Backend may not be running properly.')
      }
      throw error
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      return true
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('🚫 Cannot connect to server')
      }
      throw error
    }
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Not authenticated')
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format')
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('🚫 Cannot connect to server')
      }
      if (error.message.includes('Unexpected end of JSON input')) {
        throw new Error('🚫 Server returned empty response')
      }
      throw error
    }
  }

  async refreshToken() {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format')
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('🚫 Cannot connect to server')
      }
      if (error.message.includes('Unexpected end of JSON input')) {
        throw new Error('🚫 Server returned empty response')
      }
      throw error
    }
  }
}

export const authService = new AuthService() 