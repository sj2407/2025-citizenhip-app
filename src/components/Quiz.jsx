import React, { useState, useEffect } from 'react'
import { X, Send, ChevronRight, Check, AlertCircle, Loader2, Brain, Sparkles } from 'lucide-react'
import { evaluateAnswer } from '../services/evaluateAnswer'

function Quiz({ questions, userState, federalOfficials, onComplete, onExit, mode }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [results, setResults] = useState([])
  const [animationClass, setAnimationClass] = useState('')

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex) / questions.length) * 100
  const correctSoFar = results.filter(r => r.isCorrect).length
  const attemptedSoFar = results.length

  // Pre-fill answers for location-based questions
  useEffect(() => {
    if (currentQuestion.dynamicAnswer && userState) {
      const answers = getAcceptableAnswers(currentQuestion)
      if (answers.length > 0) {
        setUserAnswer(answers[0])
      }
    } else {
      setUserAnswer('')
    }
  }, [currentIndex])

  // Get acceptable answers for current question (including dynamic)
  const getAcceptableAnswers = (question) => {
    let answers = [...question.acceptableAnswers]
    
    if (question.dynamicAnswer) {
      switch (question.dynamicAnswer.type) {
        case 'president':
          answers = [federalOfficials.president.name, ...federalOfficials.president.aliases]
          break
        case 'vice_president':
          answers = [federalOfficials.vicePresident.name, ...federalOfficials.vicePresident.aliases]
          break
        case 'speaker_of_house':
          answers = [federalOfficials.speakerOfHouse.name, ...federalOfficials.speakerOfHouse.aliases]
          break
        case 'chief_justice':
          answers = [federalOfficials.chiefJustice.name, ...federalOfficials.chiefJustice.aliases]
          break
        case 'state_senators':
          if (userState?.stateInfo?.senators) {
            answers = userState.stateInfo.senators
          }
          break
        case 'state_governor':
          if (userState?.stateInfo?.governor) {
            answers = [userState.stateInfo.governor]
          }
          break
        case 'state_capital':
          if (userState?.stateInfo?.capital) {
            answers = [userState.stateInfo.capital]
          }
          break
        case 'us_representative':
          // This would need district-level data; for now accept any reasonable answer
          answers = ['(Your representative\'s name)']
          break
      }
    }
    
    return answers
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userAnswer.trim() || isEvaluating) return

    setIsEvaluating(true)
    setShowMnemonic(false)

    const acceptableAnswers = getAcceptableAnswers(currentQuestion)
    
    try {
      const evaluation = await evaluateAnswer(
        currentQuestion.question,
        userAnswer,
        acceptableAnswers,
        currentQuestion.requiredAnswers
      )

      setFeedback(evaluation)

      // Trigger animation based on correctness
      if (evaluation.isCorrect) {
        setAnimationClass('animate-glow-green animate-celebrate')
      } else {
        setAnimationClass('animate-shake')
      }

      // Clear animation after it completes
      setTimeout(() => setAnimationClass(''), 2000)

      // Store result
      setResults(prev => [...prev, {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        userAnswer: userAnswer,
        isCorrect: evaluation.isCorrect,
        acceptableAnswers: acceptableAnswers
      }])

    } catch (error) {
      console.error('Evaluation error:', error)
      // Fallback to simple matching
      const isCorrect = simpleMatch(userAnswer, acceptableAnswers, currentQuestion.requiredAnswers)
      setFeedback({
        isCorrect,
        explanation: isCorrect
          ? 'Correct!'
          : `The acceptable answers include: ${acceptableAnswers.slice(0, 3).join(', ')}`
      })

      // Trigger animation based on correctness
      if (isCorrect) {
        setAnimationClass('animate-glow-green animate-celebrate')
      } else {
        setAnimationClass('animate-shake')
      }

      // Clear animation after it completes
      setTimeout(() => setAnimationClass(''), 2000)

      setResults(prev => [...prev, {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
        acceptableAnswers: acceptableAnswers
      }])
    }

    setIsEvaluating(false)
  }

  // Simple fallback matching
  const simpleMatch = (answer, acceptable, required) => {
    const normalizedAnswer = answer.toLowerCase().trim()
    
    // For multi-answer questions, check if enough answers match
    if (required > 1) {
      const answersGiven = normalizedAnswer.split(/[,;and]+/).map(a => a.trim()).filter(a => a)
      let matchCount = 0
      
      for (const given of answersGiven) {
        for (const acc of acceptable) {
          if (acc.toLowerCase().includes(given) || given.includes(acc.toLowerCase())) {
            matchCount++
            break
          }
        }
      }
      
      return matchCount >= required
    }
    
    // Single answer - check for close match
    for (const acc of acceptable) {
      const normalizedAcc = acc.toLowerCase()
      if (normalizedAcc.includes(normalizedAnswer) || normalizedAnswer.includes(normalizedAcc)) {
        return true
      }
    }
    
    return false
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setUserAnswer('')
      setFeedback(null)
      setShowMnemonic(false)
      setAnimationClass('')
    } else {
      // Quiz complete
      const correct = results.filter(r => r.isCorrect).length
      onComplete({
        correct,
        total: questions.length,
        percentage: Math.round((correct / questions.length) * 100),
        results,
        mode
      })
    }
  }

  const handleSkip = () => {
    setResults(prev => [...prev, {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      userAnswer: '(Skipped)',
      isCorrect: false,
      acceptableAnswers: getAcceptableAnswers(currentQuestion)
    }])
    handleNext()
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="text-2xl font-bold text-white mb-1">
              Question {currentIndex + 1} of {questions.length}
            </div>
            {attemptedSoFar > 0 && (
              <div className="text-sm text-slate-400">
                Current Score: <span className="text-green-400 font-semibold">{correctSoFar}/{attemptedSoFar} correct</span>
                {attemptedSoFar > 0 && (
                  <span className="ml-2">
                    ({Math.round((correctSoFar / attemptedSoFar) * 100)}%)
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onExit}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar mb-2">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-slate-500 text-right mb-8">
          {Math.round(progress)}% Complete
        </div>

        {/* Question Card */}
        <div className={`glass-card p-6 md:p-8 mb-6 animate-fade-in ${animationClass}`} key={currentQuestion.id}>
          {/* Category & Star */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-2 py-1 rounded-full bg-primary-600/20 text-primary-300">
              {currentQuestion.category}
            </span>
            {currentQuestion.starred && (
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-600/20 text-yellow-300">
                ★ 65/20
              </span>
            )}
          </div>

          {/* Question */}
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">
            {currentQuestion.question}
          </h2>

          {/* Required answers hint */}
          {currentQuestion.requiredAnswers > 1 && (
            <p className="text-sm text-slate-400 mb-4">
              Name {currentQuestion.requiredAnswers} answers (separate with commas)
            </p>
          )}

          {/* Answer Form */}
          {!feedback ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="input-field min-h-[100px] resize-none"
                autoFocus
                disabled={isEvaluating}
              />
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!userAnswer.trim() || isEvaluating}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Answer
                    </>
                  )}
                </button>

                {currentQuestion.mnemonic && (
                  <button
                    type="button"
                    onClick={() => setShowMnemonic(!showMnemonic)}
                    className={`btn-secondary px-4 ${showMnemonic ? 'bg-purple-600/30 border-purple-500/50' : ''}`}
                    title="Hint"
                  >
                    <Brain className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* Feedback */
            <div className={`p-4 rounded-lg border ${feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
              <div className="flex items-start gap-3">
                {feedback.isCorrect ? (
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className={`font-semibold ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {feedback.isCorrect ? 'Correct!' : 'Not quite right'}
                  </p>
                  <p className="text-slate-300 text-sm mt-1">
                    {feedback.explanation}
                  </p>

                  {!feedback.isCorrect && (
                    <div className="mt-3 pt-3 border-t border-slate-600/50">
                      <p className="text-xs text-slate-400 mb-1">Acceptable answers include:</p>
                      <p className="text-sm text-slate-300">
                        {getAcceptableAnswers(currentQuestion).slice(0, 5).join(' • ')}
                      </p>
                    </div>
                  )}

                  {/* Fun Fact */}
                  {currentQuestion.funFact && (
                    <div className="mt-3 pt-3 border-t border-slate-600/50">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-blue-400 mb-1">Fun Fact</p>
                          <p className="text-sm text-slate-300">{currentQuestion.funFact}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Hint */}
          {showMnemonic && !feedback && currentQuestion.mnemonic && (
            <div className="mt-4 p-4 rounded-lg bg-purple-600/10 border border-purple-600/30 animate-fade-in">
              <div className="flex items-start gap-2">
                <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-purple-300 mb-1">Hint</p>
                  <p className="text-sm text-purple-100">{currentQuestion.mnemonic}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white text-sm transition-colors"
            disabled={!!feedback}
          >
            Skip question
          </button>
          
          {feedback && (
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Quiz
