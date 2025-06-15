import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'

const ProtectedRoute = ({ children }) => {
  const { store } = useGlobalState()
  const location = useLocation()

  // Show loading while checking authentication
  if (store.isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to login with return URL
  if (!store.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If authenticated, render the protected component
  return children
}

export default ProtectedRoute 