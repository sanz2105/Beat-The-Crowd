import { useState, useEffect, useMemo } from 'react';
import { useVenueData } from '../hooks/useVenueData';
import type { Zone } from '../services/venueData';

export interface EmergencyState {
  isActive: boolean;
  congestedZone: (Zone & { id: string }) | null;
  safestExits: (Zone & { id: string })[];
}

/**
 * Custom hook to monitor stadium zones for overcrowding.
 * Triggers when any zone exceeds 85% capacity.
 */
export const useEmergencyMode = () => {
  const { zones, loading, error } = useVenueData();
  const [isDismissed, setIsDismissed] = useState(false);

  // Derived state for emergency logic
  const emergencyState = useMemo((): EmergencyState => {
    if (!zones || isDismissed) {
      return { isActive: false, congestedZone: null, safestExits: [] };
    }

    const zoneList = Object.entries(zones).map(([id, z]) => ({ id, ...z }));
    
    // Feature 1 Logic: Find first zone > 85% capacity
    const congested = zoneList.find(z => z.capacity > 85);

    if (congested) {
      // Find 3 safest gates (lowest capacity)
      const gates = zoneList
        .filter(z => z.type === 'gate' && z.isOpen)
        .sort((a, b) => a.capacity - b.capacity)
        .slice(0, 3);

      return {
        isActive: true,
        congestedZone: congested,
        safestExits: gates
      };
    }

    return { isActive: false, congestedZone: null, safestExits: [] };
  }, [zones, isDismissed]);

  // Reset dismissal if all zones become safe
  useEffect(() => {
    if (!zones) return;
    const anyHigh = Object.values(zones).some(z => z.capacity > 85);
    if (!anyHigh && isDismissed) {
      setIsDismissed(false);
    }
  }, [zones, isDismissed]);

  const dismissEmergency = () => setIsDismissed(true);

  return {
    ...emergencyState,
    loading,
    error,
    dismissEmergency
  };
};
