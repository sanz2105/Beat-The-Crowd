import type { Zone } from "./venueData";

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  suggestion?: string;
  timestamp: string;
  zoneId?: string;
}

export const alertsEngine = (zones: Record<string, Zone>): Alert[] => {
  const alerts: Alert[] = [];
  const zoneList = Object.entries(zones).map(([id, z]) => ({ id, ...z }));

  zoneList.forEach(zone => {
    // Rule 1: Severe Congestion
    if (zone.crowdLevel === 'high' && zone.waitTime > 15) {
      alerts.push({
        id: `crit-${zone.id}-${Date.now()}`,
        type: 'critical',
        message: `🚨 ${zone.name} is severely congested (${zone.waitTime} min wait)`,
        suggestion: `Avoid this area if possible.`,
        timestamp: new Date().toLocaleTimeString(),
        zoneId: zone.id
      });
    }
    // Rule 2: Warning with Alternative
    else if (zone.crowdLevel === 'high') {
      const alt = zoneList
        .filter(z => z.type === zone.type && z.id !== zone.id && z.isOpen)
        .sort((a, b) => a.waitTime - b.waitTime)[0];

      alerts.push({
        id: `warn-${zone.id}-${Date.now()}`,
        type: 'warning',
        message: `⚠️ ${zone.name} getting crowded.`,
        suggestion: alt ? `Try ${alt.name} instead (${alt.waitTime} min wait).` : 'Consider waiting 10 mins.',
        timestamp: new Date().toLocaleTimeString(),
        zoneId: zone.id
      });
    }
    // Rule 3: Closure
    else if (!zone.isOpen && zone.type === 'gate') {
       alerts.push({
        id: `info-${zone.id}-${Date.now()}`,
        type: 'info',
        message: `ℹ️ ${zone.name} is currently closed.`,
        suggestion: "Use Gate C (no wait).",
        timestamp: new Date().toLocaleTimeString(),
        zoneId: zone.id
      });
    }
  });

  return alerts;
};
