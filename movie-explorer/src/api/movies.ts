import type {
  Genre,
  MediaType,
  MovieDetails,
  MovieSearchFilters,
  MovieSummary,
  PagedMovieResponse,
  SortOption,
} from '../types/movie';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const DEFAULT_POSTER =
  'https://via.placeholder.com/500x750.png?text=No+Poster+Found';

// Helper: convert relative TMDB image paths into fully qualified URLs.
export const getImageUrl = (path?: string | null, size: string = 'w500') => {
  if (!path) return DEFAULT_POSTER;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

const fetchFromTMDB = async <T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  if (!apiKey) {
    throw new Error(
      'TMDB API key is missing. Please add VITE_TMDB_API_KEY to your .env file.',
    );
  }

  const filteredParams = Object.entries({
    api_key: apiKey,
    language: 'en-US',
    ...params,
  }).reduce<Record<string, string>>((acc, [key, value]) => {
    if (value === undefined || value === null || value === '') return acc;
    acc[key] = String(value);
    return acc;
  }, {});

  const query = new URLSearchParams(filteredParams).toString();
  const response = await fetch(`${API_BASE_URL}${endpoint}?${query}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `TMDB request failed (${response.status}): ${errorText || response.statusText}`,
    );
  }

  return response.json();
};

interface TmdbSearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Array<{
    id: number;
    media_type?: string;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
    poster_path?: string;
    vote_average?: number;
    overview?: string;
    genre_ids?: number[];
  }>;
}

const mapToMovieSummary = (item: {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];
}): MovieSummary | null => {
  const mediaType = item.media_type === 'tv' ? 'tv' : 'movie';
  const releaseDate = item.release_date || item.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : 'N/A';
  const title = item.title || item.name;

  if (!title) {
    return null;
  }

  return {
    id: item.id,
    title,
    releaseDate,
    year,
    posterUrl: getImageUrl(item.poster_path),
    rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
    overview: item.overview || 'No overview available.',
    mediaType,
    genreIds: item.genre_ids || [],
  };
};

const applyFiltersAndSorting = (
  movies: MovieSummary[],
  filters: MovieSearchFilters = {},
): MovieSummary[] => {
  const { year, genreId, mediaType = 'all', sortBy = 'rating_desc' } = filters;

  const filtered = movies.filter((movie) => {
    const matchesType = mediaType === 'all' ? true : movie.mediaType === mediaType;

    const matchesYear = year
      ? movie.year !== 'N/A' && movie.year.startsWith(year)
      : true;

    const matchesGenre = genreId ? movie.genreIds.includes(genreId) : true;

    return matchesType && matchesYear && matchesGenre;
  });

  const sorted = [...filtered].sort((a, b) => {
    const ratingDiff = (b.rating || 0) - (a.rating || 0);
    const releaseDiff =
      new Date(b.releaseDate || 0).getTime() -
      new Date(a.releaseDate || 0).getTime();

    switch (sortBy as SortOption) {
      case 'release_asc':
        return -releaseDiff;
      case 'release_desc':
        return releaseDiff;
      case 'rating_asc':
        return -ratingDiff;
      case 'rating_desc':
      default:
        return ratingDiff;
    }
  });

  return sorted;
};

export const searchMovies = async (
  query: string,
  page = 1,
  filters: MovieSearchFilters = {},
): Promise<PagedMovieResponse> => {
  if (!query.trim()) {
    return {
      page: 1,
      totalPages: 1,
      totalResults: 0,
      results: [],
    };
  }

  const response = await fetchFromTMDB<TmdbSearchResponse>('/search/multi', {
    query,
    page,
    include_adult: 'false',
  });

  const mapped = response.results
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .map(mapToMovieSummary)
    .filter((movie): movie is MovieSummary => Boolean(movie));

  const processed = applyFiltersAndSorting(mapped, filters);

  return {
    page: response.page,
    totalPages: response.total_pages,
    totalResults: response.total_results,
    results: processed,
  };
};

export const getTrendingMovies = async (
  page = 1,
  filters: MovieSearchFilters = {},
): Promise<PagedMovieResponse> => {
  const response = await fetchFromTMDB<TmdbSearchResponse>(
    '/trending/all/week',
    { page },
  );

  const mapped = response.results
    .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
    .map(mapToMovieSummary)
    .filter((movie): movie is MovieSummary => Boolean(movie));

  const processed = applyFiltersAndSorting(mapped, filters);

  return {
    page: response.page,
    totalPages: response.total_pages,
    totalResults: response.total_results,
    results: processed,
  };
};

export const getGenres = async (): Promise<Genre[]> => {
  const [movieGenres, tvGenres] = await Promise.all([
    fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list'),
    fetchFromTMDB<{ genres: Genre[] }>('/genre/tv/list'),
  ]);

  const mergedMap = new Map<number, string>();
  movieGenres.genres.forEach((genre) => mergedMap.set(genre.id, genre.name));
  tvGenres.genres.forEach((genre) => mergedMap.set(genre.id, genre.name));

  return Array.from(mergedMap, ([id, name]) => ({ id, name })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
};

interface TmdbDetailsResponse {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genres?: Genre[];
  runtime?: number;
  episode_run_time?: number[];
  status?: string;
  tagline?: string;
  homepage?: string;
  original_language?: string;
  origin_country?: string[];
  imdb_id?: string;
  credits?: {
    cast?: Array<{ name: string; character?: string }>;
    crew?: Array<{ job: string; name: string }>;
  };
  production_countries?: Array<{ name: string }>;
}

export const getMovieDetails = async (
  id: number,
  mediaType: MediaType,
): Promise<MovieDetails> => {
  const response = await fetchFromTMDB<TmdbDetailsResponse>(
    `/${mediaType}/${id}`,
    {
      append_to_response: 'credits',
    },
  );

  const releaseDate = response.release_date || response.first_air_date || '';
  const year = releaseDate ? new Date(releaseDate).getFullYear().toString() : 'N/A';
  const runtimeMinutes =
    response.runtime ||
    response.episode_run_time?.[0] ||
    0;

  const director =
    response.credits?.crew?.find((crewMember) =>
      mediaType === 'movie'
        ? crewMember.job === 'Director'
        : crewMember.job === 'Executive Producer',
    )?.name || undefined;

  const cast =
    response.credits?.cast
      ?.slice(0, 5)
      .map((person) =>
        person.character ? `${person.name} as ${person.character}` : person.name,
      ) || [];

  return {
    id: response.id,
    title: response.title || response.name || 'Untitled',
    releaseDate,
    year,
    posterUrl: getImageUrl(response.poster_path),
    rating: response.vote_average ? Number(response.vote_average.toFixed(1)) : 0,
    overview: response.overview || 'No overview available.',
    mediaType,
    genreIds: response.genres?.map((genre) => genre.id) || [],
    tagline: response.tagline,
    runtime: runtimeMinutes ? `${runtimeMinutes} min` : 'Unknown',
    genres: response.genres?.map((genre) => genre.name) || [],
    language: response.original_language?.toUpperCase() || 'N/A',
    country:
      response.production_countries?.[0]?.name ||
      response.origin_country?.[0] ||
      'N/A',
    imdbId: response.imdb_id,
    director,
    cast,
    status: response.status,
    homepage: response.homepage,
  };
};
