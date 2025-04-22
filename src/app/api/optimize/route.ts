import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { optimize } from '../../../lib/portfolio';
import { computeRiskAversion } from '../../../lib/risk';
import funds from '../../../data/funds.json';
import cov   from '../../../data/varcov.json';

export async function POST(req: NextRequest) {
  try {
    const answers = await req.json();
    const A       = computeRiskAversion(answers);
    const mu      = (funds as { avgReturn: number }[]).map(f => f.avgReturn);

    console.log('🔍 A=', A);
    console.log('🔍 mu=', mu);
    console.log('🔍 cov=', cov);

    const weights = optimize(mu, cov as number[][], A);

    // *** Make sure you both log AND return these weights ***
    console.log('🔍 weights =', weights);
    return NextResponse.json({ weights });
  } catch (err) {
    console.error('❌ /api/optimize error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}