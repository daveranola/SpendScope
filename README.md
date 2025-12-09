# SpendScope

SpendScope is a personal budgeting app for individuals who want a clear view of their income, expenses, budgets, and savings goals. It helps you stay on plan with quick data entry, goal progress tracking, and easy-to-read insights.

## Live Demo
- Vercel: https://spend-scope-gold.vercel.app/

## Key Features
- Secure authentication with sign up / log in via Supabase.
- Dashboard snapshots: current balance, month progress, average monthly spend, and category callouts.
- Transactions workspace: add income/expense entries with categories and optional goal links; sort, paginate, and delete with confirmation.
- Budgets and goals: set monthly budgets by category and monitor usage; create savings goals with automatic progress from linked transactions and completed-goal tracking.
- Charts and insights: category pie charts plus stacked monthly trends for income vs expenses and top categories.
- Category manager: create and manage income/expense categories to keep data clean.
- UI polish: tabbed dashboard sections, responsive layouts, fade-in interactions, and dashboard/budget pages tailored for mobile and desktop.

## Tech Stack
- Next.js (App Router) with React and TypeScript
- Supabase (auth, Postgres) with server-side client helpers
- Prisma + PostgreSQL for schema and data access
- Tailwind CSS for styling and layout
- Recharts for data visualizations

## Getting Started
1) Clone the repo and install dependencies:
```bash
npm install
```

2) Set environment variables (example keys shown in `.env`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

3) Run the development server:
```bash
npm run dev
```
Then open http://localhost:3000.

## Usage
- Create an account or log in.
- Add income and expense transactions, assigning categories and linking goals when relevant.
- Review the dashboard tabs for balance, budgets, goal progress, and insights.
- Use charts to spot trends, then adjust budgets or goals as needed.

## Future Improvements
- CSV import/export for transactions and budgets.
- Recurring transactions and reminders.
- Shared budgets or household roles.
- Notifications for overspending or goal milestones.
- Mobile-first PWA enhancements.
