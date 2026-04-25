export async function POST(req) {
  try {
    const { code } = await req.json();

    if (!code) {
      return Response.json({ result: "Please provide code!" });
    }

    const systemPrompt = `
You are a clean and structured coding teacher.

Explain the code in this EXACT format:

1. Summary:
Give a short 2 sentence explanation.

2. Step-by-step:
Explain what the code does in simple steps.

3. Key Concepts:
List important concepts used (like loops, functions, recursion).

Rules:
- Keep it beginner friendly
- Do NOT over explain
- Keep it short and clear
- Use simple English
`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                role: "system",
                content: systemPrompt,
                },
                {
                role: "user",
                content: `Explain this code:\n\n${code}`,
                },
            ],
            }),
    });

    const data = await response.json();

    console.log("GROQ RESPONSE:", JSON.stringify(data, null, 2));

    let result = "No response";

    if (data.error) {
      result = "API Error: " + data.error.message;
    } else if (data.choices && data.choices.length > 0) {
      result = data.choices[0].message.content;
    }

    return Response.json({ result });
  } catch (error) {
    console.error("ERROR:", error);
    return Response.json({ result: "Something went wrong!" });
  }
}