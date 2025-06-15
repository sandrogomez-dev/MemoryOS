import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'
import LoadingSpinner from '../components/LoadingSpinner'

const Dashboard = () => {
  const { store } = useGlobalState()
  const [stats, setStats] = useState({
    memories: 0,
    reminders: 0,
    importantMemories: 0,
    upcomingReminders: 0
  })
  const [recentMemories, setRecentMemories] = useState([])
  const [upcomingReminders, setUpcomingReminders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API calls for dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data - in real app, this would come from API
      setStats({
        memories: 24,
        reminders: 8,
        importantMemories: 5,
        upcomingReminders: 3
      })
      
      setRecentMemories([
        {
          id: 1,
          title: 'Meeting Notes - Q4 Planning',
          content: 'Discussed budget allocation and team expansion plans...',
          tags: ['work', 'meeting'],
          importance: 4,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          title: 'Recipe: Grandma\'s Chocolate Cake',
          content: 'The secret ingredient is adding coffee to enhance...',
          tags: ['cooking', 'family'],
          importance: 3,
          created_at: '2024-01-14T16:45:00Z'
        },
        {
          id: 3,
          title: 'Book Recommendation: Atomic Habits',
          content: 'Key insights about building good habits and breaking bad ones...',
          tags: ['books', 'self-improvement'],
          importance: 5,
          created_at: '2024-01-13T20:15:00Z'
        }
      ])
      
      setUpcomingReminders([
        {
          id: 1,
          title: 'Call dentist for appointment',
          trigger_date: '2024-01-16T09:00:00Z',
          repeat_pattern: 'none'
        },
        {
          id: 2,
          title: 'Review quarterly goals',
          trigger_date: '2024-01-18T14:00:00Z',
          repeat_pattern: 'monthly'
        },
        {
          id: 3,
          title: 'Water plants',
          trigger_date: '2024-01-19T08:00:00Z',
          repeat_pattern: 'weekly'
        }
      ])
      
      setIsLoading(false)
    }

    loadDashboardData()
  }, [])

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

  const getMemoryUsage = () => {
    const maxMemories = store.user?.subscription_type === 'premium' ? 'unlimited' : 100
    if (maxMemories === 'unlimited') return { percentage: 0, text: 'Unlimited' }
    
    const percentage = (stats.memories / maxMemories) * 100
    return { percentage, text: `${stats.memories} / ${maxMemories}` }
  }

  const memoryUsage = getMemoryUsage()

  if (isLoading) {
    return <LoadingSpinner center text="Loading your dashboard..." />
  }

  return (
    <div className="container-fluid py-4">
      {/* Welcome Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">
                Welcome back, {store.user?.name?.split(' ')[0] || 'there'}! 👋
              </h2>
              <p className="text-muted mb-0">
                Here's what's happening in your memory vault today
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/memories/new" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Add Memory
              </Link>
              <Link to="/reminders/new" className="btn btn-outline-primary">
                <i className="bi bi-alarm me-2"></i>
                Set Reminder
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-collection display-4 text-primary"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="h3 mb-1">{stats.memories}</div>
                  <div className="small text-muted">Total Memories</div>
                  <div className="small">
                    <span className={`badge bg-${store.user?.subscription_type === 'premium' ? 'success' : 'secondary'}`}>
                      {memoryUsage.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-alarm display-4 text-success"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="h3 mb-1">{stats.reminders}</div>
                  <div className="small text-muted">Active Reminders</div>
                  <div className="small">
                    <span className="badge bg-warning text-dark">
                      {stats.upcomingReminders} upcoming
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className="bi bi-star-fill display-4 text-warning"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="h3 mb-1">{stats.importantMemories}</div>
                  <div className="small text-muted">Important Memories</div>
                  <div className="small">
                    <span className="badge bg-danger">High Priority</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <i className={`bi bi-${store.user?.subscription_type === 'premium' ? 'star-fill' : 'star'} display-4 text-${store.user?.subscription_type === 'premium' ? 'warning' : 'secondary'}`}></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <div className="h5 mb-1 text-capitalize">{store.user?.subscription_type || 'Free'}</div>
                  <div className="small text-muted">Subscription</div>
                  {store.user?.subscription_type !== 'premium' && (
                    <Link to="/subscription" className="small text-decoration-none">
                      Upgrade to Premium
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Memories */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Recent Memories
                </h5>
                <Link to="/memories" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {recentMemories.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentMemories.map(memory => (
                    <div key={memory.id} className="list-group-item border-0 px-0 py-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{memory.title}</h6>
                          <p className="mb-2 text-muted small">
                            {memory.content.length > 100 
                              ? `${memory.content.substring(0, 100)}...` 
                              : memory.content
                            }
                          </p>
                          <div className="d-flex align-items-center gap-2">
                            {memory.tags.map(tag => (
                              <span key={tag} className="badge bg-light text-dark small">
                                #{tag}
                              </span>
                            ))}
                            <span className={`badge bg-${getImportanceColor(memory.importance)}`}>
                              {memory.importance}/5
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">
                            {formatDate(memory.created_at)}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-collection display-4 text-muted mb-3"></i>
                  <h6 className="text-muted">No memories yet</h6>
                  <p className="text-muted mb-3">Start building your memory vault</p>
                  <Link to="/memories/new" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Create First Memory
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-bell me-2"></i>
                  Upcoming
                </h5>
                <Link to="/reminders" className="btn btn-sm btn-outline-primary">
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {upcomingReminders.length > 0 ? (
                <div className="list-group list-group-flush">
                  {upcomingReminders.map(reminder => (
                    <div key={reminder.id} className="list-group-item border-0 px-0 py-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0 me-3">
                          <i className="bi bi-alarm text-primary"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 small">{reminder.title}</h6>
                          <div className="small text-muted">
                            {formatDate(reminder.trigger_date)}
                          </div>
                          {reminder.repeat_pattern !== 'none' && (
                            <span className="badge bg-info small">
                              {reminder.repeat_pattern}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-alarm display-4 text-muted mb-3"></i>
                  <h6 className="text-muted">No upcoming reminders</h6>
                  <Link to="/reminders/new" className="btn btn-sm btn-primary">
                    <i className="bi bi-plus-circle me-1"></i>
                    Set Reminder
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <Link to="/memories/new" className="btn btn-outline-primary w-100 p-3">
                    <i className="bi bi-plus-circle d-block display-6 mb-2"></i>
                    <div>Add Memory</div>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/reminders/new" className="btn btn-outline-success w-100 p-3">
                    <i className="bi bi-alarm d-block display-6 mb-2"></i>
                    <div>Set Reminder</div>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/memories?filter=important" className="btn btn-outline-warning w-100 p-3">
                    <i className="bi bi-star d-block display-6 mb-2"></i>
                    <div>Important</div>
                  </Link>
                </div>
                <div className="col-md-3">
                  <Link to="/search" className="btn btn-outline-info w-100 p-3">
                    <i className="bi bi-search d-block display-6 mb-2"></i>
                    <div>Search</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 