import * as z from 'zod';

export const usersFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  type: z.string().max(3).min(1),
  errorFirebase: z.string().optional().nullable(),
});

export type UsersFormValues = z.infer<typeof usersFormSchema>;
