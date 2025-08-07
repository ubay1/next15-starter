# ⚡ Next.js Fullstack Boilerplate

A modern fullstack starter kit using **Next.js**, **Tailwind CSS**, **Shadcn UI**, and a full ecosystem for scalable, type-safe development.

## ✨ Features

- ⚛️ **React** + **Next.js App Router**
- 💅 **Tailwind CSS** with **Shadcn UI** and **Class Variance Authority (CVA)**
- ✅ **Type-safe Forms** with **React Hook Form** + **Zod**
- 🗂️ **State Management** with **Zustand**
- 🔁 **Data Fetching** with **React Query**
- 🔌 **Type-safe APIs** with **tRPC**
- 🔐 **Database** with **Supabase**
- 🧪 **Testing** with **Vitest** & **React Testing Library**
- 🧭 **E2E Testing** with **Playwright**
- 🔧 Fully typed with **TypeScript**

## 🛠 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) / or **pnpm** / **yarn**

### Installation

```bash
Clone the repository:
git clone https://github.com/ubay1/next15-starter.git

Install dependencies:
cd nextjs-fullstack-boilerplate
npm install

To start the development server:
npm run dev

To run unit tests:
npm run test

To run E2E tests:
npm run test:e2e

To build for production:
npm run build

Environment Variables
Copy the example .env file and configure as needed:
cp .env.example .env


📁 Project Structur

src/
  ├── app/              # Next.js App Router
  ├── components/       # UI components (with Shadcn/CVA)
  ├── features/         # Feature-based modules
  ├── hooks/            # Custom hooks
  ├── lib/              # Utilities (Supabase client, helpers, etc)
  ├── server/           # tRPC handlers & procedures
  ├── types/            # Global type definitions
  └── tests/            # Test utilities

🧰 Tech Stack
Frontend: Next.js, React, Tailwind CSS, Shadcn UI

State: Zustand, React Query

Forms: React Hook Form + Zod

Backend: tRPC, Supabase

Testing: Vitest, React Testing Library, Playwright

Utilities: TypeScript, CVA, ESLint, Prettier
```

🤝 Contributing
Contributions are welcome! Feel free to open issues or pull requests.

Fork the project

Create your feature branch: git checkout -b feature/my-feature

Commit your changes: git commit -m 'feat: add my feature'

Push to the branch: git push origin feature/my-feature

Open a pull request

📄 License
This project is licensed under the MIT License — see the LICENSE file for details.
