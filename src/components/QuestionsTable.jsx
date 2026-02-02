import React, { useState } from 'react'
import { X, Search, BookOpen, Lightbulb, Brain, Sparkles, Star } from 'lucide-react'
import { questions } from '../data/questions'

function QuestionsTable({ onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  // Get unique categories
  const categories = ['all', ...new Set(questions.map(q => q.category))]

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.acceptableAnswers.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || q.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Questions Reference Table
            </h1>
            <p className="text-slate-400">
              All {questions.length} questions with answers, hints, and mnemonics
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions or answers..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-field md:w-64"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-slate-400 mt-3">
            Showing {filteredQuestions.length} of {questions.length} questions
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white w-12">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Question</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Answers</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Fun Fact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Mnemonic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredQuestions.map((question) => (
                  <tr key={question.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* ID */}
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">{question.id}</span>
                        {question.starred && (
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        )}
                      </div>
                    </td>

                    {/* Question */}
                    <td className="px-4 py-4">
                      <div className="text-sm text-white">
                        {question.question}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded bg-primary-600/20 text-primary-300">
                          {question.category}
                        </span>
                        {question.requiredAnswers > 1 && (
                          <span className="text-xs px-2 py-0.5 rounded bg-blue-600/20 text-blue-300">
                            {question.requiredAnswers} answers needed
                          </span>
                        )}
                        {question.dynamicAnswer && (
                          <span className="text-xs px-2 py-0.5 rounded bg-purple-600/20 text-purple-300">
                            Dynamic ({question.dynamicAnswer.type})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Answers */}
                    <td className="px-4 py-4">
                      <div className="text-sm text-slate-300">
                        {question.acceptableAnswers.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {question.acceptableAnswers.slice(0, 3).map((answer, idx) => (
                              <li key={idx} className="text-xs">
                                {answer}
                              </li>
                            ))}
                            {question.acceptableAnswers.length > 3 && (
                              <li className="text-xs text-slate-500">
                                +{question.acceptableAnswers.length - 3} more...
                              </li>
                            )}
                          </ul>
                        ) : (
                          <span className="text-xs text-slate-500 italic">
                            Dynamic answer based on location
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Fun Fact */}
                    <td className="px-4 py-4">
                      {question.funFact ? (
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-300">
                            {question.funFact}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 italic">No fun fact</span>
                      )}
                    </td>

                    {/* Mnemonic */}
                    <td className="px-4 py-4">
                      {question.mnemonic ? (
                        <div className="flex items-start gap-2">
                          <Brain className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-300">
                            {question.mnemonic}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 italic">No mnemonic</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionsTable
