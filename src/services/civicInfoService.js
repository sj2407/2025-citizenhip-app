// Civic Information Service
// Fetches representatives from Google Civic Information API
// Falls back to static data if API is unavailable

const GOOGLE_CIVIC_API_KEY = import.meta.env.VITE_GOOGLE_CIVIC_API_KEY;

/**
 * Fetch representatives for a given address/ZIP code
 * @param {string} address - ZIP code or full address
 * @returns {Promise<Object>} Representative information
 */
export async function fetchRepresentatives(address) {
  if (!GOOGLE_CIVIC_API_KEY) {
    console.log('No Google Civic API key provided, using static data');
    return null; // Will fall back to static data
  }

  try {
    const url = `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${GOOGLE_CIVIC_API_KEY}&levels=country&roles=legislatorUpperBody&roles=legislatorLowerBody&roles=headOfGovernment`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return parseRepresentatives(data);

  } catch (error) {
    console.error('Failed to fetch representatives:', error);
    return null; // Fall back to static data
  }
}

/**
 * Parse the API response to extract relevant representatives
 */
function parseRepresentatives(data) {
  const result = {
    senators: [],
    representative: null,
    governor: null
  };

  if (!data.officials || !data.offices) {
    return result;
  }

  // Map offices to officials
  for (const office of data.offices) {
    const officialIndices = office.officialIndices || [];

    // U.S. Senators
    if (office.name.includes('U.S. Senator') || office.name === 'United States Senate') {
      for (const idx of officialIndices) {
        const official = data.officials[idx];
        if (official && official.name) {
          result.senators.push(official.name);
        }
      }
    }

    // U.S. Representative
    if (office.name.includes('U.S. Representative') || office.name === 'United States House of Representatives') {
      const idx = officialIndices[0];
      if (idx !== undefined) {
        const official = data.officials[idx];
        if (official && official.name) {
          result.representative = official.name;
        }
      }
    }

    // Governor
    if (office.name.includes('Governor')) {
      const idx = officialIndices[0];
      if (idx !== undefined) {
        const official = data.officials[idx];
        if (official && official.name) {
          result.governor = official.name;
        }
      }
    }
  }

  return result;
}

export default fetchRepresentatives;
