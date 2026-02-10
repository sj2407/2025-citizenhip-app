# Project Instructions for Claude

## Git Workflow

**CRITICAL**: Never commit or push changes to git until the user has tested locally and given explicit approval.

### Workflow Steps:
1. Make code changes as requested
2. Allow user to test changes in their local development environment
3. Wait for user's explicit approval (e.g., "looks good", "please commit", "save to github")
4. Only then proceed with git add, commit, and push

### What NOT to do:
- ❌ Do not automatically commit after making changes
- ❌ Do not assume changes are ready for git
- ❌ Do not commit "proactively" even if changes seem complete

### What TO do:
- ✅ Make changes and let them run via HMR
- ✅ Inform user that changes are complete and ready for testing
- ✅ Wait for user feedback
- ✅ Only commit when explicitly asked

## Project Context

This is a US Citizenship Test preparation app built with React + Vite.

### Key Files:
- `src/data/questions.js` - Contains all 128 USCIS civics questions with mnemonics and fun facts from `/Users/soumayajameleddine/Downloads/Claude.pdf`
- `src/components/Quiz.jsx` - Main quiz component with animations and user interaction
- `src/index.css` - Global styles, animations, and background configuration
- `public/us-flag.jpg` - Background flag image

### Data Source:
- All mnemonics and fun facts MUST come from `/Users/soumayajameleddine/Downloads/Claude.pdf`
- Never create custom mnemonics or fun facts - always use exact content from the PDF
