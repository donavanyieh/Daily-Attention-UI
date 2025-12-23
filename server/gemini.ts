import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Use Gemini 2.0 Flash Lite for optimal cost/performance
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

export interface PaperContext {
  title: string;
  markdownText: string;
}

/**
 * Chat with a paper using Gemini API
 * @param messages - Conversation history
 * @param paperContext - Paper title and markdown content
 * @returns AI response
 */
export async function chatWithPaper(
  messages: ChatMessage[],
  paperContext: PaperContext
): Promise<string> {
  try {
    // Build system prompt with paper context
    const systemPrompt = `You are a helpful AI assistant analyzing a research paper.

Paper Title: ${paperContext.title}

Paper Content:
${paperContext.markdownText}

Instructions:
- Answer questions about this paper based on the content above
- Be concise and cite specific sections when relevant
- If asked about something not in the paper, politely indicate that
- Provide technical insights when appropriate
- Use markdown formatting for better readability (headings, lists, code blocks, etc.)`;

    // Convert messages to Gemini format
    const chatHistory = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Start chat with context
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'll help answer questions about this research paper based on its content. What would you like to know?" }],
        },
        ...chatHistory.slice(0, -1), // All messages except the last one
      ],
    });

    // Send the latest message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "user") {
      throw new Error("Last message must be from user");
    }

    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
