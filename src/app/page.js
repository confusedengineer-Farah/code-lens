"use client";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!code) {
      alert("Paste some code first!");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      setResponse(data.result);
    } catch (err) {
      setResponse("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">CodeExplainer Pro 🚀</h1>

      <textarea
        className="w-full h-48 p-4 bg-gray-800 rounded-lg font-mono"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={handleExplain}
        className="mt-4 px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Thinking..." : "Explain"}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h2 className="text-xl mb-2">Explanation:</h2>
          <pre className="whitespace-pre-wrap">{response}</pre>
        </div>
      )}
    </div>
  );
}