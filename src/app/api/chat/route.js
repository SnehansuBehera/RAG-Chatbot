import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const buildGoogleGenAIPrompt = (messages) => ({
    contents: messages
        .filter(message => message.role === 'user' || message.role === 'assistant')
        .map(message => ({
            role: message.role === 'user' ? 'user' : 'model',
            parts: [{ text: message.content }],
        })),
});

export async function POST(req) {

    const { messages } = await req.json();

    const geminiStream = await genAI
        .getGenerativeModel({ model: 'gemini-pro' })
        .generateContentStream(buildGoogleGenAIPrompt(messages));

    // const { text } = await generateText({
    //     model: google('models/gemini-pro'),
    //     prompt: messages,
    // });

    const stream = GoogleGenerativeAIStream(geminiStream);

    // return NextResponse.json(text);
    return new StreamingTextResponse(stream);
}