import { useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import type { MovieDetails } from '../types/movie';
import { getMovieDetails } from '../api/movies';
import { MovieGrid } from '../components/MovieGrid';
import { MovieDetailsModal } from '../components/MovieDetailsModal';

// The watchlist is read-only here because all add/remove logic lives in the context.
export const WatchlistPage = () => {
  const { watchlist } = useWatchlist();
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  // Reuse the same details modal flow as the home page.
  const handleSelect = async (movie: typeof watchlist[number]) => {
    setIsLoadingDetails(true);
    setDetailsError('');
    setMovieDetails(null);
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
      setIsLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setMovieDetails(null);
    setDetailsError('');
  };

  return (
    <div className="page">
      <h1>My Watchlist</h1>
      <p className="hero-message">
        Your saved movies stay here thanks to localStorage. Remove any title by
        clicking the heart icon on its card.
      </p>

      {watchlist.length === 0 ? (
        <p className="empty-state">
          Your watchlist is empty. Browse movies on the home page and tap the
          heart to save them for later.
        </p>
      ) : (
        <MovieGrid
          movies={watchlist}
          isLoading={false}
          onSelect={handleSelect}
          emptyMessage=""
        />
      )}

      {isLoadingDetails && (
        <div className="modal-overlay loading">
          <div className="modal loading-card">
            <p>Loading details...</p>
          </div>
        </div>
      )}

      {movieDetails && (
        <MovieDetailsModal movie={movieDetails} onClose={closeModal} />
      )}

      {detailsError && <p className="error-message">{detailsError}</p>}
    </div>
  );
};
