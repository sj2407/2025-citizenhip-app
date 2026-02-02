// Answer Evaluation Service
// Uses Claude API to intelligently evaluate user answers

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

/**
 * Evaluates a user's answer against acceptable answers using AI
 * Falls back to simple matching if API is unavailable
 */
export async function evaluateAnswer(question, userAnswer, acceptableAnswers, requiredCount = 1) {
  // First, try simple matching for exact/close matches
  const simpleResult = simpleMatch(userAnswer, acceptableAnswers, requiredCount);
  
  // If it's clearly correct with simple matching, return immediately
  if (simpleResult.isCorrect) {
    return {
      isCorrect: true,
      explanation: getPositiveFeedback()
    };
  }

  // If no API key, use simple matching only
  if (!ANTHROPIC_API_KEY) {
    return {
      isCorrect: simpleResult.isCorrect,
      explanation: simpleResult.isCorrect
        ? 'Correct!'
        : `Incorrect. Acceptable answers include: ${acceptableAnswers.slice(0, 3).join(', ')}`
    };
  }

  // Use Claude API for more nuanced evaluation (with 10 second timeout)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: buildPrompt(question, userAnswer, acceptableAnswers, requiredCount)
        }]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;
    
    return parseAIResponse(aiResponse, acceptableAnswers);
    
  } catch (error) {
    console.error('AI evaluation failed, using fallback:', error);
    return {
      isCorrect: simpleResult.isCorrect,
      explanation: simpleResult.isCorrect
        ? 'Correct!'
        : `Incorrect. Acceptable answers include: ${acceptableAnswers.slice(0, 3).join(', ')}`
    };
  }
}

/**
 * Build the prompt for Claude to evaluate the answer
 */
function buildPrompt(question, userAnswer, acceptableAnswers, requiredCount) {
  return `You are evaluating an answer for a US Citizenship civics test.

Question: "${question}"
User's Answer: "${userAnswer}"
${requiredCount > 1 ? `Required number of answers: ${requiredCount}` : ''}

Official acceptable answers:
${acceptableAnswers.map(a => `- ${a}`).join('\n')}

Evaluate if the user's answer is correct. Be lenient with:
- Minor spelling errors
- Slight paraphrasing that conveys the same meaning
- Common abbreviations or nicknames
- Extra words that don't change meaning

Be strict about:
- Factually incorrect information
- Missing required answers (if multiple required)
- Completely wrong concepts

Respond ONLY with:
CORRECT: yes/no

Do not provide any explanation.`;
}

/**
 * Parse the AI response
 */
function parseAIResponse(response, acceptableAnswers) {
  const isCorrect = response.toLowerCase().includes('correct: yes');

  const explanation = isCorrect
    ? 'Correct!'
    : `Incorrect. Acceptable answers include: ${acceptableAnswers.slice(0, 3).join(', ')}`;

  return { isCorrect, explanation };
}

/**
 * Simple string matching for quick evaluation
 */
function simpleMatch(userAnswer, acceptableAnswers, requiredCount) {
  const normalized = userAnswer.toLowerCase().trim();

  if (requiredCount > 1) {
    // Split user's answer into parts
    const parts = normalized.split(/[,;]|\band\b/).map(p => p.trim()).filter(p => p);
    let matchCount = 0;
    const matched = new Set();

    for (const part of parts) {
      for (const acceptable of acceptableAnswers) {
        const normAcceptable = acceptable.toLowerCase();
        if (!matched.has(acceptable) && (
          normAcceptable.includes(part) ||
          part.includes(normAcceptable) ||
          levenshteinSimilar(part, normAcceptable)
        )) {
          matchCount++;
          matched.add(acceptable);
          break;
        }
      }
    }

    return { isCorrect: matchCount >= requiredCount, matchCount };
  }

  // Single answer
  for (const acceptable of acceptableAnswers) {
    const normAcceptable = acceptable.toLowerCase();
    if (
      normAcceptable === normalized ||
      normAcceptable.includes(normalized) ||
      normalized.includes(normAcceptable) ||
      levenshteinSimilar(normalized, normAcceptable)
    ) {
      return { isCorrect: true };
    }
  }

  return { isCorrect: false };
}

/**
 * Check if two strings are similar using Levenshtein distance
 */
function levenshteinSimilar(a, b, threshold = 0.8) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 5) return false;
  
  const distance = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  const similarity = 1 - (distance / maxLen);
  
  return similarity >= threshold;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Get a simple positive feedback message
 */
function getPositiveFeedback() {
  return 'Correct!';
}

export default evaluateAnswer;
