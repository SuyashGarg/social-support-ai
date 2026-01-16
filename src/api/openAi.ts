import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { situation } = req.body || {};
        if (!situation || typeof situation !== "string") {
            return res.status(400).json({ error: "situation must be a string" });
        }

        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You help users write clear, respectful, first-person statements for forms. Keep it concise and factual.",
                },
                {
                    role: "user",
                    content: `Situation: ${situation}\n\nWrite a short financial hardship statement (80–140 words).`,
                },
            ],
        });

        return res.status(200).json({ text: response.choices[0].message.content ?? "" });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Failed to generate response" });
    }
}
