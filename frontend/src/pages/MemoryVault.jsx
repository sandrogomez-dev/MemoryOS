import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'
import LoadingSpinner from '../components/LoadingSpinner'

const MemoryVault = () => {
  const { store } = useGlobalState()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [memories, setMemories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [selectedImportance, setSelectedImportance] = useState(searchParams.get('importance') || '')
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    per_page: 12
  })

  const memoryTypes = [
    { value: '', label: 'All Types', icon: 'bi-collection', emoji: '🗂️' },
    { value: 'note', label: 'Notes', icon: 'bi-file-text', emoji: '📝' },
    { value: 'idea', label: 'Ideas', icon: 'bi-lightbulb', emoji: '💡' },
    { value: 'task', label: 'Tasks', icon: 'bi-check-square', emoji: '✅' },
    { value: 'learning', label: 'Learning', icon: 'bi-book', emoji: '🧠' },
    { value: 'reference', label: 'Reference', icon: 'bi-bookmark', emoji: '📚' },
    { value: 'quote', label: 'Quotes', icon: 'bi-quote', emoji: '💬' }
  ]

  const importanceOptions = [
    { value: '', label: 'Any Importance', color: 'secondary' },
    { value: '5', label: '⭐⭐⭐⭐⭐ Critical', color: 'danger' },
    { value: '4', label: '⭐⭐⭐⭐ High', color: 'warning' },
    { value: '3', label: '⭐⭐⭐ Medium', color: 'primary' },
    { value: '2', label: '⭐⭐ Normal', color: 'info' },
    { value: '1', label: '⭐ Low', color: 'secondary' }
  ]

  const fetchMemories = async (page = 1) => {
    setIsLoading(true)
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: pagination.per_page.toString()
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedType) params.append('type', selectedType)
      if (selectedImportance) params.append('importance', selectedImportance)

      const response = await fetch(`/api/memories/?${params}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setMemories(data.memories || [])
        setPagination(data.pagination || pagination)
      } else {
        console.error('Failed to fetch memories')
        setMemories([])
      }
    } catch (error) {
      console.error('Error fetching memories:', error)
      setMemories([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMemories()
  }, [searchTerm, selectedType, selectedImportance])

  useEffect(() => {
    // Update URL parameters
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedType) params.set('type', selectedType)
    if (selectedImportance) params.set('importance', selectedImportance)
    
    setSearchParams(params)
  }, [searchTerm, selectedType, selectedImportance, setSearchParams])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('')
    setSelectedImportance('')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getImportanceColor = (importance) => {
    const colors = {
      1: 'secondary',
      2: 'info',
      3: 'primary', 
      4: 'warning',
      5: 'danger'
    }
    return colors[importance] || 'secondary'
  }

  const getTypeIcon = (type) => {
    const typeMap = {
      note: 'bi-file-text',
      idea: 'bi-lightbulb',
      task: 'bi-check-square',
      learning: 'bi-book',
      reference: 'bi-bookmark',
      quote: 'bi-quote'
    }
    return typeMap[type] || 'bi-file-text'
  }

  const getTypeEmoji = (type) => {
    const emojiMap = {
      note: '📝',
      idea: '💡',
      task: '✅',
      learning: '🧠',
      reference: '📚',
      quote: '💬'
    }
    return emojiMap[type] || '📝'
  }

  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const handlePageChange = (newPage) => {
    fetchMemories(newPage)
  }

  const activeFiltersCount = [searchTerm, selectedType, selectedImportance].filter(Boolean).length

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <div className="position-absolute w-100 h-100" style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                         radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)`,
        zIndex: 1
      }}></div>

      <div className="container-fluid py-5 position-relative" style={{ zIndex: 2 }}>
        {/* Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center text-white mb-4">
              <h1 className="display-4 fw-bold mb-3">
                <i className="bi bi-collection me-3"></i>
                Memory Vault
              </h1>
              <p className="lead opacity-90">
                {pagination.total > 0 ? (
                  `${pagination.total} memories stored and searchable`
                ) : (
                  'Your personal knowledge repository'
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
                        placeholder="Search memories, tags, content..."
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

                  {/* Type Filter */}
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-lg border-0"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {memoryTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.emoji} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Importance Filter */}
                  <div className="col-md-3">
                    <select
                      className="form-select form-select-lg border-0"
                      value={selectedImportance}
                      onChange={(e) => setSelectedImportance(e.target.value)}
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {importanceOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
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

        {/* Add Memory Button */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <Link 
              to="/memories/new" 
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
              <i className="bi bi-plus-circle me-2"></i>
              Add New Memory
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-white" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-white mt-3">Loading your memories...</p>
          </div>
        ) : memories.length === 0 ? (
          /* Empty State */
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-collection display-1 text-white opacity-50"></i>
            </div>
            {activeFiltersCount > 0 ? (
              <>
                <h4 className="text-white mb-3">No memories match your filters</h4>
                <p className="text-white opacity-75 mb-4">Try adjusting your search criteria or clearing filters</p>
                <button className="btn btn-outline-light me-3" onClick={clearFilters}>
                  <i className="bi bi-x me-2"></i>
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <h4 className="text-white mb-3">Your memory vault is empty</h4>
                <p className="text-white opacity-75 mb-4">Start capturing your thoughts, ideas, and important information</p>
              </>
            )}
            <Link to="/memories/new" className="btn btn-light btn-lg">
              <i className="bi bi-plus-circle me-2"></i>
              Add Your First Memory
            </Link>
          </div>
        ) : (
          /* Memory Grid */
          <>
            <div className="row g-4">
              {memories.map(memory => (
                <div key={memory.id} className="col-lg-4 col-md-6">
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
                            {getTypeEmoji(memory.memory_type)}
                          </span>
                          <span className={`badge bg-${getImportanceColor(memory.importance_level)} px-2 py-1`}>
                            {memory.importance_level}/5
                          </span>
                        </div>
                        <small className="text-white opacity-75">
                          {formatDate(memory.created_at)}
                        </small>
                      </div>

                      {/* Title */}
                      <h5 className="card-title mb-3 line-clamp-2 text-white fw-bold">
                        {memory.title}
                      </h5>

                      {/* Content Preview */}
                      <p className="card-text text-white opacity-90 mb-3 line-clamp-3">
                        {truncateContent(memory.content)}
                      </p>

                      {/* Tags */}
                      {memory.tags && memory.tags.length > 0 && (
                        <div className="mb-3">
                          {memory.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="badge bg-light text-dark me-1 mb-1 small">
                              #{tag}
                            </span>
                          ))}
                          {memory.tags.length > 3 && (
                            <span className="badge bg-light text-muted small">
                              +{memory.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="d-flex justify-content-between align-items-center">
                        <Link
                          to={`/memories/${memory.id}`}
                          className="btn btn-light btn-sm"
                        >
                          <i className="bi bi-eye me-1"></i>
                          View
                        </Link>
                        <div className="btn-group" role="group">
                          <Link
                            to={`/memories/${memory.id}/edit`}
                            className="btn btn-outline-light btn-sm"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button className="btn btn-outline-danger btn-sm">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <nav className="mt-5">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-transparent border-light text-white"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>
                  </li>
                  
                  {[...Array(pagination.pages)].map((_, index) => {
                    const pageNum = index + 1
                    return (
                      <li key={pageNum} className={`page-item ${pagination.page === pageNum ? 'active' : ''}`}>
                        <button
                          className={`page-link ${pagination.page === pageNum ? 'bg-white text-primary' : 'bg-transparent border-light text-white'}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    )
                  })}
                  
                  <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-transparent border-light text-white"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MemoryVault 