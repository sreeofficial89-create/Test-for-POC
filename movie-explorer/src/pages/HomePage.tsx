import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  MovieDetails,
  MovieSummary,
  SortOption,
  Genre,
  MediaTypeFilter,
} from '../types/movie';
import { searchMovies, getTrendingMovies, getGenres, getMovieDetails } from '../api/movies';
import { useDebounce } from '../hooks/useDebounce';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { MovieGrid } from '../components/MovieGrid';
import { PaginationControls } from '../components/PaginationControls';
import { MovieDetailsModal } from '../components/MovieDetailsModal';

const RECENT_SEARCH_LIMIT = 5;

export const HomePage = () => {
  // Local input state + debounced value so we only hit the API after 500ms of no typing.
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedQuery = useDebounce(searchTerm, 500);
  const [activeQuery, setActiveQuery] = useState('');
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>(
    'movie-explorer-recent-searches',
    [],
  );

  // Store the five most recent *unique* queries in localStorage so they persist.
  const addRecentSearch = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== term.toLowerCase(),
      );
      const updated = [term, ...filtered];
      return updated.slice(0, RECENT_SEARCH_LIMIT);
    });
  }, [setRecentSearches]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [genres, setGenres] = useState<Genre[]>([]);

  // Filters + sorting live here and flow down into the toolbar component.
  const [filters, setFilters] = useState<{
    year: string;
    mediaType: MediaTypeFilter;
    genreId: number | null;
    sortBy: SortOption;
  }>({
    year: '',
    mediaType: 'all',
    genreId: null,
    sortBy: 'rating_desc',
  });

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  // Load the TMDB genre list once so the dropdown can display friendly names.
  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch((err) => {
        console.error(err);
        setGenres([]);
      });
  }, []);

  // Update the "active" query whenever the user stops typing.
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed && trimmed !== activeQuery) {
      setActiveQuery(trimmed);
      addRecentSearch(trimmed);
      setPage(1);
    }

    if (!trimmed) {
      setActiveQuery('');
      setPage(1);
    }
  }, [debouncedQuery, activeQuery, addRecentSearch]);

  // Fetch movies whenever the query, filters, or page changes.
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = activeQuery
          ? await searchMovies(activeQuery, page, filters)
          : await getTrendingMovies(page, filters);

        setMovies(response.results);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeQuery, page, filters]);

  const handleSearchSubmit = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setSearchTerm(trimmed);
    setActiveQuery(trimmed);
    addRecentSearch(trimmed);
    setPage(1);
  };

  const handleSelectRecent = (term: string) => {
    setSearchTerm(term);
    setActiveQuery(term);
    setPage(1);
  };

  const handleFiltersChange = (changes: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...changes }));
    setPage(1);
  };

  // When a card is clicked we fetch the full movie document and display the modal.
  const handleMovieSelect = async (movie: MovieSummary) => {
    setDetailsError('');
    setMovieDetails(null);
    setDetailsLoading(true);

    try {
      const details = await getMovieDetails(movie.id, movie.mediaType);
      setMovieDetails(details);
    } catch (err) {
      console.error(err);
      setDetailsError(
        err instanceof Error
          ? err.message
          : 'Unable to load movie details right now.',
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const clearModal = () => {
    setMovieDetails(null);
    setDetailsError('');
  };

  // Friendly helper text at the top of the page.
  const heroMessage = useMemo(() => {
    if (activeQuery) {
      return `Results for "${activeQuery}"`;
    }
    return 'Search for any movie or series to get started, or explore what is trending now.';
  }, [activeQuery]);

  return (
    <div className="page">
      <SearchBar
        query={searchTerm}
        onQueryChange={setSearchTerm}
        onSearch={handleSearchSubmit}
        isLoading={isLoading}
        recentSearches={recentSearches}
        onSelectRecent={handleSelectRecent}
      />

      <p className="hero-message">{heroMessage}</p>

      <FilterBar
        year={filters.year}
        mediaType={filters.mediaType}
        genreId={filters.genreId}
        sortBy={filters.sortBy}
        genres={genres}
        onChange={handleFiltersChange}
      />

      {error && <p className="error-message">{error}</p>}

      <MovieGrid
        movies={movies}
        isLoading={isLoading}
        onSelect={handleMovieSelect}
        emptyMessage={
          activeQuery
            ? 'No results match your search. Try different filters.'
            : 'No trending titles right now. Try searching for something specific!'
        }
      />

      <PaginationControls
        page={page}
        totalPages={Math.min(totalPages, 500)}
        onPageChange={setPage}
      />

      {detailsLoading && (
        <div className="modal-overlay loading">
          <div className="modal loading-card">
            <p>Loading details...</p>
          </div>
        </div>
      )}

      {movieDetails && (
        <MovieDetailsModal movie={movieDetails} onClose={clearModal} />
      )}

      {detailsError && (
        <p className="error-message">{detailsError}</p>
      )}
    </div>
  );
};
