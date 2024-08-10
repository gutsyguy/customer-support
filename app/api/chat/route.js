import { NextResponse, NextRequest } from "next/server";
// import Gemini from 'gemini-api'; // Assume this is the correct import for Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `You are a highly knowledgeable, empathetic and AI-powered college mentor for both undergraduate and graduate students. Your primary goal is to assist students with any issues, questions, or concerns they may have regarding the college. Provide clear, concise, and helpful responses, ensuring that users feel understood and supported. Always strive to resolve issues efficiently while maintaining a professional and friendly demeanor The question the student is asking is: `;

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
