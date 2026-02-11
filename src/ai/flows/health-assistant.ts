'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI Health Assistant with Pan-India coverage.
 * 
 * The assistant helps find doctors across India, provides diet charts, and home medication tips.
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
  doctorsFound: z.array(z.any()).optional().describe('List of doctors found if applicable.'),
  needsLocation: z.boolean().optional().describe('Whether the assistant needs the user to provide their location.'),
});
export type HealthAssistantOutput = z.infer<typeof HealthAssistantOutputSchema>;

// Tool to search for doctors in our mock database
const searchDoctorsTool = ai.defineTool(
  {
    name: 'searchDoctors',
    description: 'Searches for doctors across Pan-India by name, specialty, or location. Returns doctor details.',
    inputSchema: z.object({
      query: z.string().describe('A keyword to search for (e.g., "Kolkata", "Pediatrician", "Chennai").'),
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
    const { text, output } = await ai.generate({
      system: `You are HealthWise Pan-India AI, a health assistant dedicated to helping users across all of India.
      
      STRICT RULES:
      1. ONLY work for users in India. If they are outside India, politely decline.
      2. FINDING DOCTORS: If a user asks to find a doctor, YOU MUST FIRST ASK FOR THEIR CURRENT LOCATION (City/Area in India) if they haven't provided it yet. 
      3. ONLY after they provide a location, use the searchDoctors tool.
      4. Support PAN-INDIA coverage: Mention that you can find doctors in major hubs like Mumbai, Delhi, Bangalore, Hyderabad, Chennai, and Kolkata, as well as smaller cities.
      5. When displaying doctors, mention that you are showing nearby options based on their location. 
      6. Include address, contact number, and timings clearly for all Indian doctors.
      7. Provide Indian-specific diet suggestions (e.g., mentioning dal, paneer, sprouts, seasonal fruits).
      8. Provide home remedies for minor issues with a professional disclaimer.
      9. If no location is provided for a doctor search, your response must specifically ask for it.
      10. Be concise and use Markdown for formatting.`,
      prompt: input.message,
      history: input.history?.map(m => ({
        role: m.role,
        content: [{ text: m.text }]
      })),
      tools: [searchDoctorsTool],
    });

    // Check if the AI referred to doctors from the mock data
    const doctors = MOCK_DOCTORS.filter(d => 
      text?.toLowerCase().includes(d.name.toLowerCase()) || 
      text?.toLowerCase().includes(d.location.toLowerCase().split(',')[0].toLowerCase())
    );

    const needsLocation = text?.toLowerCase().includes("location") || 
                        text?.toLowerCase().includes("where are you") ||
                        text?.toLowerCase().includes("provide your city") ||
                        text?.toLowerCase().includes("which city");

    return { 
      text: text || "I'm sorry, I couldn't process that request.",
      doctorsFound: doctors.length > 0 ? doctors : undefined,
      needsLocation: needsLocation
    };
  }
);
