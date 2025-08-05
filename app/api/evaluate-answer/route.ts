export async function POST(req: Request) {
    const { question, studentAnswer } = await req.json();
  
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
            content: 'You are a math tutor. Check if the student’s answer is correct and give a friendly, real-world explanation.',
          },
          {
            role: 'user',
            content: `Question: ${question}\nStudent's Answer: ${studentAnswer}`,
          },
        ],
      }),
    });
  
    const data = await completion.json();
    return new Response(JSON.stringify({ feedback: data.choices[0].message.content }));
  }
  