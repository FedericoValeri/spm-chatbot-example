import fs from "fs";
import path from "path";
import { llmClient } from "../llm/client";
import template from "../llm/prompts/chatbot.txt";
import { conversationRepository } from "../repositories/conversation.repository";

type ChatResponse = {
  id: string;
  message: string;
};

// Carica contenuto fisso Eppoi
const appInfo = fs.readFileSync(
  path.join(__dirname, "..", "llm", "prompts", "Context.md"),
  "utf-8"
);

// Costruisce il system prompt
const instructions = template.replace("{{appInfo}}", appInfo);

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await llmClient.generateText({
      model: "qwen3:0.6b",
      prompt: prompt,
      instructions: instructions,
      temperature: 0.2,
      maxTokens: 200,
      previousResponseId:
        conversationRepository.getLastResponseId(conversationId),
    });

    // 5. Aggiorna conversazione
    conversationRepository.setLastResponseId(conversationId, response.id);

    return { id: response.id, message: response.text };
  },
};
