import * as z from 'zod';

export const transactionTypes = ["EXPENSE", "INCOME"] as const;

export const BudgetSchema = z.object({
    category: z.string().min(2, { message: 'Category must be at least 2 characters.' }),
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
    description: z.string().optional().default(""),
    category: z.string().min(2, { message: 'Choose a category.' }),
    type: z.enum(transactionTypes),
    goalId: z.number().int().positive().optional().nullable(),
    categoryType: z.enum(transactionTypes).optional(),
});

export const GoalSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
    targetAmount: z
        .number()
        .positive({ message: 'Target must be greater than 0.' }),
});

export const CategorySchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    type: z.enum(transactionTypes),
});

export type SignupValues = z.infer<typeof SignupFormSchema>;

export type LoginValues = z.infer<typeof LoginFormSchema>;

export type TransactionValues = z.infer<typeof TransactionSchema>;

export type BudgetValues = z.infer<typeof BudgetSchema>;

export type GoalValues = z.infer<typeof GoalSchema>;

export type CategoryValues = z.infer<typeof CategorySchema>;
