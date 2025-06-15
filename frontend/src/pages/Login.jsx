import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'
import { authService } from '../services/authService'

const Login = () => {
  const { store, dispatch, actions } = useGlobalState()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (store.isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [store.isAuthenticated, navigate, location])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    dispatch({ type: actions.CLEAR_ERROR })

    try {
      const user = await authService.login(formData.email, formData.password)
      dispatch({ type: actions.LOGIN_SUCCESS, payload: user })
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
          } catch (error) {
        let errorMessage = 'Login failed. Please try again.'
        
        if (error.message.includes('fetch')) {
          errorMessage = '🔌 Connection error. Please check if the server is running and try again.'
        } else if (error.message.includes('Invalid credentials')) {
          errorMessage = '🔐 Invalid email or password. Please check your credentials.'
        } else if (error.message.includes('User not found')) {
          errorMessage = '👤 Account not found. Please register first or check your email.'
        } else if (error.message) {
          errorMessage = error.message
        }
        
        dispatch({
          type: actions.SET_ERROR,
          payload: errorMessage
        })
      } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <Link to="/" className="text-decoration-none">
                    <h2 className="fw-bold text-gradient">
                      <i className="bi bi-brain me-2"></i>
                      MemoryOS
                    </h2>
                  </Link>
                  <p className="text-muted">Sign in to your account</p>
                </div>

                {/* Error Alert */}
                {store.error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {store.error}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="remember" />
                      <label className="form-check-label text-muted" htmlFor="remember">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-decoration-none small">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center my-4">
                  <span className="text-muted">Don't have an account?</span>
                </div>

                {/* Register Link */}
                <Link to="/register" className="btn btn-outline-primary w-100">
                  <i className="bi bi-person-plus me-2"></i>
                  Create New Account
                </Link>

                {/* Demo Account */}
                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="btn btn-link text-muted small"
                    onClick={() => {
                      setFormData({
                        email: 'demo@memoryos.app',
                        password: 'Demo123!'
                      })
                    }}
                  >
                    <i className="bi bi-play-circle me-1"></i>
                    Try Demo Account
                  </button>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="text-center mt-4">
              <div className="row g-3">
                <div className="col-4">
                  <div className="text-primary">
                    <i className="bi bi-shield-check display-6"></i>
                    <div className="small text-muted mt-1">Secure</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-success">
                    <i className="bi bi-lightning display-6"></i>
                    <div className="small text-muted mt-1">Fast</div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-info">
                    <i className="bi bi-globe display-6"></i>
                    <div className="small text-muted mt-1">Accessible</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 