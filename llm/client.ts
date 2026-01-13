import ollama from "ollama";

// Implementation detail
type GenerateTextOptions = {
  model: string;
  prompt: string;
  instructions?: string;
  temperature?: number;
  maxTokens?: number;
  previousResponseId?: string;
};

type GenerateTextResult = {
  id: string;
  text: string;
};

export const llmClient = {
  async generateText({
    model, // or gpt-4o-mini, or other..
    prompt,
    instructions,
    temperature = 0.2,
    maxTokens = 300,
    previousResponseId,
  }: GenerateTextOptions): Promise<GenerateTextResult> {
    // Combina le istruzioni con il prompt se presenti
    const fullPrompt = instructions
      ? `${instructions}\n\nLa mia richiesta per te è: ${prompt}`
      : prompt;
    console.log(fullPrompt);
    const response = await ollama.chat({
      model,
      messages: [{ role: "user", content: fullPrompt }],
      options: {
        temperature,
        num_predict: maxTokens,
      },
    });

    // Genera un ID casuale dato che Ollama non fornisce ID di risposta
    const id =
      previousResponseId ||
      `ollama-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    return {
      id,
      text: response.message.content,
    };
  },
};
