'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating bilingual personalized health insights.
 *
 * The flow takes user's health data as input and returns personalized insights, risk factors,
 * home-based therapy, and medication tips in both English and Hindi.
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
  homeTherapy: z.string().describe('Recommended home-based therapy or physical exercises in English.'),
  homeTherapyHindi: z.string().describe('Recommended home-based therapy or physical exercises in Hindi (हिंदी).'),
  medicationTips: z.string().describe('Home-based remedies or medication tips in English.'),
  medicationTipsHindi: z.string().describe('Home-based remedies or medication tips in Hindi (हिंदी).'),
});
export type PersonalizedHealthInsightsOutput = z.infer<typeof PersonalizedHealthInsightsOutputSchema>;

export async function personalizedHealthInsights(input: PersonalizedHealthInsightsInput): Promise<PersonalizedHealthInsightsOutput> {
  return personalizedHealthInsightsFlow(input);
}

const personalizedHealthInsightsPrompt = ai.definePrompt({
  name: 'personalizedHealthInsightsPrompt',
  input: {schema: PersonalizedHealthInsightsInputSchema},
  output: {schema: PersonalizedHealthInsightsOutputSchema},
  prompt: `You are an AI health assistant providing comprehensive health assessments.

  Based on the following data:
  Symptoms: {{{symptoms}}}
  Diet: {{{diet}}}
  Age: {{{age}}}
  Weight: {{{weight}}} kg
  Height: {{{height}}} cm
  Exercise Level: {{{exerciseLevel}}}
  Medical History: {{{medicalHistory}}}

  Provide:
  1. Personalized health insights.
  2. Potential risk factors.
  3. Home-based therapy (e.g., specific stretches, breathing exercises, or physical therapy tips).
  4. Home-based medication/remedy tips (e.g., Ayurvedic tips, common OTC suggestions with disclaimers).

  You MUST provide both English and Hindi versions for all fields.
  Ensure the tone is professional yet accessible.
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
