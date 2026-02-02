import React from 'react'
import { Trophy, Home, RotateCcw, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

function Results({ results, onRetry, onHome, mode }) {
  const [showDetails, setShowDetails] = useState(false)
  
  const { correct, total, percentage } = results
  const passed = percentage >= 60

  // Get grade message
  const getGradeMessage = () => {
    if (percentage >= 90) return { text: 'Excellent!', color: 'text-green-400' }
    if (percentage >= 80) return { text: 'Great job!', color: 'text-green-400' }
    if (percentage >= 70) return { text: 'Good work!', color: 'text-blue-400' }
    if (percentage >= 60) return { text: 'You passed!', color: 'text-blue-400' }
    return { text: 'Keep practicing!', color: 'text-yellow-400' }
  }

  const grade = getGradeMessage()

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Results Card */}
        <div className="glass-card p-8 text-center mb-6 animate-fade-in">
          {/* Trophy */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
            passed ? 'bg-green-600/20' : 'bg-yellow-600/20'
          }`}>
            <Trophy className={`w-10 h-10 ${passed ? 'text-green-400' : 'text-yellow-400'}`} />
          </div>

          {/* Score */}
          <h1 className="text-5xl font-bold text-white mb-2">
            {correct}/{total}
          </h1>
          
          <p className={`text-2xl font-semibold ${grade.color} mb-4`}>
            {grade.text}
          </p>

          {/* Percentage */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`text-lg px-4 py-2 rounded-full ${
              passed 
                ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
            }`}>
              {percentage}% Accuracy
            </div>
          </div>

          {/* Pass/Fail Message */}
          <p className="text-slate-400 mb-6">
            {passed ? (
              <>You need 60% (12/20) to pass the real test. You're doing great!</>
            ) : (
              <>You need 60% (12/20) to pass. Don't worry, keep practicing!</>
            )}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-4 bg-slate-700 rounded-full overflow-hidden mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                passed ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span className="text-slate-400">60% to pass</span>
            <span>100%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={onRetry}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={onHome}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>

        {/* Question Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full glass-card p-4 flex items-center justify-between hover:border-primary-500/30 transition-colors"
        >
          <span className="text-white font-medium">Review Your Answers</span>
          {showDetails ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {/* Question Details */}
        {showDetails && (
          <div className="mt-4 space-y-3 animate-fade-in">
            {results.results.map((result, index) => (
              <div 
                key={index}
                className={`glass-card p-4 border-l-4 ${
                  result.isCorrect ? 'border-l-green-500' : 'border-l-red-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-1 rounded-full ${
                    result.isCorrect ? 'bg-green-600/20' : 'bg-red-600/20'
                  }`}>
                    {result.isCorrect ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <X className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium mb-1">
                      {result.question}
                    </p>
                    <p className="text-sm text-slate-400">
                      Your answer: <span className={result.isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {result.userAnswer}
                      </span>
                    </p>
                    {!result.isCorrect && (
                      <p className="text-xs text-slate-500 mt-1">
                        Correct: {result.acceptableAnswers.slice(0, 2).join(' or ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        {!passed && (
          <div className="mt-6 glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Tips to Improve</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-primary-400">•</span>
                Focus on the starred (★) questions first - they're the most important
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400">•</span>
                Use the hints to help remember tricky answers
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400">•</span>
                Practice a little bit every day rather than cramming
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-400">•</span>
                Review your wrong answers and learn the correct ones
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Results
