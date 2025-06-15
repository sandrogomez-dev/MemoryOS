import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'

const AddMemory = () => {
  const navigate = useNavigate()
  const { store, dispatch, actions } = useGlobalState()
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    memory_type: 'note',
    importance_level: 3,
    tags: []
  })
  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const memoryTypes = [
    { value: 'note', label: '📝 Note', icon: 'bi-file-text' },
    { value: 'idea', label: '💡 Idea', icon: 'bi-lightbulb' },
    { value: 'task', label: '✅ Task', icon: 'bi-check-square' },
    { value: 'learning', label: '🧠 Learning', icon: 'bi-book' },
    { value: 'reference', label: '📚 Reference', icon: 'bi-bookmark' },
    { value: 'quote', label: '💬 Quote', icon: 'bi-quote' }
  ]

  const importanceColors = {
    1: 'secondary',
    2: 'info', 
    3: 'primary',
    4: 'warning',
    5: 'danger'
  }

  const importanceLabels = {
    1: 'Low',
    2: 'Normal', 
    3: 'Medium',
    4: 'High',
    5: 'Critical'
  }

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

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = tagInput.trim().toLowerCase()
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }))
      }
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
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
      const response = await fetch('/api/memories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          memory_type: formData.memory_type,
          importance_level: parseInt(formData.importance_level),
          tags: formData.tags
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Success notification
        dispatch({
          type: actions.SET_SUCCESS,
          payload: 'Memory created successfully! 🎉'
        })
        
        // Redirect to memory vault
        navigate('/memories')
      } else {
        throw new Error(data.message || 'Failed to create memory')
      }
    } catch (error) {
      dispatch({
        type: actions.SET_ERROR,
        payload: error.message || 'Failed to create memory'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSelectedTypeIcon = () => {
    const type = memoryTypes.find(t => t.value === formData.memory_type)
    return type ? type.icon : 'bi-file-text'
  }

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                onClick={() => navigate('/memories')} 
                className="btn btn-outline-light me-3"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
              <div>
                <h2 className="mb-1 text-white fw-bold">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Memory
                </h2>
                <p className="text-white opacity-75 mb-0">Capture and store your thoughts, ideas, and important information</p>
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
                    Title *
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a descriptive title..."
                    disabled={isLoading}
                  />
                  {errors.title && (
                    <div className="invalid-feedback">{errors.title}</div>
                  )}
                </div>

                {/* Memory Type & Importance */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="memory_type" className="form-label">
                      <i className={`bi ${getSelectedTypeIcon()} me-2`}></i>
                      Type
                    </label>
                    <select
                      className="form-select"
                      id="memory_type"
                      name="memory_type"
                      value={formData.memory_type}
                      onChange={handleChange}
                      disabled={isLoading}
                    >
                      {memoryTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-6">
                    <label htmlFor="importance_level" className="form-label">
                      <i className="bi bi-star me-2"></i>
                      Importance
                    </label>
                    <div className="d-flex align-items-center">
                      <input
                        type="range"
                        className="form-range me-3"
                        id="importance_level"
                        name="importance_level"
                        min="1"
                        max="5"
                        value={formData.importance_level}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      <span className={`badge bg-${importanceColors[formData.importance_level]} px-3 py-2`}>
                        {formData.importance_level}/5 - {importanceLabels[formData.importance_level]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <label htmlFor="content" className="form-label">
                    <i className="bi bi-card-text me-2"></i>
                    Content *
                  </label>
                  <textarea
                    className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                    id="content"
                    name="content"
                    rows="8"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your memory content here... You can include details, links, code snippets, etc."
                    disabled={isLoading}
                  ></textarea>
                  {errors.content && (
                    <div className="invalid-feedback">{errors.content}</div>
                  )}
                  <div className="form-text">
                    <i className="bi bi-info-circle me-1"></i>
                    Supports markdown formatting and will be searchable later
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <label htmlFor="tags" className="form-label">
                    <i className="bi bi-tags me-2"></i>
                    Tags
                  </label>
                  
                  {/* Existing Tags */}
                  {formData.tags.length > 0 && (
                    <div className="mb-3">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="badge bg-primary me-2 mb-1 px-3 py-2">
                          #{tag}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            style={{ fontSize: '0.7em' }}
                            onClick={() => removeTag(tag)}
                            disabled={isLoading}
                          ></button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tag Input */}
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagAdd}
                    placeholder="Type a tag and press Enter (e.g., work, ideas, important)"
                    disabled={isLoading}
                  />
                  <div className="form-text">
                    <i className="bi bi-lightbulb me-1"></i>
                    Quick tags: #work #personal #ideas #learning #important #urgent
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="d-flex justify-content-end gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/memories')}
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Save Memory
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
                  <i className="bi bi-lightning display-6 text-warning mb-2"></i>
                  <h6>Quick Entry</h6>
                  <small className="text-muted">Use keyboard shortcuts for faster input</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 bg-light">
                <div className="card-body text-center p-3">
                  <i className="bi bi-search display-6 text-info mb-2"></i>
                  <h6>Searchable</h6>
                  <small className="text-muted">All content becomes instantly searchable</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 bg-light">
                <div className="card-body text-center p-3">
                  <i className="bi bi-tags display-6 text-success mb-2"></i>
                  <h6>Organized</h6>
                  <small className="text-muted">Tags help you find things quickly</small>
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

export default AddMemory 