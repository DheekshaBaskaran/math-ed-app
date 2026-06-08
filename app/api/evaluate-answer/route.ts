import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { grade, topic, question, studentAnswer } = await req.json();

  if (grade === undefined || !topic || !question || !studentAnswer) {
    return NextResponse.json({ error: 'grade, topic, question, studentAnswer required' }, { status: 400 });
  }

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content:
            'You are a concise, encouraging math tutor. Judge if the student answer is correct. Respond with 1–3 short sentences. If wrong, briefly point out the likely mistake and give the next step. Do NOT show a full solution; only reveal the correct final answer if the student is way off or if it helps them retry meaningfully.',
        },
        {
          role: 'user',
          content: `Grade: ${grade}\nTopic: ${topic}\nProblem: ${question}\nStudent answer: ${studentAnswer}\nEvaluate correctness and give brief feedback.`,
        },
      ],
    }),
  });

  const data = await resp.json();
  const feedback = data?.choices?.[0]?.message?.content?.trim() || 'Answer received.';
  // Optional: you could also parse a correctness tag if you engineer the prompt to return JSON.
  return NextResponse.json({ feedback });
}
