import React, { useState } from 'react'
import { MapPin, ArrowRight, X } from 'lucide-react'

function ZipCodePrompt({ onSubmit, onSkip }) {
  const [zipCode, setZipCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!zipCode || zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code')
      return
    }
    
    setError('')
    onSubmit(zipCode)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-600/20 mb-4">
            <MapPin className="w-7 h-7 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Where do you live?</h2>
          <p className="text-slate-400 text-sm">
            Enter your ZIP code to personalize questions about your state's governor, senators, and capital.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 5)
                setZipCode(value)
                setError('')
              }}
              placeholder="Enter ZIP code (e.g., 10001)"
              className="input-field text-center text-xl tracking-widest"
              maxLength={5}
              autoFocus
            />
            {error && (
              <p className="text-accent-400 text-sm mt-2 text-center">{error}</p>
            )}
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <button
          onClick={onSkip}
          className="w-full mt-4 py-2 text-slate-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-1"
        >
          <X className="w-4 h-4" />
          Skip for now
        </button>

        <p className="text-xs text-slate-500 text-center mt-6">
          Your ZIP code is stored locally and never sent to any server.
        </p>
      </div>
    </div>
  )
}

export default ZipCodePrompt
