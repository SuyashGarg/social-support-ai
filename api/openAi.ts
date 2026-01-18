/**
 * OpenAI API Serverless Function
 * 
 * ARCHITECTURE DECISION: Serverless functions for API key security
 * 
 * Rationale:
 * - API keys must never be exposed to client-side code
 * - Serverless functions run server-side only
 * - No backend infrastructure to maintain
 * - Automatic scaling with Vercel
 * 
 * Security:
 * - API key stored in environment variables
 * - Only accessible server-side
 * - Request validation before API call
 * - Error handling for rate limits and failures
 * 
 * Deployment:
 * - Deployed as Vercel serverless function
 * - Accessible at /api/openAi endpoint
 * - Handles CORS automatically
 */
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
    }

    try {
        const { situation } = req.body || {};
        if (!situation || typeof situation !== 'string') {
            return res.status(400).json({ error: 'situation must be a string' });
        }

        const response = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content:
                        'You help users write clear, respectful, first-person statements for forms. Keep it concise and factual.',
                },
                {
                    role: 'user',
                    content: `Situation: ${situation}\n\nWrite a short financial hardship statement (80–140 words).`,
                },
            ],
        });

        return res.status(200).json({ text: response.choices[0].message.content ?? '' });
    } catch (err: any) {
        if (err?.status === 429) {
            return res.status(429).json({
                error: 'OpenAI quota exceeded. Please try again later.',
            });
        }
        return res.status(500).json({ error: 'Failed to generate response' });
    }
}