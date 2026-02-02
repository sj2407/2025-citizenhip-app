# CitizenshipAI - US Civics Test Prep

An AI-powered study app for the 2025 USCIS Civics Test (128 questions).

![Screenshot](screenshot.png)

## Features

- ✅ **All 128 Official Questions** - Based on USCIS M-1778 (09/25)
- 🤖 **AI-Powered Answer Evaluation** - Understands paraphrasing, not just exact matches
- 📍 **Location-Based Personalization** - Enter your ZIP code for state-specific questions (governor, senators, capital)
- ⭐ **65/20 Mode** - Special practice for applicants 65+ with 20+ years of residency
- 📊 **Progress Tracking** - Track your scores over time
- 💡 **Hints & Fun Facts** - Memory aids to help you learn
- 📱 **Mobile-Friendly** - Works great on any device

## Quiz Modes

1. **Quick Practice** - 10 random questions (~5 min)
2. **Standard Practice** - 20 questions, like the real test (~10 min)
3. **65/20 Mode** - 10 questions from the 20 starred questions
4. **Full Study** - All 128 questions

## Setup

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/citizenship-test-app.git
cd citizenship-test-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Optional: Enable AI Evaluation

For intelligent answer evaluation (handles paraphrasing, typos, etc.):

1. Get an API key from [Anthropic Console](https://console.anthropic.com/)
2. Create a `.env` file:
   ```
   VITE_ANTHROPIC_API_KEY=your_api_key_here
   ```

The app works without an API key using simple string matching.

## Build for Production

```bash
npm run build
```

Output is in the `dist/` folder, ready to deploy.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add `VITE_ANTHROPIC_API_KEY` as an environment variable
4. Deploy!

### Netlify

1. Push to GitHub
2. Connect repo to [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable in Site Settings

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Claude API** - AI answer evaluation (optional)
- **localStorage** - Score persistence

## Data Sources

- Questions: [USCIS 128 Civics Questions (2025)](https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test/128-civics-questions-and-answers-2025-version)
- Federal officials updated: February 2026
- State data: All 50 states + DC

## License

MIT License - feel free to use for your own citizenship prep!

## Contributing

PRs welcome! Please update state data if officials change.

---

Good luck on your citizenship test! 🇺🇸
