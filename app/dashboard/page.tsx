'use client';

import { useState } from 'react';
import axios from 'axios';

const grades = ['K', '1', '2', '3', '4', '5', '6', '7', '8'];

export default function Dashboard() {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [hint, setHint] = useState('');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuestion = async (grade: string) => {
    setSelectedGrade(grade);
    setLoading(true);
    setFeedback('');
    setHint('');
    setStudentAnswer('');
    setQuestion('');

    const res = await axios.post('/api/generate-question', { grade });
    setQuestion(res.data.question);
    setLoading(false);
  };

  const requestHint = async () => {
    const res = await axios.post('/api/hint', { question });
    setHint(res.data.hint);
  };

  const checkAnswer = async () => {
    const res = await axios.post('/api/evaluate-answer', {
      question,
      studentAnswer,
    });
    setFeedback(res.data.feedback);
  };

  return (
    <main className="p-8 min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">Choose Your Grade</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {grades.map((grade) => (
          <button
            key={grade}
            onClick={() => fetchQuestion(grade)}
            className={`px-4 py-2 rounded-full text-white font-semibold ${
              selectedGrade === grade ? 'bg-green-500' : 'bg-blue-500'
            } hover:bg-blue-600`}
          >
            Grade {grade}
          </button>
        ))}
      </div>

      {loading && <p className="text-center">Generating question...</p>}

      {question && (
        <div className="bg-white text-black p-6 rounded-xl shadow-md max-w-xl mx-auto">
          <p className="text-lg mb-4"><strong>Problem:</strong> {question}</p>

          <input
            type="text"
            placeholder="Your answer..."
            className="w-full p-2 border border-gray-300 rounded mb-4"
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
          />

          <div className="flex gap-4 mb-4">
            <button
              onClick={checkAnswer}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit Answer
            </button>

            <button
              onClick={requestHint}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Hint
            </button>
          </div>

          {hint && (
            <div className="mb-4 bg-yellow-100 p-3 rounded text-black">
              <strong>Hint:</strong> {hint}
            </div>
          )}

          {feedback && (
            <div className="bg-blue-100 p-3 rounded text-black">
              <strong>Feedback:</strong> {feedback}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
