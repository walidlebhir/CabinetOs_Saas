import { useCallback, useEffect, useState } from 'react';

import { getMyRendezvous } from '@/services/rendezvous/rendezvous.api';
import type { Rendezvous } from '@/types/rendezvous';

export function useRendezvous() {
  const [rendezvous, setRendezvous] = useState<Rendezvous[]>([]);
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
      const data = await getMyRendezvous();
      setRendezvous(data);
    } catch (e) {
      setError(
        (e as Error).message ?? 'Impossible de charger vos rendez-vous.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { rendezvous, loading, refreshing, error, reload: load };
}
