import { useState, useCallback, useEffect } from "react";
import useDebounce from "./useDebounce";

interface UseSearchOptions<T> {
  debounceDelay?: number;
  minSearchLength?: number;
  onSearch: (query: string) => Promise<T[]>;
}

export function useSearch<T>({
  debounceDelay = 500,
  minSearchLength = 2,
  onSearch,
}: UseSearchOptions<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchCount, setSearchCount] = useState(0);
  const [lastSuccessfulQuery, setLastSuccessfulQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, debounceDelay);

  const performSearch = useCallback(
    async (query: string) => {
      if (query.length < minSearchLength) {
        setSearchResults([]);
        setError(null);
        return;
      }

      // Don't search if we've already searched for this exact query
      if (query === lastSuccessfulQuery) {
        return;
      }

      // Don't search if we've already searched twice
      if (searchCount >= 2) {
        return;
      }

      setIsSearching(true);
      setError(null);

      try {
        const results = await onSearch(query);
        setSearchResults(results);
        setLastSuccessfulQuery(query);
        setSearchCount((prev) => prev + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [minSearchLength, onSearch, lastSuccessfulQuery, searchCount]
  );

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery, performSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
    setSearchCount(0);
    setLastSuccessfulQuery("");
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    isSearching,
    searchResults,
    error,
    clearSearch,
  };
}
