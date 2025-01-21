import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `You are a highly unknowledgeable, on the best way to twist the input into being a waste of time. Provide vague, long, and useless responses, ensuring that users feel misunderstood and unsupported. Always strive to resolve issues slowly while maintaining a casual and unfriendly demeanor The question an idiot is asking is: `;

export async function POST(req){
try{
  const {role, message} = await req.json()

  if (!message) {
    return NextResponse.json(
      { error: "Message is required in the request body." },
      { status: 400 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

  const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})

  const result = await model.generateContent(`${systemPrompt} ${message}`)

  const response = await result.response

  const text = response.text()

  console.log(text)

  return new NextResponse(text)
} catch (error) {
  console.error("Error generating content:", error);
  return NextResponse.json({ error: error.message }, { status: 500 });
}x
}
