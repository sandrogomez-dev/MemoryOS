import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'

const Dashboard = () => {
  const { store } = useGlobalState()
  const [stats, setStats] = useState({
    totalMemories: 0,
    totalReminders: 0,
    completedToday: 0,
    streakDays: 0
  })
  const [recentMemories, setRecentMemories] = useState([])
  const [upcomingReminders, setUpcomingReminders] = useState([])

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch memories for stats
      const memoriesResponse = await fetch('/api/memories/?per_page=5', {
        credentials: 'include'
      })
      
      if (memoriesResponse.ok) {
        const memoriesData = await memoriesResponse.json()
        setRecentMemories(memoriesData.memories || [])
        setStats(prev => ({
          ...prev,
          totalMemories: memoriesData.pagination?.total || 0
        }))
      }

      // TODO: Fetch reminders data when implemented
      setStats(prev => ({
        ...prev,
        totalReminders: 0,
        completedToday: 0,
        streakDays: Math.floor(Math.random() * 30) + 1 // Placeholder
      }))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const quickActions = [
    {
      title: 'Add Memory',
      description: 'Capture a new thought or idea',
      icon: 'bi-plus-circle',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      link: '/memories/new',
      color: 'primary'
    },
    {
      title: 'Memory Vault',
      description: 'Browse your knowledge base',
      icon: 'bi-collection',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      link: '/memories',
      color: 'info'
    },
    {
      title: 'Set Reminder',
      description: 'Never forget important things',
      icon: 'bi-alarm',
      gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      link: '/reminders/new',
      color: 'warning'
    },
    {
      title: 'AI Assistant',
      description: 'Get smart suggestions',
      icon: 'bi-robot',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      link: '#',
      color: 'danger'
    }
  ]

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
        {/* Welcome Header */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="text-center text-white mb-4">
              <h1 className="display-4 fw-bold mb-3">
                Welcome back, {store.user?.name || 'User'}! 👋
              </h1>
              <p className="lead opacity-90">
                Your personal memory management dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-5">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 h-100 glass-card text-white">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-collection display-4 text-info"></i>
                </div>
                <h3 className="fw-bold mb-2">{stats.totalMemories}</h3>
                <p className="mb-0 opacity-90">Total Memories</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 h-100 glass-card text-white">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-alarm display-4 text-warning"></i>
                </div>
                <h3 className="fw-bold mb-2">{stats.totalReminders}</h3>
                <p className="mb-0 opacity-90">Active Reminders</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 h-100 glass-card text-white">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-check-circle display-4 text-success"></i>
                </div>
                <h3 className="fw-bold mb-2">{stats.completedToday}</h3>
                <p className="mb-0 opacity-90">Completed Today</p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 h-100 glass-card text-white">
              <div className="card-body text-center p-4">
                <div className="mb-3">
                  <i className="bi bi-fire display-4 text-danger"></i>
                </div>
                <h3 className="fw-bold mb-2">{stats.streakDays}</h3>
                <p className="mb-0 opacity-90">Day Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="text-white fw-bold mb-4 text-center">
              <i className="bi bi-lightning me-2"></i>
              Quick Actions
            </h2>
          </div>
        </div>

        <div className="row g-4 mb-5">
          {quickActions.map((action, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <Link 
                to={action.link} 
                className="text-decoration-none"
                style={{ 
                  display: 'block',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div 
                  className="card border-0 h-100 text-white position-relative overflow-hidden"
                  style={{
                    background: action.gradient,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                >
                  <div className="card-body text-center p-4 position-relative">
                    <div className="mb-3">
                      <i className={`bi ${action.icon} display-4`}></i>
                    </div>
                    <h5 className="fw-bold mb-2">{action.title}</h5>
                    <p className="mb-0 opacity-90 small">{action.description}</p>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div 
                    className="position-absolute w-100 h-100 top-0 start-0"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  ></div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="row">
          {/* Recent Memories */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 glass-card text-white h-100">
              <div className="card-header border-0 bg-transparent">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Recent Memories
                </h5>
              </div>
              <div className="card-body">
                {recentMemories.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {recentMemories.map((memory, index) => (
                      <div key={memory.id} className="list-group-item bg-transparent border-0 px-0 py-3">
                        <div className="d-flex align-items-start">
                          <span className="me-3" style={{ fontSize: '1.2em' }}>
                            {getTypeEmoji(memory.memory_type)}
                          </span>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 text-white">{memory.title}</h6>
                            <p className="mb-1 opacity-75 small">
                              {memory.content.substring(0, 80)}...
                            </p>
                            <small className="opacity-50">
                              {formatDate(memory.created_at)}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 opacity-75">
                    <i className="bi bi-collection display-4 mb-3"></i>
                    <p className="mb-0">No memories yet</p>
                    <Link to="/memories/new" className="btn btn-outline-light btn-sm mt-2">
                      Create your first memory
                    </Link>
                  </div>
                )}
              </div>
              {recentMemories.length > 0 && (
                <div className="card-footer border-0 bg-transparent text-center">
                  <Link to="/memories" className="btn btn-outline-light btn-sm">
                    View All Memories
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Reminders */}
          <div className="col-lg-6 mb-4">
            <div className="card border-0 glass-card text-white h-100">
              <div className="card-header border-0 bg-transparent">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-bell me-2"></i>
                  Upcoming Reminders
                </h5>
              </div>
              <div className="card-body">
                <div className="text-center py-4 opacity-75">
                  <i className="bi bi-alarm display-4 mb-3"></i>
                  <p className="mb-0">No reminders set</p>
                  <Link to="/reminders/new" className="btn btn-outline-light btn-sm mt-2">
                    Set your first reminder
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 glass-card text-white text-center">
              <div className="card-body py-4">
                <blockquote className="blockquote mb-0">
                  <p className="lead mb-3">
                    "The palest ink is better than the best memory."
                  </p>
                  <footer className="blockquote-footer text-white-50">
                    Chinese Proverb
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 