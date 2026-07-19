'use client';

import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Users, AlertTriangle } from 'lucide-react';
import type { ZoneData } from '@/lib/types';
import {
  CROWD_UPDATE_INTERVAL_MS,
  HIGH_DENSITY_THRESHOLD,
  MODERATE_DENSITY_THRESHOLD,
} from '@/lib/constants';

/**
 * Returns the Tailwind background color class for a given crowd density level.
 * @param density - Density percentage (0–100).
 */
function getDensityColor(density: number): string {
  if (density >= HIGH_DENSITY_THRESHOLD) return 'bg-error';
  if (density >= MODERATE_DENSITY_THRESHOLD) return 'bg-warning';
  return 'bg-link';
}

/**
 * Returns the Tailwind text color class for a given crowd density level.
 * @param density - Density percentage (0–100).
 */
function getDensityText(density: number): string {
  if (density >= HIGH_DENSITY_THRESHOLD) return 'text-error';
  if (density >= MODERATE_DENSITY_THRESHOLD) return 'text-warning-deep';
  return 'text-link-deep';
}

/** Initial zone data for the crowd density simulation. */
const INITIAL_ZONES: ZoneData[] = [
  { id: '1', name: 'Gate A (North)', density: 45, trend: 'stable' },
  { id: '2', name: 'Gate B (South)', density: 85, trend: 'up' },
  { id: '3', name: 'East Concourse', density: 60, trend: 'down' },
  { id: '4', name: 'West Concourse', density: 30, trend: 'stable' },
  { id: '5', name: 'Food Court 1', density: 92, trend: 'up' },
];

/**
 * Real-time crowd density heatmap widget.
 * Displays simulated crowd density levels per stadium zone with
 * visual alerts for high-congestion areas.
 */
const CrowdHeatmap = memo(function CrowdHeatmap() {
  const [zones, setZones] = useState<ZoneData[]>(INITIAL_ZONES);

  // Simulate real-time density updates
  const updateZones = useCallback(() => {
    setZones((prev) =>
      prev.map((zone) => {
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const newDensity = Math.max(0, Math.min(100, zone.density + change));
        return {
          ...zone,
          density: newDensity,
          trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
        };
      })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(updateZones, CROWD_UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [updateZones]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.movraVenueState) window.movraVenueState = {};
      window.movraVenueState.crowd = zones;
    }
    return () => {
      if (typeof window !== 'undefined' && window.movraVenueState) {
        delete window.movraVenueState.crowd;
      }
    };
  }, [zones]);

  // Memoize sorted zones and high-density filter
  const sortedZones = useMemo(
    () => [...zones].sort((a, b) => b.density - a.density),
    [zones]
  );

  const highDensityZones = useMemo(
    () => zones.filter((z) => z.density >= HIGH_DENSITY_THRESHOLD),
    [zones]
  );

  return (
    <div className="flex flex-col h-full bg-canvas p-4 text-ink">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-body-md-strong text-ink">
          <Users size={18} className="text-link" aria-hidden="true" />
          Crowd Density
        </h3>
        <span className="text-caption-mono px-2 py-1 bg-canvas-soft border border-hairline rounded-sm text-body">
          Live Update
        </span>
      </div>

      {highDensityZones.length > 0 && (
        <div
          className="mb-4 p-2 bg-error-soft border border-error rounded-md flex items-start gap-2 animate-pulse"
          role="alert"
        >
          <AlertTriangle size={16} className="text-error shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-caption text-error leading-tight">
            High congestion at: {highDensityZones.map((z) => z.name).join(', ')}. Diverting traffic
            recommended.
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
        {sortedZones.map((zone) => (
          <div key={zone.id} className="p-3 bg-canvas-soft border border-hairline rounded-md">
            <div className="flex justify-between items-end mb-2">
              <span className="text-body-sm-strong text-ink">{zone.name}</span>
              <span className={`text-caption-mono font-bold ${getDensityText(zone.density)}`}>
                {zone.density}%
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="h-1.5 w-full bg-hairline rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={zone.density}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${zone.name} crowd density at ${zone.density} percent`}
            >
              <div
                className={`h-full transition-all duration-1000 ease-in-out ${getDensityColor(zone.density)}`}
                style={{ width: `${zone.density}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CrowdHeatmap;
