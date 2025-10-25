export async function POST(req: Request) {
  const { grade } = await req.json();

  // ✅ Step 1: Define topic dataset (K–8)
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

  // ✅ Step 2: Select a random topic for the given grade
  const topics = gradeTopics[grade] || ["basic math"];
  const topic = topics[Math.floor(Math.random() * topics.length)];

  // ✅ Step 3: Call OpenAI API
  const completion = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // ⚡ Faster + cheaper; you can keep 'gpt-4' if you prefer
      messages: [
        {
          role: "system",
          content:
            "You are a friendly math tutor creating original, real-world word problems aligned with Common Core standards. Use topics appropriate for each grade level and keep language simple, encouraging, and clear.",
        },
        {
          role: "user",
          content: `Create one real-world math word problem for a grade ${grade} student practicing ${topic}. Only return the question itself—no solution, hints, or explanation.`,
        },
      ],
      temperature: 0.9, // adds variety to question generation
    }),
  });

  // ✅ Step 4: Return result
  const data = await completion.json();
  return new Response(JSON.stringify({ 
    topic, 
    question: data.choices?.[0]?.message?.content || "No question generated." 
  }));
}
