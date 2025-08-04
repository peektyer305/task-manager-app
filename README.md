# Task Manager App

This repository contains a simple task management application built with **Next.js (App Router)**, **Tailwind CSS**, **TypeScript**, **PostgreSQL**, and **Prisma**. It allows you to create, view, update and delete tasks with a priority, category and due date. The UI is responsive and designed using Tailwind CSS utility classes.

## Features

- **Create a task** with a title, optional description, priority (low/medium/high), optional category and optional due date.
- **View all tasks** in a sortable list ordered by due date and creation time.
- **Update a task** from its edit page.
- **Delete a task** via a confirmation prompt.
- Responsive design that works across desktop and mobile screens.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose for running PostgreSQL

### Setup

1. **Clone this repository**

   ```bash
   git clone <repository-url>
   cd task-manager-app
   ```

2. **Install dependencies** (this will install Next.js, React, Prisma, Tailwind etc.).

   ```bash
   npm install
   ```

3. **Configure the database connection**. Copy the provided `.env.example` to `.env` and adjust the values if needed. By default it points to a local PostgreSQL instance provided by Docker Compose:

   ```bash
   cp .env.example .env
   # optionally edit .env to change credentials or database name
   ```

4. **Start PostgreSQL** via Docker Compose:

   ```bash
   docker-compose up -d
   ```

5. **Apply Prisma migrations and generate the Prisma client**. This will create the `Task` table and associated enums in your database:

   ```bash
   npx prisma migrate dev --name init
   npm run prisma:generate
   ```

6. **Run the development server**:

   ```bash
   npm run dev
   ```

   Open your browser at [http://localhost:3000](http://localhost:3000) to view the app.

### Project structure

- `src/app`: Contains the application pages using Next.js App Router. The root `page.tsx` lists tasks, while `task/new/page.tsx` and `task/[id]/edit/page.tsx` implement the create and edit forms.
- `src/app/api`: API routes under `api/tasks` handle CRUD operations using Prisma. These are invoked by the front‑end forms.
- `src/components`: Client components such as `DeleteButton`.
- `src/lib/prisma.ts`: Singleton Prisma client to avoid multiple instances during hot reloads.
- `prisma/schema.prisma`: Prisma schema defining the `Task` model and `Priority` enum.
- `docker-compose.yml`: Defines a PostgreSQL container for local development.

## Notes

- The dependency versions specified in `package.json` are approximations. When running `npm install` you may get newer compatible versions.
- If you change the Prisma schema (e.g., add new fields), run `npx prisma migrate dev` again to apply a new migration and regenerate the client.
- The app is built using TypeScript and leverages React server components by default. Only interactive parts (forms, delete buttons) are client components.

Feel free to customise the styling, add authentication or extend the data model as needed. Enjoy building! 🎉