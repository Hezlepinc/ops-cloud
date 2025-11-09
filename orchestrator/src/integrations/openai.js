import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function summarizeStatus(statusJson) {
	const prompt = `
You are the Hezlep Inc. Ops assistant.
Analyze this orchestrator status and produce a concise summary of errors or actions needed.

${JSON.stringify(statusJson)}
`.trim();

	const completion = await client.chat.completions.create({
		model: "gpt-5-turbo",
		messages: [{ role: "user", content: prompt }],
		temperature: 0.2
	});
	return completion.choices[0]?.message?.content ?? "(no content)";
}

export async function generateDailySuggestions(snapshot) {
	const prompt = `
You are the Hezlep Ops reliability coach. Given the snapshot below, produce 3-5 specific, high‑impact suggestions to improve visibility, reliability, or developer velocity. 
Return concise bullets with one actionable sentence each. Prioritize: rate limit hardening, cache warmups, workflow guardrails, and low‑effort UX gains.
Snapshot:
${JSON.stringify(snapshot)}
`.trim();

	const completion = await client.chat.completions.create({
		model: "gpt-5-turbo",
		messages: [{ role: "user", content: prompt }],
		temperature: 0.3
	});
	const text = completion.choices[0]?.message?.content ?? "";
	// Split into suggestion lines
	const suggestions = text
		.split(/\n+/)
		.map(s => s.replace(/^\s*[-*\d\.\)]\s*/, "").trim())
		.filter(Boolean)
		.slice(0, 6);
	return suggestions;
}


