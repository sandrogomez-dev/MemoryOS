import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'

const AddReminder = () => {
  const navigate = useNavigate()
  const { store, dispatch, actions } = useGlobalState()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    trigger_date: '',
    trigger_time: '',
    frequency: 'once',
    memory_id: '',
    notification_methods: ['browser'],
    advance_notice: 15
  })
  const [memories, setMemories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const frequencyOptions = [
    { value: 'once', label: '🔔 One-time', description: 'Remind me just once' },
    { value: 'daily', label: '📅 Daily', description: 'Every day at this time' },
    { value: 'weekly', label: '📆 Weekly', description: 'Every week on this day' },
    { value: 'monthly', label: '🗓️ Monthly', description: 'Every month on this date' },
    { value: 'yearly', label: '📊 Yearly', description: 'Every year on this date' }
  ]

  const notificationMethods = [
    { value: 'browser', label: '🌐 Browser Notification', description: 'Show in browser' },
    { value: 'email', label: '📧 Email', description: 'Send to your email' },
    { value: 'sms', label: '📱 SMS', description: 'Text message (Premium)' }
  ]

  const advanceNoticeOptions = [
    { value: 0, label: 'At the time' },
    { value: 5, label: '5 minutes before' },
    { value: 15, label: '15 minutes before' },
    { value: 30, label: '30 minutes before' },
    { value: 60, label: '1 hour before' },
    { value: 1440, label: '1 day before' },
    { value: 10080, label: '1 week before' }
  ]

  useEffect(() => {
    // Fetch user's memories for linking
    fetchMemories()
  }, [])

  const fetchMemories = async () => {
    try {
      const response = await fetch('/api/memories/?per_page=50', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setMemories(data.memories || [])
      }
    } catch (error) {
      console.error('Error fetching memories:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      if (name === 'notification_methods') {
        setFormData(prev => ({
          ...prev,
          notification_methods: checked 
            ? [...prev.notification_methods, value]
            : prev.notification_methods.filter(method => method !== value)
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (!formData.trigger_date) {
      newErrors.trigger_date = 'Date is required'
    } else {
      const selectedDate = new Date(`${formData.trigger_date}T${formData.trigger_time || '12:00'}`)
      const now = new Date()
      if (selectedDate <= now) {
        newErrors.trigger_date = 'Date must be in the future'
      }
    }

    if (!formData.trigger_time) {
      newErrors.trigger_time = 'Time is required'
    }

    if (formData.notification_methods.length === 0) {
      newErrors.notification_methods = 'Select at least one notification method'
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
      const triggerDateTime = new Date(`${formData.trigger_date}T${formData.trigger_time}`)
      
      const reminderData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        trigger_date: triggerDateTime.toISOString(),
        frequency: formData.frequency,
        memory_id: formData.memory_id || null,
        notification_methods: formData.notification_methods,
        advance_notice: parseInt(formData.advance_notice)
      }

      // TODO: Replace with real API call when backend is ready
      console.log('Creating reminder:', reminderData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Success notification
      dispatch({
        type: actions.SET_SUCCESS,
        payload: 'Reminder created successfully! 🔔'
      })
      
      // Redirect to reminders page
      navigate('/reminders')
    } catch (error) {
      dispatch({
        type: actions.SET_ERROR,
        payload: error.message || 'Failed to create reminder'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getMinDateTime = () => {
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    return tomorrow.toISOString().slice(0, 16)
  }

  const getMinDate = () => {
    const now = new Date()
    return now.toISOString().slice(0, 10)
  }

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div className="position-absolute w-100 h-100" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        zIndex: 1
      }}></div>

      <div className="container-fluid py-5 position-relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
              <button 
                onClick={() => navigate('/reminders')} 
                className="btn btn-outline-light me-3"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
              <div>
                <h2 className="mb-1 text-white fw-bold">
                  <i className="bi bi-alarm me-2"></i>
                  Set New Reminder
                </h2>
                <p className="text-white opacity-75 mb-0">Never forget important things again</p>
              </div>
            </div>

            <div className="card border-0 glass-card">
              <div className="card-body p-4">
                {/* Error Alert */}
                {store.error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {store.error}
                  </div>
                )}

                {/* Success Alert */}
                {store.success && (
                  <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {store.success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div className="mb-4">
                    <label htmlFor="title" className="form-label">
                      <i className="bi bi-card-heading me-2"></i>
                      Reminder Title *
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="What do you want to be reminded about?"
                      disabled={isLoading}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label htmlFor="description" className="form-label">
                      <i className="bi bi-card-text me-2"></i>
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Add more details about this reminder..."
                      disabled={isLoading}
                    ></textarea>
                  </div>

                  {/* Date and Time */}
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label htmlFor="trigger_date" className="form-label">
                        <i className="bi bi-calendar me-2"></i>
                        Date *
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.trigger_date ? 'is-invalid' : ''}`}
                        id="trigger_date"
                        name="trigger_date"
                        value={formData.trigger_date}
                        onChange={handleChange}
                        min={getMinDate()}
                        disabled={isLoading}
                      />
                      {errors.trigger_date && (
                        <div className="invalid-feedback">{errors.trigger_date}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="trigger_time" className="form-label">
                        <i className="bi bi-clock me-2"></i>
                        Time *
                      </label>
                      <input
                        type="time"
                        className={`form-control ${errors.trigger_time ? 'is-invalid' : ''}`}
                        id="trigger_time"
                        name="trigger_time"
                        value={formData.trigger_time}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      {errors.trigger_time && (
                        <div className="invalid-feedback">{errors.trigger_time}</div>
                      )}
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="mb-4">
                    <label className="form-label">
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Frequency
                    </label>
                    <div className="row g-3">
                      {frequencyOptions.map(option => (
                        <div key={option.value} className="col-md-6">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="frequency"
                              id={`frequency_${option.value}`}
                              value={option.value}
                              checked={formData.frequency === option.value}
                              onChange={handleChange}
                              disabled={isLoading}
                            />
                            <label className="form-check-label" htmlFor={`frequency_${option.value}`}>
                              <div className="fw-bold">{option.label}</div>
                              <small className="text-muted">{option.description}</small>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advance Notice */}
                  <div className="mb-4">
                    <label htmlFor="advance_notice" className="form-label">
                      <i className="bi bi-bell me-2"></i>
                      Advance Notice
                    </label>
                    <select
                      className="form-select"
                      id="advance_notice"
                      name="advance_notice"
                      value={formData.advance_notice}
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      {advanceNoticeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Notification Methods */}
                  <div className="mb-4">
                    <label className="form-label">
                      <i className="bi bi-send me-2"></i>
                      Notification Methods *
                    </label>
                    {errors.notification_methods && (
                      <div className="text-danger small mb-2">{errors.notification_methods}</div>
                    )}
                    <div className="row g-3">
                      {notificationMethods.map(method => (
                        <div key={method.value} className="col-md-4">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="notification_methods"
                              id={`method_${method.value}`}
                              value={method.value}
                              checked={formData.notification_methods.includes(method.value)}
                              onChange={handleChange}
                              disabled={isLoading || (method.value === 'sms' && store.user?.subscription_type !== 'premium')}
                            />
                            <label className="form-check-label" htmlFor={`method_${method.value}`}>
                              <div className="fw-bold">{method.label}</div>
                              <small className="text-muted">{method.description}</small>
                              {method.value === 'sms' && store.user?.subscription_type !== 'premium' && (
                                <small className="text-warning d-block">Premium only</small>
                              )}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Link to Memory */}
                  <div className="mb-4">
                    <label htmlFor="memory_id" className="form-label">
                      <i className="bi bi-link me-2"></i>
                      Link to Memory (Optional)
                    </label>
                    <select
                      className="form-select"
                      id="memory_id"
                      name="memory_id"
                      value={formData.memory_id}
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      <option value="">No linked memory</option>
                      {memories.map(memory => (
                        <option key={memory.id} value={memory.id}>
                          {memory.title}
                        </option>
                      ))}
                    </select>
                    <div className="form-text">
                      <i className="bi bi-info-circle me-1"></i>
                      Link this reminder to an existing memory for context
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="d-flex justify-content-end gap-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/reminders')}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-alarm me-2"></i>
                          Set Reminder
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="row mt-4">
              <div className="col-md-4">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center p-3">
                    <i className="bi bi-clock display-6 text-primary mb-2"></i>
                    <h6>Smart Timing</h6>
                    <small className="text-muted">Set reminders for optimal times</small>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center p-3">
                    <i className="bi bi-arrow-repeat display-6 text-success mb-2"></i>
                    <h6>Recurring</h6>
                    <small className="text-muted">Set up repeating reminders</small>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 bg-light">
                  <div className="card-body text-center p-3">
                    <i className="bi bi-link display-6 text-info mb-2"></i>
                    <h6>Memory Links</h6>
                    <small className="text-muted">Connect to your stored memories</small>
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

export default AddReminder 