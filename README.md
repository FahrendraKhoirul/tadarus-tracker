# Tadarus Tracker

A simple web app to track group Quran recitation (tadarus) progress — log setoran, manage members, and generate shareable WhatsApp reports.

## Tech Stack

- **React 19** + **TypeScript** — UI
- **Vite** — build tool
- **Supabase** — backend & database
- **React Router v7** — client-side routing
- **Tailwind CSS** — styling

## Features

- 📖 Create and manage tadarus groups
- 👥 Add members to each group
- 📝 Log setoran (recitation entries) per member
- 📅 View log history sorted by date
- 📋 Generate a formatted group report and copy to clipboard (WhatsApp-ready)

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Supabase](https://supabase.com) project

### Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/your-username/tadarus-tracker.git
   cd tadarus-tracker
   npm install
   ```

2. Create a `.env` file at the root:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

## Database Schema

| Table          | Key Columns                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `tadarus`      | `id`, `name`, `description`                                                                                |
| `tadarus_user` | `id`, `name`, `tadarus_id`                                                                                 |
| `tadarus_item` | `id`, `tadarus_id`, `tadarus_user`, `from_surah`, `from_ayah`, `to_surah`, `to_ayah`, `note`, `created_at` |

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
