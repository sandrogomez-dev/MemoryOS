import React from 'react'

const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  center = false,
  variant = 'primary'
}) => {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  }[size]

  const content = (
    <div className="text-center">
      <div className={`spinner-border text-${variant} ${sizeClass} mb-2`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <p className="text-muted mb-0">{text}</p>}
    </div>
  )

  if (center) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        {content}
      </div>
    )
  }

  return content
}

export default LoadingSpinner 