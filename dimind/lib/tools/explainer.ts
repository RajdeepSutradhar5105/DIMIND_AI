import { groqChat } from "../groq";

export async function explainCode(args: { language?: string; code?: string }): Promise<string> {
  const language = args.language || "Unknown";
  const code = args.code;

  if (!code) return "Code Explainer Error: Missing code.";

  const prompt = `You are an expert software engineer.

Explain the following ${language} code in simple language.

Your explanation should include:

1. Overall purpose
2. Step-by-step explanation
3. Important concepts used
4. Time Complexity (if applicable)
5. Space Complexity (if applicable)
6. Output (if any)

Code:

${code}`;

  try {
    return await groqChat(
      [
        { role: "system", content: "You are an expert programming tutor." },
        { role: "user", content: prompt },
      ],
      { temperature: 0.2 }
    );
  } catch (e: any) {
    return `Code Explainer Error: ${e?.message ?? e}`;
  }
}
