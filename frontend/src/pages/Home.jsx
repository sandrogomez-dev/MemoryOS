import React from 'react'
import { Link } from 'react-router-dom'
import { useGlobalState } from '../hooks/useGlobalState'

const Home = () => {
  const { store } = useGlobalState()

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="py-5" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '70vh'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-white">
              <h1 className="display-4 fw-bold mb-4 fade-in">
                Your Digital <span className="text-warning">Brain Extension</span>
              </h1>
              <p className="lead mb-4 fade-in">
                MemoryOS helps you manage personal memory, smart reminders, and critical knowledge storage with AI assistance. Never forget what matters most.
              </p>
              <div className="d-flex gap-3 fade-in">
                {store.isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-warning btn-lg px-4">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-warning btn-lg px-4">
                      <i className="bi bi-rocket-takeoff me-2"></i>
                      Get Started Free
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              <div className="mt-4 text-light">
                <small>
                  <i className="bi bi-check-circle me-2"></i>
                  Free plan includes 100 memories
                  <span className="mx-3">•</span>
                  <i className="bi bi-check-circle me-2"></i>
                  No credit card required
                </small>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="glass-card p-5 text-dark">
                <i className="bi bi-brain display-1 text-primary mb-3 d-block"></i>
                <h4 className="mb-3">Memory Vault Preview</h4>
                <div className="row g-2">
                  <div className="col-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-2">
                        <small className="text-muted">📝 Notes</small>
                        <div className="fw-bold">24</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-2">
                        <small className="text-muted">⏰ Reminders</small>
                        <div className="fw-bold">8</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-2">
                        <small className="text-muted">🎯 Important</small>
                        <div className="fw-bold">5</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body p-2">
                        <small className="text-muted">🧠 Learning</small>
                        <div className="fw-bold">12</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose MemoryOS?</h2>
            <p className="text-muted">Powerful features to enhance your memory and productivity</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="bi bi-collection display-4 text-primary mb-3"></i>
                  <h5>Memory Vault</h5>
                  <p className="text-muted">Store and organize your thoughts, processes, and important information with smart categorization.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="bi bi-alarm display-4 text-success mb-3"></i>
                  <h5>Smart Reminders</h5>
                  <p className="text-muted">Intelligent reminders with spaced repetition for optimal learning and memory retention.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="bi bi-search display-4 text-info mb-3"></i>
                  <h5>Semantic Search</h5>
                  <p className="text-muted">Find your memories instantly with AI-powered semantic search across all your content.</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="bi bi-robot display-4 text-warning mb-3"></i>
                  <h5>AI Assistant</h5>
                  <p className="text-muted">Get intelligent insights, summaries, and suggestions to maximize your cognitive potential.</p>
                  <span className="badge bg-warning text-dark">Premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Simple, Transparent Pricing</h2>
            <p className="text-muted">Start free, upgrade when you need more power</p>
          </div>
          
          <div className="row justify-content-center">
            <div className="col-lg-5 mb-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="text-center">
                    <h4>Free</h4>
                    <div className="display-4 fw-bold text-primary">$0</div>
                    <p className="text-muted">Perfect to get started</p>
                  </div>
                  <ul className="list-unstyled">
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Up to 100 memories</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Basic reminders</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Search functionality</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Web access</li>
                  </ul>
                  <Link to="/register" className="btn btn-outline-primary w-100">Get Started</Link>
                </div>
              </div>
            </div>
            
            <div className="col-lg-5 mb-4">
              <div className="card border-warning shadow">
                <div className="card-header bg-warning text-center">
                  <strong>Most Popular</strong>
                </div>
                <div className="card-body p-4">
                  <div className="text-center">
                    <h4>Premium</h4>
                    <div className="display-4 fw-bold text-primary">$5</div>
                    <p className="text-muted">per month</p>
                  </div>
                  <ul className="list-unstyled">
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Unlimited memories</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>AI-powered features</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Multimedia storage</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Encryption & privacy</li>
                    <li className="mb-2"><i className="bi bi-check text-success me-2"></i>Voice notes & OCR</li>
                  </ul>
                  <Link to="/register" className="btn btn-warning w-100">Start Premium Trial</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="text-warning">MemoryOS</h5>
              <p className="text-muted">Your digital brain extension for enhanced memory and productivity.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="mb-2">
                <a href="#" className="text-light me-3">Privacy Policy</a>
                <a href="#" className="text-light me-3">Terms of Service</a>
                <a href="#" className="text-light">Support</a>
              </div>
              <p className="text-muted mb-0">&copy; 2024 MemoryOS. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home 