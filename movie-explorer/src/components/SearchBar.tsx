import { useMemo } from 'react';
import type { FormEvent } from 'react';
import { FiLoader, FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  recentSearches: string[];
  onSelectRecent: (value: string) => void;
  placeholder?: string;
}

/**
 * Renders the hero search input plus helpful recent-search chips.
 * Keeping this component dumb (stateless) makes it easier to follow.
 */
export const SearchBar = ({
  query,
  onQueryChange,
  onSearch,
  isLoading,
  recentSearches,
  onSelectRecent,
  placeholder = 'Search for a movie or show...',
}: SearchBarProps) => {
  const filteredSuggestions = useMemo(() => {
    if (!query) return recentSearches;
    return recentSearches.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase()),
    );
  }, [recentSearches, query]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <section className="search-bar">
      <form onSubmit={handleSubmit} className="search-bar__form">
        <FiSearch className="search-bar__icon" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Search movies"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <FiLoader className="spin" /> Searching...
            </>
          ) : (
            'Search'
          )}
        </button>
      </form>

      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <p>Recent:</p>
          <div className="recent-searches__chips">
            {filteredSuggestions.map((item) => (
              <button
                key={item}
                type="button"
                className="chip"
                onClick={() => onSelectRecent(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
