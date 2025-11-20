// Shared movie-related TypeScript types to keep the rest of the app tidy.
// These types represent only the data we actually use in the UI, which helps
// avoid over-fetching or handling unnecessary fields.

export type MediaType = 'movie' | 'tv';
export type MediaTypeFilter = 'all' | MediaType;

export interface MovieSummary {
  id: number;
  title: string;
  releaseDate: string;
  year: string;
  posterUrl: string;
  rating: number;
  overview: string;
  mediaType: MediaType;
  genreIds: number[];
}

export interface MovieDetails extends MovieSummary {
  tagline?: string;
  runtime: string;
  genres: string[];
  language: string;
  country: string;
  imdbId?: string;
  director?: string;
  cast: string[];
  status?: string;
  homepage?: string;
}

export interface MovieSearchFilters {
  year?: string;
  genreId?: number | null;
  mediaType?: MediaTypeFilter;
  sortBy?: SortOption;
}

export type SortOption =
  | 'release_desc'
  | 'release_asc'
  | 'rating_desc'
  | 'rating_asc';

export interface PagedMovieResponse {
  page: number;
  totalPages: number;
  totalResults: number;
  results: MovieSummary[];
}

export interface Genre {
  id: number;
  name: string;
}
