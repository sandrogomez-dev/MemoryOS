import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'

const Reminders = () => {
  const { store } = useGlobalState()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [reminders, setReminders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '')
  const [selectedFrequency, setSelectedFrequency] = useState(searchParams.get('frequency') || '')
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    per_page: 12
  })

  const statusOptions = [
    { value: '', label: 'All Statuses', emoji: '📋', color: 'secondary' },
    { value: 'active', label: 'Active', emoji: '🔔', color: 'success' },
    { value: 'completed', label: 'Completed', emoji: '✅', color: 'primary' },
    { value: 'overdue', label: 'Overdue', emoji: '⚠️', color: 'danger' },
    { value: 'paused', label: 'Paused', emoji: '⏸️', color: 'warning' }
  ]

  const frequencyOptions = [
    { value: '', label: 'Any Frequency', emoji: '🔄' },
    { value: 'once', label: 'One-time', emoji: '1️⃣' },
    { value: 'daily', label: 'Daily', emoji: '📅' },
    { value: 'weekly', label: 'Weekly', emoji: '📆' },
    { value: 'monthly', label: 'Monthly', emoji: '🗓️' },
    { value: 'yearly', label: 'Yearly', emoji: '📊' }
  ]

  // Mock data for now - replace with real API calls later
  const mockReminders = [
    {
      id: 1,
      title: 'Review quarterly goals',
      description: 'Check progress on Q4 objectives and plan for next quarter',
      trigger_date: '2024-01-20T14:00:00Z',
      frequency: 'monthly',
      status: 'active',
      memory_id: 1,
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      title: 'Call dentist for checkup',
      description: 'Schedule routine dental cleaning appointment',
      trigger_date: '2024-01-18T09:00:00Z',
      frequency: 'once',
      status: 'overdue',
      memory_id: null,
      created_at: '2024-01-10T15:30:00Z'
    },
    {
      id: 3,
      title: 'Water plants',
      description: 'Water all indoor plants and check soil moisture',
      trigger_date: '2024-01-17T08:00:00Z',
      frequency: 'weekly',
      status: 'completed',
      memory_id: null,
      created_at: '2024-01-05T12:00:00Z'
    }
  ]

  const fetchReminders = async (page = 1) => {
    setIsLoading(true)
    
    try {
      // TODO: Replace with real API call
      // const response = await fetch(`/api/reminders/?${params}`, {
      //   credentials: 'include'
      // })
      
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
      
      let filteredReminders = mockReminders
      
      if (searchTerm) {
        filteredReminders = filteredReminders.filter(reminder =>
          reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reminder.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (selectedStatus) {
        filteredReminders = filteredReminders.filter(reminder => reminder.status === selectedStatus)
      }
      
      if (selectedFrequency) {
        filteredReminders = filteredReminders.filter(reminder => reminder.frequency === selectedFrequency)
      }
      
      setReminders(filteredReminders)
      setPagination({
        page: 1,
        pages: 1,
        total: filteredReminders.length,
        per_page: 12
      })
    } catch (error) {
      console.error('Error fetching reminders:', error)
      setReminders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReminders()
  }, [searchTerm, selectedStatus, selectedFrequency])

  useEffect(() => {
    // Update URL parameters
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedStatus) params.set('status', selectedStatus)
    if (selectedFrequency) params.set('frequency', selectedFrequency)
    
    setSearchParams(params)
  }, [searchTerm, selectedStatus, selectedFrequency, setSearchParams])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedStatus('')
    setSelectedFrequency('')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const isOverdue = date < now
    
    return {
      formatted: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isOverdue
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'success',
      completed: 'primary',
      overdue: 'danger',
      paused: 'warning'
    }
    return colors[status] || 'secondary'
  }

  const getStatusEmoji = (status) => {
    const emojis = {
      active: '🔔',
      completed: '✅',
      overdue: '⚠️',
      paused: '⏸️'
    }
    return emojis[status] || '📋'
  }

  const getFrequencyEmoji = (frequency) => {
    const emojis = {
      once: '1️⃣',
      daily: '📅',
      weekly: '📆',
      monthly: '🗓️',
      yearly: '📊'
    }
    return emojis[frequency] || '🔄'
  }

  const activeFiltersCount = [searchTerm, selectedStatus, selectedFrequency].filter(Boolean).length

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div className="position-absolute w-100 h-100" style={{
        backgroundImage: `radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%),
                         radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%),
                         radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
        zIndex: 1
      }}></div>

      <div className="container-fluid py-5 position-relative" style={{ zIndex: 2 }}>
        {/* Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center text-white mb-4">
              <h1 className="display-4 fw-bold mb-3">
                <i className="bi bi-alarm me-3"></i>
                Smart Reminders
              </h1>
              <p className="lead opacity-90">
                {pagination.total > 0 ? (
                  `${pagination.total} reminders to keep you on track`
                ) : (
                  'Never forget important things again'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="card border-0 glass-card">
              <div className="card-body p-4">
                <div className="row g-3">
                  {/* Search */}
                  <div className="col-md-6">
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control form-control-lg ps-5 border-0"
                        placeholder="Search reminders..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{
                          background: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-lg border-0"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.emoji} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Frequency Filter */}
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-lg border-0"
                      value={selectedFrequency}
                      onChange={(e) => setSelectedFrequency(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {frequencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.emoji} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                    <span className="text-muted">
                      <i className="bi bi-funnel me-1"></i>
                      {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={clearFilters}
                    >
                      <i className="bi bi-x me-1"></i>
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Add Reminder Button */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <Link 
              to="/reminders/new" 
              className="btn btn-light btn-lg px-5 py-3 shadow-lg"
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                borderRadius: '50px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'
              }}
            >
              <i className="bi bi-alarm me-2"></i>
              Set New Reminder
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-white" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white mt-3">Loading your reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-alarm display-1 text-white opacity-50"></i>
            </div>
            {activeFiltersCount > 0 ? (
              <>
                <h4 className="text-white mb-3">No reminders match your filters</h4>
                <p className="text-white opacity-75 mb-4">Try adjusting your search criteria or clearing filters</p>
                <button className="btn btn-outline-light me-3" onClick={clearFilters}>
                  <i className="bi bi-x me-2"></i>
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h4 className="text-white mb-3">No reminders set yet</h4>
                <p className="text-white opacity-75 mb-4">Start setting smart reminders to never forget important things</p>
              </>
            )}
            <Link to="/reminders/new" className="btn btn-light btn-lg">
              <i className="bi bi-alarm me-2"></i>
              Set Your First Reminder
            </Link>
          </div>
        ) : (
          /* Reminders Grid */
          <>
            <div className="row g-4">
              {reminders.map(reminder => {
                const dateInfo = formatDate(reminder.trigger_date)
                return (
                  <div key={reminder.id} className="col-lg-4 col-md-6">
                    <div 
                      className="card h-100 border-0 text-white position-relative overflow-hidden"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)'
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div className="card-body p-4">
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <span className="me-2" style={{ fontSize: '1.5em' }}>
                              {getStatusEmoji(reminder.status)}
                            </span>
                            <span className={`badge bg-${getStatusColor(reminder.status)} px-2 py-1`}>
                              {reminder.status}
                            </span>
                          </div>
                          <div className="text-end">
                            <span className="me-2" style={{ fontSize: '1.2em' }}>
                              {getFrequencyEmoji(reminder.frequency)}
                            </span>
                            <small className="text-white opacity-75">
                              {reminder.frequency}
                            </small>
                          </div>
                        </div>

                        {/* Title */}
                        <h5 className="card-title mb-3 text-white fw-bold">
                          {reminder.title}
                        </h5>

                        {/* Description */}
                        <p className="card-text text-white opacity-90 mb-3">
                          {reminder.description}
                        </p>

                        {/* Trigger Date */}
                        <div className="mb-3">
                          <div className={`d-flex align-items-center ${dateInfo.isOverdue ? 'text-danger' : 'text-white'}`}>
                            <i className={`bi ${dateInfo.isOverdue ? 'bi-exclamation-triangle' : 'bi-clock'} me-2`}></i>
                            <span className="small">
                              {dateInfo.formatted}
                              {dateInfo.isOverdue && ' (Overdue)'}
                            </span>
                          </div>
                        </div>

                        {/* Memory Link */}
                        {reminder.memory_id && (
                          <div className="mb-3">
                            <Link 
                              to={`/memories/${reminder.memory_id}`}
                              className="btn btn-outline-light btn-sm"
                            >
                              <i className="bi bi-link me-1"></i>
                              Linked Memory
                            </Link>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="btn-group" role="group">
                            <button className="btn btn-light btn-sm">
                              <i className="bi bi-check"></i>
                            </button>
                            <button className="btn btn-outline-light btn-sm">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-outline-danger btn-sm">
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                          <button className="btn btn-outline-light btn-sm">
                            <i className="bi bi-bell me-1"></i>
                            Snooze
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Reminders 