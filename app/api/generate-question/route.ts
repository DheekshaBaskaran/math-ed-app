// app/api/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { grade, topic, ask, question, studentAnswer } = body || {};

  // If it's not a hint/check request, we’re generating a brand-new problem
  if (!ask) {
    // 1️⃣ Topic dataset by grade (your existing list)
    const gradeTopics: Record<number, string[]> = {
      0: ["counting", "basic addition", "shapes", "colors"],
      1: ["addition", "subtraction", "time", "measurement"],
      2: ["place value", "money", "simple fractions", "word problems"],
      3: ["multiplication", "division", "area and perimeter", "graphs"],
      4: ["factors and multiples", "fractions and decimals", "geometry", "word problems"],
      5: ["volume", "multi-step operations", "unit conversion", "coordinate grids"],
      6: ["ratios", "unit rates", "integers", "surface area", "data analysis"],
      7: ["proportions", "probability", "expressions and equations", "percentages"],
      8: ["linear equations", "functions", "slope", "Pythagorean theorem", "transformations"],
    };

    // If no topic passed, pick one at random for that grade
    const topics = gradeTopics[grade] || ["basic math"];
    const chosenTopic = topic || topics[Math.floor(Math.random() * topics.length)];

    // 2️⃣ Call OpenAI to generate a real-world word problem
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a friendly math tutor creating original, real-world word problems aligned with Common Core standards for grade ${grade}. 
            Requirements: Use real-world scenarios that ${grade}-grade students encounter and care about (hobbies, sports, shopping, games, social situations). 
            Keep language simple, clear, and age-appropriate. Align difficulty with Common Core standards. 
            Make the problem engaging and relatable, and ensure it has a clear question with all necessary info.`,
          },
          {
            role: "user",
            content: `Create one real-world math word problem for a grade ${grade} student practicing ${chosenTopic}. 
            Only return the question itself — no solution, hints, or explanation.`,
          },
        ],
        temperature: 0.9,
      }),
    });

    const data = await completion.json();
    const questionText =
      data.choices?.[0]?.message?.content || "No question generated.";

    return NextResponse.json({ question: questionText, topic: chosenTopic });
  }

  // 3️⃣ Hint request (from the "Hint" button)
  if (ask === "hint" && question) {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a patient math tutor. Give short, clear hints that guide—not solve—the problem.",
          },
          {
            role: "user",
            content: `Provide one helpful hint for this grade ${grade} ${topic} problem: ${question}`,
          },
        ],
        temperature: 0.7,
      }),
    });
    const data = await completion.json();
    const hintText =
      data.choices?.[0]?.message?.content ||
      "Think about what operation the problem suggests.";
    return NextResponse.json({ hint: hintText });
  }

  // 4️⃣ Check-answer request (optional)
  if (ask === "check" && question && studentAnswer) {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a concise math tutor. Evaluate student answers and give quick, kind feedback. Do not reveal full solutions unless the answer is wrong.",
          },
          {
            role: "user",
            content: `Question: ${question}\nStudent answer: ${studentAnswer}\nGrade: ${grade}\nTopic: ${topic}\nIs the answer correct? Provide short feedback.`,
          },
        ],
        temperature: 0.7,
      }),
    });
    const data = await completion.json();
    const feedback =
      data.choices?.[0]?.message?.content || "Answer submitted.";
    return NextResponse.json({ feedback });
  }

  return NextResponse.json({ error: "Unsupported request" }, { status: 400 });
}
