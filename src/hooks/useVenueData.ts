import { useState, useEffect } from 'react';
import { Zone, subscribeToZones, seedVenueData } from '../services/venueData';

export const useVenueData = () => {
  const [zones, setZones] = useState<Record<string, Zone> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;

    const init = async () => {
      try {
        // Subscribe to real-time updates
        unsubscribe = subscribeToZones((data) => {
          if (!data || Object.keys(data).length === 0) {
            // Seed data if empty
            seedVenueData();
          } else {
            setZones(data);
            setLoading(false);
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch venue data");
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { zones, loading, error };
};
