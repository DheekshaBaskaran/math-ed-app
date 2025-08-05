export async function POST(req: Request) {
    const { question } = await req.json();
  
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful math tutor that gives subtle, real-world hints — not answers.',
          },
          {
            role: 'user',
            content: `Give me a helpful hint for this math problem: ${question}`,
          },
        ],
      }),
    });
  
    const data = await completion.json();
    return new Response(JSON.stringify({ hint: data.choices[0].message.content }));
  }
  