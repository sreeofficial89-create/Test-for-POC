import { FiHeart, FiStar } from 'react-icons/fi';
import type { MovieSummary } from '../types/movie';
import { useWatchlist } from '../context/WatchlistContext';

interface MovieCardProps {
  movie: MovieSummary;
  onSelect: (movie: MovieSummary) => void;
}

// Displays a single movie tile + the heart button that talks to the watchlist context.
export const MovieCard = ({ movie, onSelect }: MovieCardProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const saved = isInWatchlist(movie.id);

  const handleWatchlistToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (saved) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(movie);
    }
  };

  return (
    <article
      className="movie-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect(movie)}
      onKeyDown={handleKeyDown}
    >
      <div className="movie-card__poster">
        <img src={movie.posterUrl} alt={`${movie.title} poster`} />
        <button
          type="button"
          className={`watchlist-btn ${saved ? 'is-active' : ''}`}
          onClick={handleWatchlistToggle}
          aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          <FiHeart />
        </button>
      </div>

      <div className="movie-card__content">
        <h3>{movie.title}</h3>
        <p className="movie-card__meta">
          {movie.year} | {movie.mediaType === 'tv' ? 'Series' : 'Movie'}
        </p>
        <p className="movie-card__rating">
          <FiStar /> {movie.rating ? `${movie.rating.toFixed(1)}/10` : 'N/A'}
        </p>
        <p className="movie-card__overview">{movie.overview}</p>
      </div>
    </article>
  );
};
