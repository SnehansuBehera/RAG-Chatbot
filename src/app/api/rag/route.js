import { VercelAI } from '@vercel/ai-sdk';

export async function POST(req) {
    const ai = new VercelAI(process.env.VERCEL_AI_API_KEY);
    const { query } = await req.json();

    try {
        const response = await ai.complete({
            engine: 'davinci',
            prompt: query,
            maxTokens: 100,
        });

        return new Response(JSON.stringify({ answer: response.choices[0].text.trim() }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
