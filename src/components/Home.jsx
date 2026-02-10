import React, { useState } from 'react'
import { BookOpen, Star, Clock, MapPin, Trophy, ChevronRight, BarChart3, Table, User, LogOut, Settings } from 'lucide-react'

function Home({ onStartQuiz, stats, userState, userName, onChangeLocation, onViewDashboard, onViewQuestionsTable, onSignOut }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  return (
    <div className="min-h-screen p-3 md:p-4">
      <div className="max-w-5xl mx-auto">
        {/* Compact Header with User Menu */}
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <div className="flex-1 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              US Citizenship Test Prep
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              Master the 100 civics questions with smart learning. Using spaced repetition, mnemonics & pop culture references
            </p>
          </div>

          {userName && (
            <div className="relative ml-3">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 transition-all text-xs"
              >
                <User className="w-3 h-3" />
                <Settings className="w-3 h-3" />
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
                    {stats.totalAttempted > 0 && onViewDashboard && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          onViewDashboard()
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                      >
                        <BarChart3 className="w-4 h-4" />
                        View Dashboard
                      </button>
                    )}
                    {onViewQuestionsTable && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          onViewQuestionsTable()
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                      >
                        <Table className="w-4 h-4" />
                        Questions Reference
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to sign out? Your quiz history will be preserved.')) {
                          onSignOut()
                        }
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700/50 transition-colors flex items-center gap-2 border-t border-slate-700/50 mt-2 pt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Two Column Layout - Side by Side */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {/* LEFT: Quiz Options Section */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">Choose Session Length</h2>
            <div className="space-y-2">
              {/* Quick Practice */}
              <button
                onClick={() => onStartQuiz('practice10')}
                className="w-full glass-card p-3 text-left hover:border-primary-500/50 transition-all group"
              >
                <h3 className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">
                  Quick Practice
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">10 questions • ~5 minutes</p>
              </button>

              {/* Standard Practice - Selected/Highlighted */}
              <button
                onClick={() => onStartQuiz('practice20')}
                className="w-full glass-card p-3 text-left bg-primary-600/10 border-primary-500/50 hover:border-primary-500/70 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">
                      Standard Session
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">20 questions • ~10 minutes</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-600/30 text-primary-300 font-medium">
                    Selected
                  </span>
                </div>
              </button>

              {/* 65/20 Mode */}
              <button
                onClick={() => onStartQuiz('65/20')}
                className="w-full glass-card p-3 text-left hover:border-yellow-500/50 transition-all group"
              >
                <h3 className="text-sm font-semibold text-white group-hover:text-yellow-300 transition-colors">
                  65/20 Special
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">10 questions • For 65+ applicants</p>
              </button>

              {/* Full Test */}
              <button
                onClick={() => onStartQuiz('full128')}
                className="w-full glass-card p-3 text-left hover:border-accent-500/50 transition-all group"
              >
                <h3 className="text-sm font-semibold text-white group-hover:text-accent-300 transition-colors">
                  Full Test
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">All 100 questions • ~30 minutes</p>
              </button>

              {/* Start Button */}
              <button
                onClick={() => onStartQuiz('practice20')}
                className="w-full btn-primary mt-3 py-3 flex items-center justify-center gap-2 text-base font-semibold"
              >
                Start Practice Session
              </button>
            </div>
          </div>

          {/* RIGHT: Progress Section - Same Level as Quiz Options */}
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3">Your Progress</h2>

            {/* Stats Card */}
            {stats.totalAttempted > 0 ? (
              <div className="space-y-2">
                <div className="glass-card p-3 animate-fade-in">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-white">{stats.totalAttempted}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Questions Practiced</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-green-400">{stats.percentage}%</div>
                      <div className="text-xs text-slate-400 mt-0.5">Success Rate</div>
                    </div>
                  </div>
                </div>

                {/* Focus Area Badge */}
                <div className="glass-card bg-yellow-600/15 border-yellow-500/40 p-3 animate-fade-in">
                  <div className="text-sm font-semibold text-yellow-400 mb-1">FOCUS AREA</div>
                  <div className="text-sm text-white">2 questions need more practice. They'll appear more frequently in your sessions.</div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-5 text-center animate-fade-in">
                <p className="text-slate-300 mb-2">Start practicing to track your progress</p>
                <p className="text-xs text-slate-400">• Questions you struggle with appear more often<br />• Spaced repetition helps you learn efficiently<br />• Track your improvement over time</p>
              </div>
            )}

            {/* Location Card */}
            {userState && userState.stateInfo && (
              <div className="glass-card p-3 animate-fade-in mt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-white font-medium">{userState.stateInfo.name}</div>
                      <div className="text-xs text-slate-400">Location-specific questions</div>
                    </div>
                  </div>
                  <button
                    onClick={onChangeLocation}
                    className="text-sm text-primary-400 hover:text-primary-300 flex-shrink-0"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="text-center mt-3">
          <p className="text-xs text-slate-300">Based on the official USCIS 2025 Civics Test (M-1778) • You need 12/20 correct (60%) to pass</p>
        </div>
      </div>
    </div>
  )
}

export default Home
