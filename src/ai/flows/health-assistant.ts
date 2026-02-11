'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI Health Assistant.
 * 
 * The assistant helps find doctors, provides diet charts, and home medication tips.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MOCK_DOCTORS } from '@/app/lib/mock-data';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string(),
});

const HealthAssistantInputSchema = z.object({
  message: z.string().describe('The message from the user.'),
  history: z.array(ChatMessageSchema).optional().describe('The chat history.'),
});
export type HealthAssistantInput = z.infer<typeof HealthAssistantInputSchema>;

const HealthAssistantOutputSchema = z.object({
  text: z.string().describe('The response from the assistant.'),
});
export type HealthAssistantOutput = z.infer<typeof HealthAssistantOutputSchema>;

// Tool to search for doctors in our mock database
const searchDoctorsTool = ai.defineTool(
  {
    name: 'searchDoctors',
    description: 'Searches for doctors by name, specialty, or location. Returns doctor details including address, phone, and availability.',
    inputSchema: z.object({
      query: z.string().describe('A keyword to search for (e.g., "Chicago", "Cardiologist", "Sarah").'),
    }),
    outputSchema: z.array(z.any()),
  },
  async ({ query }) => {
    const q = query.toLowerCase();
    return MOCK_DOCTORS.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.specialization.toLowerCase().includes(q) || 
      d.location.toLowerCase().includes(q)
    );
  }
);

export async function healthAssistant(input: HealthAssistantInput): Promise<HealthAssistantOutput> {
  return healthAssistantFlow(input);
}

const healthAssistantFlow = ai.defineFlow(
  {
    name: 'healthAssistantFlow',
    inputSchema: HealthAssistantInputSchema,
    outputSchema: HealthAssistantOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      system: `You are HealthWise AI, a helpful health assistant. 
      Your goals:
      1. Help patients find doctors. Use the searchDoctors tool when users ask for a specialist or a doctor in a specific city. 
         When listing doctors, ALWAYS include their address, contact number, and timings clearly.
      2. Provide personalized diet charts if requested. Be professional and encouraging.
      3. Give basic help and home medication advice for minor issues (e.g., cold, headache). 
         ALWAYS include a disclaimer that you are an AI and they should consult a professional for serious issues.
      4. Be concise and use Markdown for formatting (bolding, lists).`,
      prompt: input.message,
      history: input.history?.map(m => ({
        role: m.role,
        content: [{ text: m.text }]
      })),
      tools: [searchDoctorsTool],
    });

    return { text: text || "I'm sorry, I couldn't process that request." };
  }
);
