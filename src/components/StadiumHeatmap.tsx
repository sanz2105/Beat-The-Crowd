import { useVenueData } from '../hooks/useVenueData';
import { useState } from 'react';

// Mapping of zone IDs to SVG coordinates (viewBox 800x500)
const zonePositions: Record<string, { x: number; y: number }> = {
  gate_a: { x: 400, y: 30 },
  gate_b: { x: 730, y: 250 },
  gate_c: { x: 400, y: 470 },
  gate_d: { x: 70, y: 250 },
  food_north: { x: 250, y: 80 },
  food_south: { x: 550, y: 420 },
  burger_zone: { x: 150, y: 180 },
  pizza_hub: { x: 650, y: 180 },
  rest_east: { x: 680, y: 350 },
  rest_west: { x: 120, y: 350 },
  vip_lounge: { x: 400, y: 150 },
  main_arena: { x: 400, y: 250 },
};

// Helper to map crowdLevel to Tailwind colors and animation classes
const levelMap = {
  low: { color: '#22C55E', animation: 'animate-pulse-low' }, // green
  medium: { color: '#F59E0B', animation: 'animate-pulse-medium' }, // amber
  high: { color: '#EF4444', animation: 'animate-pulse-high' }, // red
};

export default function StadiumHeatmap() {
  const { zones, loading, error } = useVenueData();
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; content: string }>({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  if (loading) return <div className="text-center py-4">Loading stadium data…</div>;
  if (error) return <div className="text-center py-4 text-danger">Error loading data</div>;

  // Convert zones object to an array for easier sorting / iteration
  const zoneArray = Object.entries(zones || {});

  const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>, zoneId: string) => {
    const zone = zones?.[zoneId];
    if (!zone) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const content = `
      <div class="p-2">
        <div class="font-medium">${zone.name}</div>
        <div class="flex items-center space-x-1 mt-1">
          <span class="px-2 py-0.5 rounded-full text-xs" style="background:${levelMap[zone.crowdLevel as keyof typeof levelMap].color};color:white;">
            ${zone.crowdLevel}
          </span>
          <span class="font-mono">Wait: ${zone.waitTime} min</span>
        </div>
      </div>
    `;
    setTooltip({ visible: true, x: rect.x + rect.width / 2, y: rect.y, content });
  };

  const handleMouseLeave = () => setTooltip({ ...tooltip, visible: false });

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* SVG Heatmap */}
      <svg viewBox="0 0 800 500" className="w-full h-auto">
        {/* Outer stadium oval */}
        <ellipse cx="400" cy="250" rx="380" ry="220" stroke="#0F172A" fill="rgba(15,23,42,0.3)" />
        {/* Pitch rectangle */}
        <rect x="150" y="120" width="500" height="260" fill="#0F3A20" />
        {/* Section labels */}
        <text x="400" y="70" textAnchor="middle" className="text-sm text-text-secondary">North Stand</text>
        <text x="400" y="470" textAnchor="middle" className="text-sm text-text-secondary">South Stand</text>
        <text x="70" y="250" textAnchor="middle" className="text-sm text-text-secondary" transform="rotate(-90 70 250)">West Stand</text>
        <text x="730" y="250" textAnchor="middle" className="text-sm text-text-secondary" transform="rotate(90 730 250)">East Stand</text>

        {/* Zones */}
        {zoneArray.map(([id, zone]) => {
          const pos = zonePositions[id];
          if (!pos) return null;
          const level = levelMap[zone.crowdLevel as keyof typeof levelMap];
          return (
            <g key={id}>
              {/* Outer pulsing ring */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={35}
                fill={level?.color}
                fillOpacity={0.3}
                className={level?.animation}
              />
              {/* Core marker */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={22}
                fill={level?.color}
                stroke="white"
                strokeWidth={2}
                onMouseEnter={(e) => handleMouseEnter(e, id)}
                onMouseLeave={handleMouseLeave}
              />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute left-4 bottom-4 flex space-x-4 text-sm text-text-secondary">
        <span className="flex items-center space-x-1">
          <span className="w-4 h-4 bg-[#22C55E] rounded-full block"></span>
          <span>Low</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-4 h-4 bg-[#F59E0B] rounded-full block"></span>
          <span>Moderate</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-4 h-4 bg-[#EF4444] rounded-full block"></span>
          <span>Congested</span>
        </span>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute bg-card-dark text-text-primary p-2 rounded shadow-lg pointer-events-none"
          style={{ top: tooltip.y - 80, left: tooltip.x - 60, width: 120 }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}
    </div>
  );
}
