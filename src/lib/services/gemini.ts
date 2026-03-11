import { GoogleGenAI } from "@google/genai";
import { GeminiError } from "@/lib/utils/errors";
import { z } from "zod";

const MODEL_FAST = "gemini-2.5-flash";

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      throw new GeminiError(
        "GOOGLE_GEMINI_API_KEY is not configured. Please add your Gemini API key to .env.local"
      );
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  /**
   * Generate a structured JSON response from Gemini using a Zod schema.
   */
  async generateStructured<T>(options: {
    systemInstruction: string;
    userPrompt: string;
    schema: z.ZodType<T>;
    temperature?: number;
    maxOutputTokens?: number;
  }): Promise<T> {
    const { systemInstruction, userPrompt, schema, temperature = 0.3, maxOutputTokens = 8192 } =
      options;

    // Zod v4 has built-in JSON schema generation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsonSchema = (z as any).toJSONSchema(schema, { $defs: "inline" }) as Record<string, unknown>;

    try {
      const response = await this.ai.models.generateContent({
        model: MODEL_FAST,
        contents: userPrompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: jsonSchema,
          temperature,
          maxOutputTokens,
        },
      });

      const text = response.text;
      if (!text) {
        throw new GeminiError("Gemini returned an empty response");
      }

      // Parse and validate the JSON response
      const parsed = JSON.parse(text);
      return schema.parse(parsed) as T;
    } catch (err) {
      if (err instanceof GeminiError) throw err;
      if (err instanceof SyntaxError) {
        throw new GeminiError(`Failed to parse Gemini JSON response: ${err.message}`);
      }
      throw new GeminiError(`Gemini API error: ${String(err)}`);
    }
  }

  /**
   * Generate plain text response (for quality checks, summaries)
   */
  async generateText(options: {
    systemInstruction: string;
    userPrompt: string;
    temperature?: number;
    maxOutputTokens?: number;
  }): Promise<string> {
    const { systemInstruction, userPrompt, temperature = 0.3, maxOutputTokens = 2048 } = options;

    try {
      const response = await this.ai.models.generateContent({
        model: MODEL_FAST,
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature,
          maxOutputTokens,
        },
      });

      const text = response.text;
      if (!text) throw new GeminiError("Gemini returned an empty response");
      return text;
    } catch (err) {
      if (err instanceof GeminiError) throw err;
      throw new GeminiError(`Gemini API error: ${String(err)}`);
    }
  }
}

let geminiInstance: GeminiService | null = null;

export function getGeminiService(): GeminiService {
  if (!geminiInstance) {
    geminiInstance = new GeminiService();
  }
  return geminiInstance;
}

export { GeminiService };
