import { useCallback, useEffect, useState } from 'react';

import { getCabinets } from '@/services/cabinet/cabinet.api';
import type { CabinetHome } from '@/types/cabinet';

export function useCabinets() {
  const [cabinets, setCabinets] = useState<CabinetHome[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getCabinets();
      setCabinets(data);
    } catch (e) {
      setError((e as Error).message ?? 'Impossible de charger les cabinets.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { cabinets, loading, refreshing, error, reload: load };
}
