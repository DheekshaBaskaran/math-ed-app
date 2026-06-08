import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const question: string | undefined = body?.question ?? body?.prompt;
    const grade = body?.grade;
    const topic: string = body?.topic ?? 'general math';

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json({ error: 'question is required' }, { status: 400 });
    }

    const sys = [
      'You are a patient K–8 math tutor.',
      'Respond in 3–6 short steps using plain language.',
      'Guide the student; be kind and encouraging.',
      'Explain clearly, then end with a next step or quick check.',
      'Use plain text equations (like "4x + 2 = 12" or "x = 2.5") instead of LaTeX or Markdown formatting.'
    ].join(' ');

    const parts = [
      grade !== undefined ? `Grade: ${grade}` : null,
      topic ? `Topic: ${topic}` : null,
      `Student question: ${question}`,
      'Explain step by step.',
    ].filter(Boolean);

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: parts.join('\n') },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return NextResponse.json(
        { error: `OpenAI error ${resp.status}: ${text.slice(0, 500)}` },
        { status: 502 }
      );
    }

    const data = await resp.json();
    let answer =
      data?.choices?.[0]?.message?.content?.trim() ??
      'Let’s start by identifying what is given and what the question is asking.';

    // 🧹 Clean up any remaining LaTeX or Markdown formatting
    answer = answer
      .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2') // \frac{1}{2} → 1/2
      .replace(/\\text\{([^}]*)\}/g, '$1') // remove \text{}
      .replace(/\\times/g, '×')
      .replace(/\\\(|\\\)/g, '') // remove \( \)
      .replace(/\\\[|\\\]/g, '')
      .replace(/\*\*/g, '')
      .replace(/\n{2,}/g, '\n')
      .trim();

    return NextResponse.json({ hint: answer });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? 'Unexpected server error' },
      { status: 500 }
    );
  }
}
