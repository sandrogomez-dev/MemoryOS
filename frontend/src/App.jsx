import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useGlobalState } from './hooks/useGlobalState'
import { authService } from './services/authService'

// Components
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LoadingSpinner from './components/LoadingSpinner'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AddMemory from './pages/AddMemory'
import MemoryVault from './pages/MemoryVault'
import Reminders from './pages/Reminders'
import AddReminder from './pages/AddReminder'

// Styles
import './styles/index.css'

function App() {
  const { store, dispatch, actions } = useGlobalState()

  // Check authentication on app load
  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: actions.SET_LOADING, payload: true })
      
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          dispatch({ type: actions.LOGIN_SUCCESS, payload: user })
        }
      } catch (error) {
        // User not authenticated, that's ok
        console.log('User not authenticated')
      } finally {
        dispatch({ type: actions.SET_LOADING, payload: false })
      }
    }

    checkAuth()
  }, [dispatch, actions])

  // Show loading spinner while checking authentication
  if (store.isLoading && !store.isAuthenticated) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <LoadingSpinner center text="Initializing MemoryOS..." />
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        
        {/* Main content with top padding for fixed navbar */}
        <main style={{ paddingTop: '76px' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={
                store.isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login />
              } 
            />
            <Route 
              path="/register" 
              element={
                store.isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Register />
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Memory Routes */}
            <Route 
              path="/memories" 
              element={
                <ProtectedRoute>
                  <MemoryVault />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/memories/new" 
              element={
                <ProtectedRoute>
                  <AddMemory />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reminders" 
              element={
                <ProtectedRoute>
                  <Reminders />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/reminders/new" 
              element={
                <ProtectedRoute>
                  <AddReminder />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <PlaceholderPage 
                    title="Profile Settings" 
                    icon="bi-person"
                    description="Manage your account and preferences"
                    comingSoon
                  />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/subscription" 
              element={
                <ProtectedRoute>
                  <PlaceholderPage 
                    title="Subscription Management" 
                    icon="bi-credit-card"
                    description="Upgrade to Premium for unlimited features"
                    comingSoon
                  />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route - 404 */}
            <Route 
              path="*" 
              element={
                <PlaceholderPage 
                  title="Page Not Found" 
                  icon="bi-exclamation-triangle"
                  description="The page you're looking for doesn't exist"
                  isError
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

// Placeholder component for pages under development
const PlaceholderPage = ({ title, icon, description, comingSoon = false, isError = false }) => {
  return (
    <div className="container-fluid py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <div className={`display-1 mb-4 ${isError ? 'text-danger' : comingSoon ? 'text-warning' : 'text-primary'}`}>
            <i className={`bi ${icon}`}></i>
          </div>
          <h2 className="mb-3">{title}</h2>
          <p className="text-muted mb-4">{description}</p>
          
          {comingSoon && (
            <div className="alert alert-info" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              This feature is coming soon! We're working hard to bring you the best experience.
            </div>
          )}
          
          {isError && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Oops! This page doesn't exist.
            </div>
          )}
          
          <div className="mt-4">
            <a href="/" className="btn btn-primary me-3">
              <i className="bi bi-house me-2"></i>
              Go Home
            </a>
            <a href="/dashboard" className="btn btn-outline-primary">
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App 