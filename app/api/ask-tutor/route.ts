export async function POST(req: Request) {
    try {
      const body = await req.json();
      const question = body.question;
  
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
              content: 'You are a friendly math tutor for students in grades K–8. Explain things clearly and kindly.',
            },
            { role: 'user', content: question },
          ],
        }),
      });
  
      const data = await completion.json();
  
      if (!data.choices || !data.choices[0]) {
        console.error("GPT returned no choices:", data);
        return new Response(JSON.stringify({ reply: "Sorry, no response from AI." }), { status: 500 });
      }
  
      return new Response(JSON.stringify({ reply: data.choices[0].message.content }));
    } catch (err: any) {
      console.error("API Error:", err);
      return new Response(JSON.stringify({ reply: "Something went wrong on the server." }), { status: 500 });
    }
  }
  