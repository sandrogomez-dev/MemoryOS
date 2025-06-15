import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'
import { authService } from '../services/authService'

const Navbar = () => {
  const { store, dispatch, actions } = useGlobalState()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await authService.logout()
      dispatch({ type: actions.LOGOUT })
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold text-gradient" to="/">
          <i className="bi bi-brain me-2"></i>
          MemoryOS
        </Link>

        {/* Mobile toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left side navigation */}
          <ul className="navbar-nav me-auto">
            {store.isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/dashboard') ? 'active fw-bold' : ''}`} 
                    to="/dashboard"
                  >
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/memories') ? 'active fw-bold' : ''}`} 
                    to="/memories"
                  >
                    <i className="bi bi-collection me-1"></i>
                    Memory Vault
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/reminders') ? 'active fw-bold' : ''}`} 
                    to="/reminders"
                  >
                    <i className="bi bi-alarm me-1"></i>
                    Reminders
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Right side navigation */}
          <ul className="navbar-nav">
            {store.isAuthenticated ? (
              <>
                {/* Subscription badge */}
                <li className="nav-item">
                  <span className={`nav-link badge ${store.subscription === 'premium' ? 'bg-warning' : 'bg-secondary'} text-dark`}>
                    <i className={`bi ${store.subscription === 'premium' ? 'bi-star-fill' : 'bi-star'} me-1`}></i>
                    {store.subscription === 'premium' ? 'Premium' : 'Free'}
                  </span>
                </li>

                {/* User menu dropdown */}
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle d-flex align-items-center" 
                    href="#" 
                    id="navbarDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    <span className="d-none d-md-inline">
                      {store.user?.name || store.user?.email?.split('@')[0] || 'User'}
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/subscription">
                        <i className="bi bi-credit-card me-2"></i>
                        Subscription
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${isActive('/login') ? 'active fw-bold' : ''}`} 
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="btn btn-primary ms-2" 
                    to="/register"
                  >
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Loading bar */}
      {store.isLoading && (
        <div className="position-absolute top-100 start-0 end-0">
          <div className="progress" style={{ height: '2px' }}>
            <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary w-100"></div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 