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


