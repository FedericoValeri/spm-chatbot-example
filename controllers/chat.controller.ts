import type { Request, Response } from "express";
import z from "zod";
import { chatService } from "../services/chat.service";

// Implementation detail
const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(1000, "Prompt is too long"),
  conversationId: z.uuid(),
});

// Public interface
export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parseResult = chatSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: z.treeifyError(parseResult.error) });
      return;
    }

    try {
      const { prompt, conversationId } = req.body;
      const response = await chatService.sendMessage(prompt, conversationId);
      res.json({ message: response.message });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate a response." });
    }
  },
};
