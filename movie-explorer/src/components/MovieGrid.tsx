import type { MovieSummary } from '../types/movie';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: MovieSummary[];
  isLoading: boolean;
  onSelect: (movie: MovieSummary) => void;
  emptyMessage?: string;
}

const SkeletonCard = () => (
  <div className="movie-card skeleton">
    <div className="movie-card__poster" />
    <div className="movie-card__content">
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
    </div>
  </div>
);

// Keeps the loading/empty/success UI for the grid in one place.
export const MovieGrid = ({
  movies,
  isLoading,
  onSelect,
  emptyMessage = 'No movies found. Try a different search or filter.',
}: MovieGridProps) => {
  if (isLoading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!movies.length) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />
      ))}
    </div>
  );
};
