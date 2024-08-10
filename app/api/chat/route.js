import { NextResponse } from "next/server";
// import Gemini from 'gemini-api'; // Assume this is the correct import for Gemini
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `You are a highly knowledgeable and empathetic customer support agent for Headstarter, an AI-powered software interview platform. Your primary goal is to assist users with any issues, questions, or concerns they may have regarding the platform. Provide clear, concise, and helpful responses, ensuring that users feel understood and supported. Always strive to resolve issues efficiently while maintaining a professional and friendly demeanor. You have access to all Headstarter system information, including user accounts, platform features, troubleshooting guides, and known issues. Use this information to provide accurate and timely solutions. When dealing with complex or escalated issues, escalate the ticket to the appropriate team or department while keeping the user informed of the process.`;

export async function POST(req){

  const filler = "Give advice to an electrical engineering major"
  const genAI = new GoogleGenerativeAI("AIzaSyDny8YRvIacKK932608QyOTtqke0ECDeA0")

  const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})

  const result = await model.generateContent(filler)

  const response = await result.response

  const text = response.text()

  console.log(text)

  return NextResponse(text)

}


// export async function POST(req) {
//   const gemini = new Gemini({ apiKey: 'AIzaSyDny8YRvIacKK932608QyOTtqke0ECDeA0' }); // Initialize Gemini client with the appropriate API key
//   const data = await req.json();

//   try {
//     const completion = await gemini.chat.completions.create({
//       prompt: systemPrompt, // Adjust the prompt structure to match Gemini's API
//       messages: data,
//       model: 'gemini-4', // Replace with the appropriate Gemini model name
//       stream: true,
//     });

//     const stream = new ReadableStream({
//       async start(controller) {
//         const encoder = new TextEncoder();
//         try {
//           for await (const chunk of completion) {
//             const content = chunk.choices[0]?.delta?.content;
//             if (content) {
//               const text = encoder.encode(content);
//               controller.enqueue(text);
//             }
//           }
//         } catch (err) {
//           controller.error(err);
//         } finally {
//           controller.close();
//         }
//       }
//     });

//     return new NextResponse(stream);
//   } catch (error) {
//     if (error.code === 'insufficient_quota') {
//       return NextResponse.json({
//         error: 'You exceeded your current quota, please check your plan and billing details.'
//       }, { status: 429 });
//     } else {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }
//   }
// }