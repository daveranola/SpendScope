# SpendScope

SpendScope is a personal budgeting app for tracking income, expenses, monthly budgets, savings goals, and spending insights in one place. It is designed for people who want a clear month-to-date picture without managing a spreadsheet.

## Live Demo

[View the live SpendScope demo](https://spend-scope-gold.vercel.app/)

## Key Features

- Email/password sign up, log in, and log out powered by Supabase Auth.
- Dashboard summary cards for current balance, month-to-date spending, budget remaining, and active goals.
- Transaction logging for income and expenses, including descriptions, categories, optional goal links, sorting, pagination, and delete confirmation.
- Custom income and expense categories for cleaner transaction entry.
- Monthly category budgets with progress bars and over-budget indicators.
- Savings goals with automatic progress based on linked transactions and completed-goal tracking.
- Spending insights with income/expense pie charts and monthly trend charts.
- Responsive landing page, dashboard, and budget views built for desktop and mobile.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19 and [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/) for authentication and database access
- [Prisma](https://www.prisma.io/) 7 for the PostgreSQL schema and migrations
- [Tailwind CSS](https://tailwindcss.com/) 4 for styling
- [Recharts](https://recharts.org/) for dashboard charts
- [Vercel Analytics](https://vercel.com/analytics)
- ESLint for code quality checks

## Screenshots

Representative screens from SpendScope:

| Landing page | Dashboard overview |
| --- | --- |
| ![SpendScope landing page](docs/screenshots/landing-hero.png) | ![SpendScope dashboard overview](docs/screenshots/dashboard-overview.png) |

| Saving goals | Transactions |
| --- | --- |
| ![SpendScope saving goals](docs/screenshots/saving-goals.png) | ![SpendScope transaction form and list](docs/screenshots/transactions.png) |

| Spending insights | Categories |
| --- | --- |
| ![SpendScope spending insights](docs/screenshots/insights.png) | ![SpendScope category manager](docs/screenshots/categories.png) |

| Budgets | Sign up |
| --- | --- |
| ![SpendScope budget management](docs/screenshots/budgets.png) | ![SpendScope sign up form](docs/screenshots/signup.png) |

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/daveranola/SpendScope.git
cd SpendScope
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root. The app reads the following variables:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

Use the same Supabase project for `DATABASE_URL` and the Supabase public URL/key so the Prisma-managed tables and Supabase Auth user IDs line up.

### 4. Set up the database

If you are connecting to a fresh PostgreSQL/Supabase database, run the Prisma setup commands:

```bash
npx prisma generate
npx prisma migrate dev
```

The Prisma schema defines the `Transaction`, `Budget`, `Goal`, and `Category` tables used by the app.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Used for |
| --- | --- | --- |
| `DATABASE_URL` | Yes, for Prisma setup | PostgreSQL connection string used by Prisma migrations and generation. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL used by the server-side Supabase client. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key used for auth and authenticated database requests. |

The local `.env` file is ignored by Git. Do not commit real database URLs or Supabase keys.

## Project Structure

```text
SpendScope/
├── app/
│   ├── api/                 # API routes for auth, transactions, budgets, goals, and categories
│   ├── budget/              # Budget management page
│   ├── dashboard/           # Authenticated dashboard page
│   ├── lib/                 # Shared API, Supabase, and validation helpers
│   ├── ui/                  # Reusable forms, charts, navigation, and dashboard components
│   ├── globals.css          # Global Tailwind styles
│   ├── layout.tsx           # Root layout and app metadata
│   └── page.tsx             # Landing page with auth entry points
├── prisma/
│   ├── migrations/          # Database migration history
│   └── schema.prisma        # Prisma data model
├── docs/
│   └── screenshots/         # README screenshot assets
├── public/                  # Static assets and app icon
├── package.json             # Scripts and dependencies
└── prisma.config.ts         # Prisma CLI configuration
```

## Usage Guide

1. Create an account or log in from the landing page.
2. Add income and expense categories before entering transactions.
3. Log transactions from the dashboard, choosing a type, category, amount, and optional description.
4. Create savings goals, then link relevant transactions to those goals to update progress.
5. Set monthly category budgets from the budget page.
6. Review the dashboard overview and insights tabs to compare spending, income, budgets, and trends.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Builds the app for production.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run lint
```

Runs ESLint.

## Future Improvements

- Add CSV import/export for transactions.
- Add recurring transactions for regular income, bills, and subscriptions.
- Add budget alerts when a category is close to or over its monthly limit.
- Add richer account settings, including preferred currency and locale.
- Add automated tests for forms, API routes, and dashboard calculations.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes.
4. Run the quality checks that apply to your change:

```bash
npm run lint
npm run build
```

5. Open a pull request with a clear summary of what changed and any setup notes reviewers need.

## License

No license file is currently included in this repository.
