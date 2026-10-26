# MathEd

An AI-powered math learning platform for K–8 students that teaches math through real-world story problems.

![MathEd home page](docs/home.png)

## Why I built it

During a STEM summer program, I visited my local water treatment facility and saw how math models were used for everything, from calculating chemical doses to predicting maintenance. It made me realize that a lot of kids never see how math is used in real life. MathEd is my attempt to change that: every problem is a short story about something students actually run into, like splitting a pizza, finding a sale price, or figuring out how long until recess.

## Features

- **Grade and topic picker**: Students choose any grade from K to 8, then a topic that fits that grade level (for example, counting and shapes for K–2, fractions and decimals for 3–5, and percent and linear equations for 6–8).
- **Real-world story problems**: Each problem is generated on the spot by the AI, so students get a fresh, grade-appropriate question every time.
- **Hints, not answers**: If a student is stuck, they can ask for a hint that points them in the right direction without giving the answer away.
- **Answer checking**: Students type their answer and get short, encouraging feedback, including what likely went wrong and what to try next.
- **AI tutor**: A chat-style tutor that answers any math question in a few short, plain-language steps.

## Testing with students

I tested MathEd with over 20 students and with educators at a local school. Their feedback showed that the AI tutor's explanations were too long and wordy for kids. Instead of just making the answers shorter, I looked at what students were really getting stuck on and changed the tutor so its explanations were shorter and focused on that.

## Tech stack

- [Next.js](https://nextjs.org) (App Router), React, and TypeScript
- Tailwind CSS
- OpenAI API (`gpt-4o-mini`) for generating problems, hints, feedback, and tutor answers

## How it works

| Route | What it does |
| --- | --- |
| `/` | Home page |
| `/dashboard` | Practice: pick a grade and topic, solve the problem, get hints and feedback |
| `/tutor` | Chat with the AI tutor |
| `POST /api/generate-question` | Creates a real-world problem for a grade and topic |
| `POST /api/ask-tutor` | Returns a step-by-step explanation or hint |
| `POST /api/evaluate-answer` | Checks a student's answer and gives short feedback |
| `POST /api/hint` | Returns a hint for a problem |

## Running it locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root with your OpenAI API key:

   ```bash
   OPENAI_API_KEY=your-key-here
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).
