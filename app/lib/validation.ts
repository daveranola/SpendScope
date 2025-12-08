import * as z from 'zod';

export const transactionCategories = [
    "GROCERIES",
    "RENT",
    "EATING_OUT",
    "TRANSPORT",
    "SUBSCRIPTIONS",
    "ENTERTAINMENT",
    "UTILITIES",
    "INCOME",
    "OTHER",
] as const;

export const transactionTypes = ["EXPENSE", "INCOME"] as const;

export const BudgetSchema = z.object({
    category: z.enum(transactionCategories),
    amount: z
        .number()
        .nonnegative({ message: 'Amount must be 0 or greater.' }),
});

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

export const TransactionSchema = z.object({
    amount: z
        .number()
        .positive({ message: 'Amount must be greater than 0.' }),
    description: z.string(),
    category: z.enum(transactionCategories),
    type: z.enum(transactionTypes),
});

export type SignupValues = z.infer<typeof SignupFormSchema>;

export type LoginValues = z.infer<typeof LoginFormSchema>;

export type TransactionValues = z.infer<typeof TransactionSchema>;

export type TransactionCategory = (typeof transactionCategories)[number];

export type BudgetValues = z.infer<typeof BudgetSchema>;
