'use server';

/**
 * @fileOverview This file defines a Genkit flow for estimating the duration of tasks.
 *
 * - estimateTaskDuration - Estimates the duration of a task based on its description and context.
 * - EstimateTaskDurationInput - The input type for the estimateTaskDuration function.
 * - EstimateTaskDurationOutput - The return type for the estimateTaskDuration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateTaskDurationInputSchema = z.object({
  taskDescription: z.string().describe('The description of the task to estimate.'),
  context: z.string().optional().describe('Additional context about the task or the user.'),
});
export type EstimateTaskDurationInput = z.infer<typeof EstimateTaskDurationInputSchema>;

const EstimateTaskDurationOutputSchema = z.object({
  estimatedDurationMinutes: z.number().describe('The estimated duration of the task in minutes.'),
});
export type EstimateTaskDurationOutput = z.infer<typeof EstimateTaskDurationOutputSchema>;

export async function estimateTaskDuration(input: EstimateTaskDurationInput): Promise<EstimateTaskDurationOutput> {
  return estimateTaskDurationFlow(input);
}

const estimateTaskDurationPrompt = ai.definePrompt({
  name: 'estimateTaskDurationPrompt',
  input: {schema: EstimateTaskDurationInputSchema},
  output: {schema: EstimateTaskDurationOutputSchema},
  prompt: `You are a helpful AI assistant that estimates the duration of tasks in minutes.

  Given the task description and any additional context, provide an estimated duration in minutes.
  The estimate should be a number only.

  Task Description: {{{taskDescription}}}
  Context: {{{context}}}
  `,
});

const estimateTaskDurationFlow = ai.defineFlow(
  {
    name: 'estimateTaskDurationFlow',
    inputSchema: EstimateTaskDurationInputSchema,
    outputSchema: EstimateTaskDurationOutputSchema,
  },
  async input => {
    const {output} = await estimateTaskDurationPrompt(input);
    return output!;
  }
);
