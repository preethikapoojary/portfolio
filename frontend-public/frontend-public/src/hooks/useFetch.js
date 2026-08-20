import { useEffect, useState, useCallback } from 'react';

/**
 * Wraps any API call with loading/error/data state. Crucially, a failed
 * request (e.g. a Phase 2 endpoint that doesn't exist on the backend yet)
 * resolves to an empty/error state rather than throwing and breaking the
 * page — this is what lets the public site be fully deployable today, with
 * sections lighting up automatically as their backend routes ship.
 */
function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}

export default useFetch;
