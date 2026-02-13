'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating bilingual personalized health insights.
 *
 * The flow takes user's health data as input and returns personalized insights and potential risk factors
 * in both English and Hindi.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHealthInsightsInputSchema = z.object({
  symptoms: z.string().describe('List of symptoms reported by the user.'),
  diet: z.string().describe('Description of the user’s diet.'),
  age: z.number().describe('The age of the user.'),
  weight: z.number().describe('The weight of the user in kilograms.'),
  height: z.number().describe('The height of the user in centimeters.'),
  exerciseLevel: z.string().describe('The exercise level of the user (e.g., sedentary, moderate, active).'),
  medicalHistory: z.string().describe('Relevant medical history of the user.'),
});
export type PersonalizedHealthInsightsInput = z.infer<typeof PersonalizedHealthInsightsInputSchema>;

const PersonalizedHealthInsightsOutputSchema = z.object({
  insights: z.string().describe('Personalized health insights in English.'),
  insightsHindi: z.string().describe('Personalized health insights in Hindi (हिंदी).'),
  riskFactors: z.string().describe('Potential risk factors in English.'),
  riskFactorsHindi: z.string().describe('Potential risk factors in Hindi (हिंदी).'),
});
export type PersonalizedHealthInsightsOutput = z.infer<typeof PersonalizedHealthInsightsOutputSchema>;

export async function personalizedHealthInsights(input: PersonalizedHealthInsightsInput): Promise<PersonalizedHealthInsightsOutput> {
  return personalizedHealthInsightsFlow(input);
}

const personalizedHealthInsightsPrompt = ai.definePrompt({
  name: 'personalizedHealthInsightsPrompt',
  input: {schema: PersonalizedHealthInsightsInputSchema},
  output: {schema: PersonalizedHealthInsightsOutputSchema},
  prompt: `You are an AI health assistant providing personalized health insights and potential risk factors in both English and Hindi.

  Consider the following information about the user:

  Symptoms: {{{symptoms}}}
  Diet: {{{diet}}}
  Age: {{{age}}}
  Weight: {{{weight}}} kg
  Height: {{{height}}} cm
  Exercise Level: {{{exerciseLevel}}}
  Medical History: {{{medicalHistory}}}

  Based on this information, provide personalized health insights and identify potential risk factors.
  You MUST provide both English and Hindi versions.
  Ensure the Hindi translation is accurate and uses professional medical terminology appropriate for a general audience.

  English Insights:
  Hindi Insights (हिंदी):
  English Risk Factors:
  Hindi Risk Factors (हिंदी):
  `,
});

const personalizedHealthInsightsFlow = ai.defineFlow(
  {
    name: 'personalizedHealthInsightsFlow',
    inputSchema: PersonalizedHealthInsightsInputSchema,
    outputSchema: PersonalizedHealthInsightsOutputSchema,
  },
  async input => {
    const {output} = await personalizedHealthInsightsPrompt(input);
    return output!;
  }
);
