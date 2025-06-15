import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'
import { authService } from '../services/authService'

const Register = () => {
  const { store, dispatch, actions } = useGlobalState()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (store.isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [store.isAuthenticated, navigate])

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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      const user = await authService.register(
        formData.email, 
        formData.password, 
        formData.name.trim()
      )
      dispatch({ type: actions.LOGIN_SUCCESS, payload: user })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      dispatch({ 
        type: actions.SET_ERROR, 
        payload: error.message || 'Registration failed' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, text: '', color: '' }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const levels = [
      { text: 'Very Weak', color: 'danger' },
      { text: 'Weak', color: 'warning' },
      { text: 'Fair', color: 'info' },
      { text: 'Good', color: 'primary' },
      { text: 'Strong', color: 'success' }
    ]

    return { strength, ...levels[Math.min(strength, 4)] }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
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
                  <p className="text-muted">Create your free account</p>
                </div>

                {/* Error Alert */}
                {store.error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {store.error}
                  </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

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

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary position-absolute end-0 top-0 h-100 px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    {errors.password && (
                      <div className="invalid-feedback d-block">{errors.password}</div>
                    )}
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">Password strength:</small>
                          <small className={`text-${passwordStrength.color} fw-bold`}>
                            {passwordStrength.text}
                          </small>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div 
                            className={`progress-bar bg-${passwordStrength.color}`}
                            style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                  </div>

                  {/* Terms and Privacy */}
                  <div className="mb-4">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="terms" required />
                      <label className="form-check-label text-muted small" htmlFor="terms">
                        I agree to the{' '}
                        <Link to="/terms" className="text-decoration-none">Terms of Service</Link>
                        {' '}and{' '}
                        <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center my-4">
                  <span className="text-muted">Already have an account?</span>
                </div>

                {/* Login Link */}
                <Link to="/login" className="btn btn-outline-primary w-100">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In Instead
                </Link>
              </div>
            </div>

            {/* Benefits Preview */}
            <div className="text-center mt-4">
              <h6 className="text-muted mb-3">What you get with MemoryOS:</h6>
              <div className="row g-2 text-start">
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <small className="text-muted">100 free memories</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <small className="text-muted">Smart reminders</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <small className="text-muted">Instant search</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    <small className="text-muted">Secure & private</small>
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

export default Register 