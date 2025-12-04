import * as z from 'zod';

// z.object -> expects some object with name, email, password
export const SignupFormSchema = z.object({
    // z.string -> expects a string
    // .min(2) -> minimum length of 2
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),

    // z.email -> expects a valid email format
    email: z.email({ message: 'Please enter a valid email.' }),

    // .string -> expects a string
    // .min(8) -> minimum length of 8
    // .regex -> expects at least one letter, one number, and one special character
    password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    }),
});

export const LoginFormSchema = z.object({
    email: z.email({ message: 'Please enter a valid email.' }),
    password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

// essentially infers the type from the schema defined above so name, email, password are all strings
export type SignupValues = z.infer<typeof SignupFormSchema>;

export type LoginValues = z.infer<typeof LoginFormSchema>;