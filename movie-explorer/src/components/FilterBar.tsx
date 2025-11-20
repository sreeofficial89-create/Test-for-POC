import type { Genre, MediaTypeFilter, SortOption } from '../types/movie';

type FilterValues = {
  year: string;
  mediaType: MediaTypeFilter;
  genreId: number | null;
  sortBy: SortOption;
};

interface FilterBarProps extends FilterValues {
  genres: Genre[];
  onChange: (changes: Partial<FilterValues>) => void;
}

/**
 * Small filter toolbar that lets users narrow down the movie list and sort it.
 * We keep the logic in the page component and only emit the new values here.
 */
export const FilterBar = ({
  year,
  mediaType,
  genreId,
  sortBy,
  genres,
  onChange,
}: FilterBarProps) => {
  const handleChange = (key: keyof FilterValues, value: string | number | null) => {
    onChange({ [key]: value } as Partial<FilterValues>);
  };

  return (
    <section className="filter-bar">
      <div className="filter">
        <label htmlFor="year">Year</label>
        <input
          id="year"
          type="text"
          inputMode="numeric"
          maxLength={4}
          placeholder="e.g. 2024"
          value={year}
          onChange={(event) => handleChange('year', event.target.value)}
        />
      </div>

      <div className="filter">
        <label htmlFor="type">Type</label>
        <select
          id="type"
          value={mediaType}
          onChange={(event) =>
            handleChange('mediaType', event.target.value as MediaTypeFilter)
          }
        >
          <option value="all">All</option>
          <option value="movie">Movie</option>
          <option value="tv">Series</option>
        </select>
      </div>

      <div className="filter">
        <label htmlFor="genre">Genre</label>
        <select
          id="genre"
          value={genreId ?? ''}
          onChange={(event) =>
            handleChange(
              'genreId',
              event.target.value ? Number(event.target.value) : null,
            )
          }
        >
          <option value="">All genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter">
        <label htmlFor="sort">Sort by</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(event) =>
            handleChange('sortBy', event.target.value as SortOption)
          }
        >
          <option value="rating_desc">Rating (High -&gt; Low)</option>
          <option value="rating_asc">Rating (Low -&gt; High)</option>
          <option value="release_desc">Release (New -&gt; Old)</option>
          <option value="release_asc">Release (Old -&gt; New)</option>
        </select>
      </div>
    </section>
  );
};
