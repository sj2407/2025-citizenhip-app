import React, { useState } from 'react'
import { User, ChevronRight, MapPin } from 'lucide-react'

function UserNamePrompt({ onSubmit, onSkip, allowSkip = true }) {
  const [name, setName] = useState('')
  const [zipCode, setZipCode] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim() && zipCode.trim() && zipCode.length === 5) {
      onSubmit(name.trim(), zipCode.trim())
    }
  }

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5)
    setZipCode(value)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full animate-fade-in">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-600/20 mx-auto mb-6">
          <User className="w-8 h-8 text-primary-400" />
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Welcome to Your Citizenship Test Prep!
        </h1>

        <p className="text-slate-400 text-center mb-6">
          Let's personalize your experience with your name and location.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="input-field pl-10"
                autoFocus
                maxLength={50}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">ZIP Code</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={zipCode}
                onChange={handleZipChange}
                placeholder="Enter your ZIP code"
                className="input-field pl-10"
                maxLength={5}
                pattern="\d{5}"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              We'll use this to look up your representatives for personalized questions
            </p>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || zipCode.length !== 5}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Get Started
            <ChevronRight className="w-5 h-5" />
          </button>

          {allowSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="w-full text-sm text-slate-400 hover:text-white transition-colors"
            >
              Skip for now
            </button>
          )}
        </form>

        <p className="text-xs text-slate-500 text-center mt-6">
          Your name is stored locally on your device only.
        </p>
      </div>
    </div>
  )
}

export default UserNamePrompt
