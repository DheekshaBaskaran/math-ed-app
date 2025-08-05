'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Tutor() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const askTutor = async () => {
    const res = await axios.post('/api/ask-tutor', { question: input });

    setResponse(res.data.reply);
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Ask the AI Tutor</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What do you need help with?"
        className="w-full p-3 border border-gray-300 rounded-md"
      />

      <button
        onClick={askTutor}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Ask
      </button>

      {response && (
        <div className="mt-4 bg-white text-black p-4 rounded shadow">
          <p className="font-semibold mb-2">Tutor says:</p>
          <p>{response}</p>
        </div>
      )}
    </main>
  );
}
