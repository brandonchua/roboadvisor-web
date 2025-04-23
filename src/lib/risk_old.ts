// src/lib/risk.ts

const scoring: Record<string, Record<string, number>> = {
  q1_1: { '<3 years': 5, '3–5 years': 4, '6–10 years': 2, '>10 years': 1 },
  q1_2: { 'Sell all': 1, 'Sell some': 2, Hold: 3, 'Buy more': 5 },
  q1_3: { '<10%': 5, '10–25%': 3, '25–50%': 2, '>50%': 1 },
  q2_1: {
    'Net income comfortably exceeds expenses': 5,
    'Net income slightly exceeds expenses': 4,
    'Net income barely covers expenses': 2,
    'Expenses exceed income': 1,
  },
  q2_2: { '<1 month': 1, '1–3 months': 2, '3–6 months': 3, '>6 months': 5 },
  q2_3: { 'No significant debt': 5, 'Some manageable debt': 3, 'High debt load': 1 },
  q2_4: { '<10%': 5, '10–30%': 3, '30–50%': 2, '>50%': 1 },
  q2_5: {
    'Home purchase': -2,
    "Child’s education": -2,
    'Large medical expense': -2,
    'Business investment': -2,
    'Other major expense': -2,
    None: 0,
  },
  q3_1: {
    'Preserve capital': 1,
    'Generate income': 2,
    'Moderate growth': 3,
    'Aggressive growth': 4,
    'Speculative gains': 5,
  },
  q3_2: { '<3 years': 1, '3–7 years': 2, '7–15 years': 3, '>15 years': 5 },
  q3_3: { Immediately: 1, '1–2 years': 2, '2–5 years': 3, '>5 years': 5 },
  q3_4: { Extremely: 1, Somewhat: 3, 'Not very': 5 },
  q4_1: {
    None: 1,
    'Basic (funds only)': 2,
    'Moderate (stocks/bonds)': 3,
    Extensive: 5,
  },
  q4_2: {
    'Very uncomfortable': 1,
    'Somewhat uncomfortable': 2,
    Neutral: 3,
    Comfortable: 4,
  },
  q4_3: { 'Sell everything': 1, 'Sell some': 2, Hold: 3, 'Buy more': 5 },
  q4_4: { 'Sell everything': 1, 'Sell some': 2, Hold: 3, 'Buy more': 5 },
  q4_5: {
    'Avoid any loss (even low returns)': 1,
    'Accept small losses for steady returns': 3,
    'Accept moderate losses for higher returns': 5,
    'Accept large swings for maximum upside': 5,
  },
  q5_1: {
    'Yes & regretted it': 2,
    'Yes & felt right': 2,
    'No, I held on': 4,
    'Never faced it': 3,
  },
  q5_2: { 'Very stressed': 1, 'Somewhat stressed': 2, 'Rarely stressed': 3, 'Not stressed': 4 },
  q6_1: { Yes: 5, Possibly: 3, No: 1 },
  q6_2: { 'Increase expected': 4, 'Decrease expected': 1, 'No change': 3 },
  q6_3: { Yes: 5, Somewhat: 3, No: 1 },
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
  if (total <= 30) return 1;
  if (total <= 50) return 3;
  if (total <= 70) return 5;
  if (total <= 90) return 7;
  return 10;
}