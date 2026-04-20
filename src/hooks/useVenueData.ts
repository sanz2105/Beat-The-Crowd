import { useState, useEffect } from 'react';
import type { Zone } from '../services/venueData';
import { subscribeToZones, seedVenueData, initialZones } from '../services/venueData';

export const useVenueData = () => {
  const [zones, setZones] = useState<Record<string, Zone> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: () => void;
    let fallbackTimer: ReturnType<typeof setTimeout>;

    const init = async () => {
      try {
        // Fallback timer: If Firebase is totally unresponsive or unconfigured
        // after 3 seconds, we force the UI to load with local mock data.
        fallbackTimer = setTimeout(() => {
          if (loading) {
            console.warn("Firebase timeout: Using local fallback data.");
            setZones(initialZones);
            setLoading(false);
            setError("Using offline mode (Firebase unreachable)");
          }
        }, 3000);

        unsubscribe = subscribeToZones(async (data) => {
          if (!data || Object.keys(data).length === 0) {
            console.log("No venue data found in Firebase, attempting to seed...");
            try {
              await seedVenueData();
              // If seed fails silently (e.g. permission denied but no throw),
              // the fallback timer will catch it.
            } catch (err) {
              console.error("Seed failed, using local data", err);
              setZones(initialZones);
              setLoading(false);
              clearTimeout(fallbackTimer);
            }
          } else {
            setZones(data);
            setLoading(false);
            clearTimeout(fallbackTimer);
          }
        });
      } catch (err) {
        console.error("Firebase init failed:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch venue data");
        // Fallback to local data on hard crash
        setZones(initialZones);
        setLoading(false);
      }
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
      if (fallbackTimer) clearTimeout(fallbackTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { zones, loading, error };
};
