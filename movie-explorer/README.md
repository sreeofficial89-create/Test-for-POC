# Movie Explorer

A beginner-friendly movie search web application built with **React 19**, **TypeScript**, and **Vite**. You can search the TMDB catalog, apply filters, open rich movie details, and maintain a local **watchlist** that survives page reloads. The UI also ships with a responsive layout, light/dark themes, skeleton loaders, and recent-search suggestions.

> Data is provided by [The Movie Database (TMDB)](https://www.themoviedb.org/). This project is a learning demo and should not be used in production without following TMDB's terms of use.

---

## Features

- **Smart search** with debouncing, keyboard support, and a dedicated Search button.
- **Filters & sorting** (year, type, genre, rating, release date) that work together with pagination.
- **Movie detail modal** with poster, runtime, rating, genres, director, cast, languages, and quick IMDb link.
- **Watchlist** powered by React Context + `localStorage`, accessible on its own page.
- **Recent searches** stored locally and shown as clickable chips/suggestions.
- **Theme toggle** (light/dark) remembered across visits.
- **Responsive layout** with hover states, skeleton cards, and error/empty UI states.

---

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for lightning-fast dev/build tooling
- [React Router](https://reactrouter.com/) for SPA navigation
- [React Icons](https://react-icons.github.io/react-icons/) for lightweight SVG icons
- Built-in ESLint config from Vite (`npm run lint`)

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file with your TMDB key (see below)
echo "VITE_TMDB_API_KEY=YOUR_KEY_HERE" > .env

# 3. Start the dev server
npm run dev

# 4. Open the URL printed by Vite (usually http://localhost:5173)
```

### Environment variables

Create a `.env` file in the project root with:

```
VITE_TMDB_API_KEY=your_tmdb_key
```

You can generate a free key by creating an account at TMDB. Never commit the real key to source control.

---

## Project structure

```
src/
  api/               // TMDB helpers (search, trending, details, genres)
  components/        // Reusable UI building blocks (cards, filters, etc.)
  context/           // Theme + watchlist providers (localStorage aware)
  hooks/             // Shared hooks like useDebounce and useLocalStorage
  pages/             // Route-level views (Home, Watchlist)
  types/             // Typed models for movies, genres, responses
  main.tsx           // App bootstrap (providers + router)
  App.tsx            // Layout, routes, footer
  index.css          // Global styling + theme variables
```

---

## How things work

- **Searching & filtering:** `HomePage` stores the search term, filters, and pagination. A tiny `useDebounce` hook waits 500 ms after typing stops before firing `searchMovies` (or `getTrendingMovies` when the field is empty). Client-side filtering keeps the UI responsive and easy to read.

- **API layer:** `src/api/movies.ts` contains strongly typed helpers that talk to TMDB, map responses into lean `MovieSummary`/`MovieDetails` objects, and throw friendly errors when something goes wrong.

- **Watchlist:** `WatchlistContext` combines React Context with a reusable `useLocalStorage` hook. Components call `addToWatchlist` / `removeFromWatchlist`, and the context syncs state + `localStorage` automatically.

- **Recent searches:** The last five unique queries are stored via `useLocalStorage`. The `SearchBar` component renders them as chips; clicking one automatically triggers a new search.

- **Theme toggle:** `ThemeContext` keeps the current theme in `localStorage` and toggles a `data-theme` attribute on `body`, letting the CSS file swap color tokens instantly.

- **Movie details:** Clicking any card fetches the full TMDB document (with credits) and shows it in `MovieDetailsModal`. The modal includes quick IMDb/official-site links plus an add/remove watchlist button.

---

## Available scripts

| Script        | Description                                     |
| ------------- | ----------------------------------------------- |
| `npm run dev` | Start the Vite dev server with hot reloading.   |
| `npm run build` | Type-check (`tsc -b`) and output production assets. |
| `npm run preview` | Preview the production build locally.       |
| `npm run lint` | Run ESLint using the default Vite config.      |

---

## Notes & next steps

- Replace the placeholder poster image (`movies.ts`) with your own asset if desired.
- Respect TMDB rate limits—debouncing already helps, but you can add caching for heavy use.
- Want tests? Add [Vitest](https://vitest.dev/) and test components/hooks in isolation.

Have fun exploring the movie catalog! Feel free to customize the styling or extend the data model as you learn.
