export async function POST(req: Request) {
    const { grade } = await req.json();
  
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
            content: 'You are a math tutor creating engaging, real-world math story problems for elementary and middle school students.',
          },
          {
            role: 'user',
            content: `Create a real-world math word problem for a grade ${grade} student. Only return the question, no answer or explanation.`,
          },
        ],
      }),
    });
  
    const data = await completion.json();
    return new Response(JSON.stringify({ question: data.choices[0].message.content }));
  }
  