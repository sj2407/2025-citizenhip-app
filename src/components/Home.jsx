import React, { useState } from 'react'
import { BookOpen, Star, Clock, MapPin, Trophy, ChevronRight, BarChart3, Table, User, LogOut, Settings } from 'lucide-react'

function Home({ onStartQuiz, stats, userState, userName, onChangeLocation, onViewDashboard, onViewQuestionsTable, onSignOut }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* User Menu - Top Right */}
        {userName && (
          <div className="flex justify-end gap-3 mb-4 animate-fade-in">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to sign out? Your quiz history will be preserved.')) {
                  onSignOut()
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 transition-all"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">{userName}</span>
                <Settings className="w-4 h-4" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 glass-card border border-slate-700 shadow-lg z-10">
                  <div className="py-2">
                    {userState && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          onChangeLocation()
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Change Location
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600/20 mb-4">
            <BookOpen className="w-8 h-8 text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="text-white">Citizenship</span>
            <span className="text-primary-400">AI</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            {userName ? `Welcome back, ${userName}! ` : ''}Master the 2025 USCIS Civics Test with AI-powered practice
          </p>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {stats.totalAttempted > 0 && onViewDashboard && (
              <button
                onClick={onViewDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600/20 border border-primary-500/30 text-primary-300 hover:bg-primary-600/30 transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                View Dashboard
              </button>
            )}

            {onViewQuestionsTable && (
              <button
                onClick={onViewQuestionsTable}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-600/20 border border-slate-500/30 text-slate-300 hover:bg-slate-600/30 transition-all"
              >
                <Table className="w-4 h-4" />
                Questions Reference
              </button>
            )}
          </div>
        </header>

        {/* Stats Card */}
        {stats.totalAttempted > 0 && (
          <div className="glass-card p-6 mb-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg font-semibold text-white">Your Progress</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalCorrect}</div>
                <div className="text-sm text-slate-400">Correct</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalAttempted}</div>
                <div className="text-sm text-slate-400">Attempted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{stats.percentage}%</div>
                <div className="text-sm text-slate-400">Accuracy</div>
              </div>
            </div>
          </div>
        )}

        {/* Location Card - Don't show answers, just state name */}
        {userState && userState.stateInfo && (
          <div className="glass-card p-4 mb-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <div>
                  <div className="text-white font-medium">{userState.stateInfo.name}</div>
                  <div className="text-sm text-slate-400">
                    Your location-specific questions will be personalized
                  </div>
                </div>
              </div>
              <button
                onClick={onChangeLocation}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* Quiz Options */}
        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Choose Your Practice Mode</h2>
          
          {/* Quick Practice */}
          <button
            onClick={() => onStartQuiz('practice10')}
            className="w-full glass-card p-5 text-left hover:border-primary-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary-600/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors">
                    Quick Practice
                  </h3>
                  <p className="text-sm text-slate-400">10 random questions • ~5 minutes</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-primary-400 transition-colors" />
            </div>
          </button>

          {/* Standard Practice */}
          <button
            onClick={() => onStartQuiz('practice20')}
            className="w-full glass-card p-5 text-left hover:border-primary-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">
                    Standard Practice
                  </h3>
                  <p className="text-sm text-slate-400">20 questions (like the real test) • ~10 minutes</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-green-400 transition-colors" />
            </div>
          </button>

          {/* 65/20 Mode */}
          <button
            onClick={() => onStartQuiz('65/20')}
            className="w-full glass-card p-5 text-left hover:border-yellow-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-yellow-300 transition-colors">
                    65/20 Special Consideration
                  </h3>
                  <p className="text-sm text-slate-400">10 questions from the 20 starred • For 65+ applicants</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-yellow-400 transition-colors" />
            </div>
          </button>

          {/* Full Test */}
          <button
            onClick={() => onStartQuiz('full128')}
            className="w-full glass-card p-5 text-left hover:border-accent-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-600/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-accent-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-accent-300 transition-colors">
                    Full Study Mode
                  </h3>
                  <p className="text-sm text-slate-400">All 128 questions • Complete review</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-accent-400 transition-colors" />
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-slate-500">
          <p>Based on the official USCIS 2025 Civics Test (M-1778)</p>
          <p className="mt-1">You need 12/20 correct (60%) to pass</p>
        </div>
      </div>
    </div>
  )
}

export default Home
