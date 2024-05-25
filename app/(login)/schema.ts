import * as z from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().max(16).min(8),
  errorFirebase:z.string().optional().nullable(),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

