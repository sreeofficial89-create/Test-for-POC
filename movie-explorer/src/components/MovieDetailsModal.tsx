import { FiClock, FiExternalLink, FiHeart, FiX } from 'react-icons/fi';
import type { MovieDetails } from '../types/movie';
import { useWatchlist } from '../context/WatchlistContext';

interface MovieDetailsModalProps {
  movie: MovieDetails | null;
  onClose: () => void;
}

// Reusable modal shared between Home and Watchlist pages.
export const MovieDetailsModal = ({
  movie,
  onClose,
}: MovieDetailsModalProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  if (!movie) return null;

  const saved = isInWatchlist(movie.id);

  const handleWatchlistClick = () => {
    if (saved) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-title"
      >
        <button type="button" className="modal__close" onClick={onClose}>
          <FiX />
        </button>

        <div className="modal__poster">
          <img src={movie.posterUrl} alt={`${movie.title} poster`} />
        </div>

        <div className="modal__content">
          <h2 id="movie-title">{movie.title}</h2>
          <p className="modal__tagline">{movie.tagline}</p>
          <p className="modal__meta">
            {movie.year} | {movie.mediaType === 'tv' ? 'Series' : 'Movie'} |{' '}
            {movie.genres.join(', ') || 'Genre unknown'}
          </p>
          <p className="modal__meta">
            <FiClock /> {movie.runtime} | Rating: {movie.rating || 'N/A'}/10
          </p>
          <p className="modal__overview">{movie.overview}</p>

          <div className="modal__details">
            <p>
              <strong>Director:</strong> {movie.director || 'Unknown'}
            </p>
            <p>
              <strong>Main cast:</strong>{' '}
              {movie.cast.length ? movie.cast.join(', ') : 'Not listed'}
            </p>
            <p>
              <strong>Language:</strong> {movie.language} |{' '}
              <strong>Country:</strong> {movie.country}
            </p>
          </div>

          <div className="modal__actions">
            <button
              type="button"
              className={`watchlist-btn ${saved ? 'is-active' : ''}`}
              onClick={handleWatchlistClick}
            >
              <FiHeart /> {saved ? 'Remove from watchlist' : 'Add to watchlist'}
            </button>

            {movie.imdbId && (
              <a
                href={`https://www.imdb.com/title/${movie.imdbId}`}
                target="_blank"
                rel="noreferrer"
                className="link-button"
              >
                <FiExternalLink /> View on IMDb
              </a>
            )}

            {movie.homepage && (
              <a
                href={movie.homepage}
                target="_blank"
                rel="noreferrer"
                className="link-button"
              >
                <FiExternalLink /> Official site
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
