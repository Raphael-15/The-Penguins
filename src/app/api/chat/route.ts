import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

// Ensure the token is clean
const token = process.env.HUGGINGFACE_API_TOKEN?.trim();
const hf = new HfInference(token);

export async function POST(req: Request) {
  try {
    const { messages, city, school } = await req.json();

    if (!token || token === "your_token_here") {
      return NextResponse.json({ 
        error: "Hugging Face API token is missing. Please check your .env.local file." 
      }, { status: 401 });
    }

    const systemPrompt = `You are a helpful local guide for international students in ${city}, attending ${school}. 
    Provide advice about transport, administration, housing, and city life.
    
    STRICT RULE: You MUST respond in the EXACT SAME language as the user. 
    - User asks in English -> Answer in English.
    - User asks in French -> Answer in French.
    - User asks in Spanish -> Answer in Spanish.
    Never mix languages. Be concise.`;

    const response = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-7B-Instruct", // Very stable and powerful model on free HF API
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    const botMessage = response.choices[0]?.message?.content;

    if (!botMessage) {
      throw new Error("The AI returned an empty response.");
    }

    return NextResponse.json({ text: botMessage });

  } catch (error: any) {
    console.error("Hugging Face API error:", error);
    
    // Check for specific Hugging Face errors
    let userErrorMessage = "The AI is currently unavailable. Please try again in a few seconds.";
    
    if (error.message?.includes("Model is overloaded")) {
      userErrorMessage = "The AI model is currently busy with too many requests. Please wait a moment.";
    } else if (error.message?.includes("Authorization header is invalid") || error.message?.includes("401")) {
      userErrorMessage = "There is a problem with your Hugging Face API token. Please verify it is a valid 'Read' token.";
    } else if (error.message) {
      userErrorMessage = `Hugging Face error: ${error.message}`;
    }

    return NextResponse.json({ error: userErrorMessage }, { status: 500 });
  }
}
