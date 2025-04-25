// src/lib/risk.ts

const scoring: Record<string, Record<string, number>> = {
  q1_1: { "Under 25": 5, "25–39": 4, "40–59": 2, "60+": 1},
  q1_2: { 
    "Single, no dependents": 4, 
    "Married/partnered, no dependents": 3, 
    "Married/partnered, with dependents": 2, 
    "Single, with dependents": 2 
  },
  q1_3: { 
    "Full-time employed": 4, 
    "Part-time / contract / gig economy": 3, 
    "Self-employed / business owner": 3, 
    "Retired / not in workforce": 2, 
    "Student": 3 
  },
  q2_1: {
    "My net income comfortably exceeds my monthly expenses": 5, 
    "My net income slightly exceeds my monthly expenses": 4, 
    "My net income barely covers my expenses": 2, 
    "My expenses exceed my income (deficit)": 1
  },
  q2_2: { "< 1 month": 1, "1–3 months": 2, "3–6 months": 3, "6+ months": 5 },
  q2_3: { "No significant debt": 5, "Some manageable debt": 3, "High debt load": 1 },
  q2_4: { "Below 10%": 5, "10–30%": 3, "30–50%": 2, "Over 50%": 1 },
  q2_5: {
    "Home purchase": -2, 
    "Child’s education": -2,
    "Large medical expense": -2, 
    "Business investment": -2, 
    "Other major expense": -2, 
    "None": 0
  },
  q3_1: {
    "Preserve capital (beat inflation, minimal risk)": 1, 
    "Generate income (dividends/interest)": 2, 
    "Grow wealth (medium-term)": 3, 
    "Long-term growth (retirement, estate)": 4, 
    "Speculative gains (higher risk/higher reward)": 5
  },
  q3_2: { "< 3 years": 1, "3–5 years": 2, "5–10 years": 3, "10–15 years": 4, "15+ years": 5 },
  q3_3: { "< 3 years": 1, "3–7 years": 2, "7–15 years": 3, "15+ years": 5 },
  q3_4: { 
    "Extremely": 1,
    "Somewhat": 3, 
    "Not very": 5
  },
  q4_1: {
    "None (completely new)": 1, 
    "Basic (funds only)": 2,
    "Moderate (stocks/bonds)": 3, 
    "Extensive (manage own portfolio, multiple asset classes)": 5
  },
  q4_2: {
    "Very uncomfortable": 1, 
    "Somewhat uncomfortable": 2, 
    "Neutral": 3, 
    "Comfortable": 4
  },
  q4_3: { 
    "Sell everything to avoid further losses": 1, 
    "Sell some, move to safer assets": 2, 
    "Hold": 3, 
    "Buy more": 5 
  },
  q4_4: { 
    "Extremely anxious; likely sell": 1, 
    "Concerned; might reduce exposure": 2, 
    "Uncomfortable but would hold": 3, 
    "View it as a buying opportunity": 5
  },
  q4_5: {
    "Avoid any loss (even low returns)": 1, 
    "Accept small losses for steady returns": 2, 
    "Accept moderate losses for higher returns": 3,
    "Accept significant volatility for higher potential returns": 5
  },
  q5_1: {
    'Yes & regretted it': 2,
    'Yes & felt right': 2,
    'No, I held on': 4,
    'Never faced it': 3,
  },
  q5_2: { 
    'Very stressed': 1, 
    'Somewhat stressed': 2, 
    'Rarely stressed': 3, 
    'Not stressed': 4 
  },
  q6_1: { "Yes": 5, "Possibly": 3, "Not sure": 2, "No": 1 },
  q6_2: { 
    "Increase expected (promotion, windfall)": 4, 
    "Decrease expected (job uncertainty, retirement)": 1, 
    "No significant changes": 3 
  },
  q6_3: { "Yes": 5, "Some coverage": 3, "No": 1},
};

/**
 * Compute the raw point total (before bucketing).
 */
export function computeRawScore(answers: Record<string, any>): number {
  let total = 0;
  for (const [qid, ans] of Object.entries(answers)) {
    const map = scoring[qid];
    if (!map) continue;
    if (Array.isArray(ans)) {
      ans.forEach(choice => { total += map[choice] ?? 0 });
    } else {
      total += map[ans] ?? 0;
    }
  }
  return total;
}

/**
 * Translate raw total into risk‑aversion A ∈ {1,3,5,7,10}.
 */
export function computeRiskAversion(answers: Record<string, any>): number {
  const total = computeRawScore(answers);
  if (total <= 30) return 7;
  if (total <= 47) return 5;
  if (total <= 64) return 3;
  if (total <= 81) return 1;
  return 10;
}

export function getRiskProfile(score: number): { profile: string; description: string } {
  if (score < 30)      return { profile: 'Very Conservative', description: 'Capital preservation' }
  if (score < 50)      return { profile: 'Conservative',     description: 'Modest returns, low volatility' }
  if (score < 70)      return { profile: 'Balanced',        description: 'Moderate growth & income' }
  if (score < 90)      return { profile: 'Aggressive',      description: 'Long-term growth' }
  return { profile: 'Very Aggressive', description: 'Maximize returns' }
}


export function getProfileForA(A: number) {
  switch (A) {
    case 10:  return { profile: 'Very Conservative', description: 'Capital preservation' }
    case 7:  return { profile: 'Conservative',     description: 'Modest returns, low volatility' }
    case 5:  return { profile: 'Balanced',        description: 'Moderate growth & income' }
    case 3:  return { profile: 'Aggressive',      description: 'Long-term growth' }
    case 1: return { profile: 'Very Aggressive', description: 'Maximize returns' }
    default: return { profile: 'Unclassified',    description: '' }
  }
}