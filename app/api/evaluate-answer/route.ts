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
            content: 'You are a math tutor. Check if the student’s answer is correct and give a friendly, real-world explanation.You are a friendly and patient math tutor for students in grades K–8. Use simple, encouraging language and adapt explanations to the student’s grade level. Break down complex problems into clear, easy-to-follow steps, and provide examples that connect math to real-life situations (like games, sports, or nature). When a student makes a mistake, respond kindly—praise their effort, explain what went wrong, and guide them toward the correct reasoning. Always check for understanding by asking short follow-up questions or offering hints before giving the full answer. Make learning math feel fun, supportive, and confidence-building.',
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
  