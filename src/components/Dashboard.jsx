import React from 'react'
import { X, TrendingUp, Award, Calendar, Target, Flame, BarChart3, AlertCircle, Home } from 'lucide-react'

function Dashboard({ scores, userName, onClose, onReviewWrongAnswers }) {
  // Calculate streak
  const calculateStreak = () => {
    if (scores.length === 0) return 0

    const sortedScores = [...scores].sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    )

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < sortedScores.length; i++) {
      const scoreDate = new Date(sortedScores[i].timestamp)
      scoreDate.setHours(0, 0, 0, 0)

      const daysDiff = Math.floor((today - scoreDate) / (1000 * 60 * 60 * 24))

      if (daysDiff === streak) {
        streak++
      } else if (daysDiff > streak) {
        break
      }
    }

    return streak
  }

  // Get recent scores (last 10)
  const recentScores = [...scores]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10)

  // Calculate overall stats
  const totalQuizzes = scores.length
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length)
    : 0
  const bestScore = scores.length > 0
    ? Math.max(...scores.map(s => s.percentage))
    : 0

  // Find questions user struggles with
  const wrongAnswers = {}
  scores.forEach(score => {
    if (score.results) {
      score.results.forEach(result => {
        if (!result.isCorrect) {
          const key = result.questionId
          if (!wrongAnswers[key]) {
            wrongAnswers[key] = {
              question: result.question,
              count: 0,
              acceptableAnswers: result.acceptableAnswers
            }
          }
          wrongAnswers[key].count++
        }
      })
    }
  })

  const strugglingQuestions = Object.values(wrongAnswers)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const streak = calculateStreak()

  // Format date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-400'
    if (percentage >= 80) return 'text-blue-400'
    if (percentage >= 70) return 'text-yellow-400'
    if (percentage >= 60) return 'text-orange-400'
    return 'text-red-400'
  }

  const getModeLabel = (mode) => {
    const labels = {
      'practice10': 'Quick (10)',
      'practice20': 'Standard (20)',
      'full128': 'Full Study (128)',
      '65/20': '65/20 Mode'
    }
    return labels[mode] || mode
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {userName ? `${userName}'s Dashboard` : 'Your Dashboard'}
            </h1>
            <p className="text-slate-400">Track your progress and improvement</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <p className="text-sm text-slate-400">Total Quizzes</p>
            </div>
            <p className="text-3xl font-bold text-white">{totalQuizzes}</p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <p className="text-sm text-slate-400">Avg Score</p>
            </div>
            <p className="text-3xl font-bold text-white">{avgScore}%</p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <p className="text-sm text-slate-400">Best Score</p>
            </div>
            <p className="text-3xl font-bold text-white">{bestScore}%</p>
          </div>

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <p className="text-sm text-slate-400">Day Streak</p>
            </div>
            <p className="text-3xl font-bold text-white">{streak}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Scores */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary-400" />
              <h2 className="text-xl font-semibold text-white">Recent Scores</h2>
            </div>

            {recentScores.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No quiz attempts yet. Start practicing!
              </p>
            ) : (
              <div className="space-y-3">
                {recentScores.map((score, idx) => (
                  <div
                    key={score.id}
                    className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-2xl font-bold ${getGradeColor(score.percentage)}`}>
                        {score.percentage}%
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatDate(score.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {score.correct}/{score.total} correct
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-primary-600/20 text-primary-300">
                        {getModeLabel(score.mode)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Struggling Questions */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-semibold text-white">Questions You Struggle With</h2>
            </div>

            {strugglingQuestions.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                Great job! No wrong answers yet.
              </p>
            ) : (
              <div className="space-y-3">
                {strugglingQuestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-red-600/10 border border-red-600/30"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm text-white font-medium line-clamp-2">
                        {item.question}
                      </p>
                      <span className="text-xs px-2 py-1 rounded bg-red-600/30 text-red-300 flex-shrink-0">
                        {item.count}x wrong
                      </span>
                    </div>
                    {item.acceptableAnswers && item.acceptableAnswers.length > 0 && (
                      <p className="text-xs text-slate-400 mt-2">
                        Answer: {item.acceptableAnswers.slice(0, 2).join(', ')}
                      </p>
                    )}
                  </div>
                ))}

                {strugglingQuestions.length > 0 && onReviewWrongAnswers && (
                  <button
                    onClick={onReviewWrongAnswers}
                    className="btn-secondary w-full mt-4"
                  >
                    Practice These Questions
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress Chart (Simple Text-based) */}
        {scores.length > 1 && (
          <div className="glass-card p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Progress Over Time</h2>
            </div>

            <div className="space-y-2">
              {[...scores].slice(-10).reverse().map((score, idx) => {
                const width = Math.max(score.percentage, 5) // Minimum 5% width for visibility
                return (
                  <div key={score.id} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-20">
                      {formatDate(score.timestamp)}
                    </span>
                    <div className="flex-1 h-8 bg-slate-800 rounded-lg overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-500 ${
                          score.percentage >= 60 ? 'bg-green-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${width}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                        {score.percentage}%
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 w-16">
                      {score.correct}/{score.total}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
