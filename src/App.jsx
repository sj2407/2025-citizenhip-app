import React, { useState, useEffect } from 'react'
import { questions } from './data/questions'
import { federalOfficials } from './data/federalOfficials'
import { stateData, getStateFromZip } from './data/stateData'
import { fetchRepresentatives } from './services/civicInfoService'
import Quiz from './components/Quiz'
import Home from './components/Home'
import Results from './components/Results'
import ZipCodePrompt from './components/ZipCodePrompt'
import UserNamePrompt from './components/UserNamePrompt'
import Dashboard from './components/Dashboard'
import QuestionsTable from './components/QuestionsTable'

function App() {
  const [screen, setScreen] = useState('home') // home, zip, quiz, results, dashboard, userName
  const [userName, setUserName] = useState(null)
  const [userState, setUserState] = useState(null)
  const [quizMode, setQuizMode] = useState(null) // 'practice10', 'practice20', 'full128', '65/20'
  const [quizResults, setQuizResults] = useState(null)
  const [scores, setScores] = useState([])
  const [showUserNamePrompt, setShowUserNamePrompt] = useState(false)
  const [isSignedOut, setIsSignedOut] = useState(false)

  // Load saved state, userName, and scores from localStorage
  useEffect(() => {
    const savedUserName = localStorage.getItem('userName')
    const savedState = localStorage.getItem('userState')
    const savedScores = localStorage.getItem('quizScores')

    if (savedUserName) {
      setUserName(savedUserName)
    } else {
      // Show name prompt on first visit
      setShowUserNamePrompt(true)
      setScreen('userName')
    }

    if (savedState) {
      setUserState(JSON.parse(savedState))
    }
    if (savedScores) {
      setScores(JSON.parse(savedScores))
    }
  }, [])

  // Handle sign out
  const handleSignOut = () => {
    setUserName(null)
    setUserState(null)
    localStorage.removeItem('userName')
    localStorage.removeItem('userState')
    setIsSignedOut(true)
    setScreen('userName')
  }

  // Handle user name and ZIP code submission
  const handleUserNameSubmit = async (name, zipCode) => {
    setUserName(name)
    localStorage.setItem('userName', name)
    setIsSignedOut(false)

    // Handle ZIP code and state lookup
    const stateCode = getStateFromZip(zipCode)
    let stateInfo = stateCode ? { ...stateData[stateCode] } : null

    // Try to fetch live representative data from API
    try {
      const liveData = await fetchRepresentatives(zipCode)

      if (liveData && stateInfo) {
        // Merge live data with static data
        if (liveData.senators && liveData.senators.length > 0) {
          stateInfo.senators = liveData.senators
        }
        if (liveData.governor) {
          stateInfo.governor = liveData.governor
        }
        if (liveData.representative) {
          stateInfo.representative = liveData.representative
        }
      }
    } catch (error) {
      console.error('Failed to fetch live representative data:', error)
      // Continue with static data
    }

    const userData = {
      zipCode,
      stateCode,
      stateInfo
    }

    setUserState(userData)
    localStorage.setItem('userState', JSON.stringify(userData))
    setScreen('home')
  }

  // Save scores to localStorage
  const saveScore = (result) => {
    const newScores = [...scores, {
      ...result,
      timestamp: new Date().toISOString(),
      id: Date.now()
    }]
    setScores(newScores)
    localStorage.setItem('quizScores', JSON.stringify(newScores))
  }

  // Handle zip code submission
  const handleZipSubmit = async (zipCode) => {
    const stateCode = getStateFromZip(zipCode)
    let stateInfo = stateCode ? { ...stateData[stateCode] } : null

    // Try to fetch live representative data from API
    try {
      const liveData = await fetchRepresentatives(zipCode)

      if (liveData && stateInfo) {
        // Merge live data with static data
        if (liveData.senators && liveData.senators.length > 0) {
          stateInfo.senators = liveData.senators
        }
        if (liveData.governor) {
          stateInfo.governor = liveData.governor
        }
        if (liveData.representative) {
          stateInfo.representative = liveData.representative
        }
      }
    } catch (error) {
      console.error('Failed to fetch live representative data:', error)
      // Continue with static data
    }

    const userData = {
      zipCode,
      stateCode,
      stateInfo
    }

    setUserState(userData)
    localStorage.setItem('userState', JSON.stringify(userData))
    setScreen('home')
  }

  // Start quiz with selected mode
  const startQuiz = (mode) => {
    // Check if we need zip code for state-specific questions
    if (!userState && (mode === 'full128' || mode === 'practice20')) {
      setQuizMode(mode)
      setScreen('zip')
      return
    }
    
    setQuizMode(mode)
    setScreen('quiz')
  }

  // Handle quiz completion
  const handleQuizComplete = (results) => {
    setQuizResults(results)
    saveScore(results)
    setScreen('results')
  }

  // Get questions for current quiz mode
  const getQuizQuestions = () => {
    let selectedQuestions = [...questions]
    
    // Filter for 65/20 mode (only starred questions)
    if (quizMode === '65/20') {
      selectedQuestions = questions.filter(q => q.starred)
    }
    
    // Shuffle and select appropriate number
    const shuffled = selectedQuestions.sort(() => Math.random() - 0.5)
    
    switch (quizMode) {
      case 'practice10':
        return shuffled.slice(0, 10)
      case 'practice20':
        return shuffled.slice(0, 20)
      case '65/20':
        return shuffled.slice(0, 10) // 10 questions from the 20 starred
      case 'full128':
      default:
        return shuffled
    }
  }

  // Calculate overall stats
  const getOverallStats = () => {
    if (scores.length === 0) return { totalCorrect: 0, totalAttempted: 0, percentage: 0 }
    
    const totalCorrect = scores.reduce((sum, s) => sum + s.correct, 0)
    const totalAttempted = scores.reduce((sum, s) => sum + s.total, 0)
    const percentage = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0
    
    return { totalCorrect, totalAttempted, percentage }
  }

  return (
    <div className="min-h-screen">
      {screen === 'userName' && (
        <UserNamePrompt
          onSubmit={handleUserNameSubmit}
          onSkip={() => setScreen('home')}
          allowSkip={!isSignedOut}
        />
      )}

      {screen === 'home' && (
        <Home
          onStartQuiz={startQuiz}
          stats={getOverallStats()}
          userState={userState}
          userName={userName}
          onChangeLocation={() => setScreen('zip')}
          onViewDashboard={() => setScreen('dashboard')}
          onViewQuestionsTable={() => setScreen('questionsTable')}
          onSignOut={handleSignOut}
        />
      )}

      {screen === 'dashboard' && (
        <Dashboard
          scores={scores}
          userName={userName}
          onClose={() => setScreen('home')}
          onReviewWrongAnswers={() => {
            // TODO: Implement review wrong answers mode
            setScreen('home')
          }}
        />
      )}

      {screen === 'questionsTable' && (
        <QuestionsTable
          onClose={() => setScreen('home')}
        />
      )}

      {screen === 'zip' && (
        <ZipCodePrompt
          onSubmit={handleZipSubmit}
          onSkip={() => {
            if (quizMode) {
              setScreen('quiz')
            } else {
              setScreen('home')
            }
          }}
        />
      )}

      {screen === 'quiz' && (
        <Quiz
          questions={getQuizQuestions()}
          userState={userState}
          federalOfficials={federalOfficials}
          onComplete={handleQuizComplete}
          onExit={() => setScreen('home')}
          mode={quizMode}
        />
      )}

      {screen === 'results' && (
        <Results
          results={quizResults}
          onRetry={() => setScreen('quiz')}
          onHome={() => setScreen('home')}
          mode={quizMode}
        />
      )}
    </div>
  )
}

export default App
