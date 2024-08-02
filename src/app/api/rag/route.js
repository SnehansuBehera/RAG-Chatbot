const { Configuration, OpenAIApi } = require('openai');

export async function POST(req) {
    const { query } = await req.json();

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: query,
            max_tokens: 100,
        });

        return new Response(JSON.stringify({ answer: response.data.choices[0].text.trim() }), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
