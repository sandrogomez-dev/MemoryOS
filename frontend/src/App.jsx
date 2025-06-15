import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useGlobalState } from './hooks/useGlobalState'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MemoryVault from './pages/MemoryVault'
import Reminders from './pages/Reminders'
import Profile from './pages/Profile'
import Subscription from './pages/Subscription'

function App() {
  const { store } = useGlobalState()

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/memories" element={
            <ProtectedRoute>
              <MemoryVault />
            </ProtectedRoute>
          } />
          <Route path="/reminders" element={
            <ProtectedRoute>
              <Reminders />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/subscription" element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={
            <div className="container mt-5 text-center">
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App 