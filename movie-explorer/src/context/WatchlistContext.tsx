import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { MovieSummary } from '../types/movie';

interface WatchlistContextValue {
  watchlist: MovieSummary[];
  addToWatchlist: (movie: MovieSummary) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
}

// Central place to read/update the user's saved movies.
const WatchlistContext = createContext<WatchlistContextValue | undefined>(undefined);

export const WatchlistProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [watchlist, setWatchlist] = useLocalStorage<MovieSummary[]>(
    'movie-explorer-watchlist',
    [],
  );

  const addToWatchlist = useCallback(
    (movie: MovieSummary) => {
      setWatchlist((prev) => {
        if (prev.find((item) => item.id === movie.id)) {
          return prev;
        }
        return [...prev, movie];
      });
    },
    [setWatchlist],
  );

  const removeFromWatchlist = useCallback(
    (id: number) => {
      setWatchlist((prev) => prev.filter((movie) => movie.id !== id));
    },
    [setWatchlist],
  );

  const isInWatchlist = useCallback(
    (id: number) => watchlist.some((movie) => movie.id === id),
    [watchlist],
  );

  const value = useMemo(
    () => ({
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
    }),
    [watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used inside WatchlistProvider');
  }
  return context;
};
