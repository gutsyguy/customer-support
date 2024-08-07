
// Server-side code
import { NextResponse } from "next/server";
import OpenAI from 'openai';

const systemPrompt = `You are a highly knowledgeable and empathetic customer support agent for Headstarter, an AI-powered software interview platform. Your primary goal is to assist users with any issues, questions, or concerns they may have regarding the platform. Provide clear, concise, and helpful responses, ensuring that users feel understood and supported. Always strive to resolve issues efficiently while maintaining a professional and friendly demeanor. You have access to all Headstarter system information, including user accounts, platform features, troubleshooting guides, and known issues. Use this information to provide accurate and timely solutions. When dealing with complex or escalated issues, escalate the ticket to the appropriate team or department while keeping the user informed of the process.`;

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...data,
      ],
      model: 'gpt-4o-mini',
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta.content;
            if (content) {
              const text = encoder.encode(content);
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      }
    });

    return new NextResponse(stream);
  } catch (error) {
    if (error.code === 'insufficient_quota') {
      return NextResponse.json({
        error: 'You exceeded your current quota, please check your plan and billing details.'
      }, { status: 429 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
