'use client';

import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle } from 'lucide-react';

interface ZoneData {
  id: string;
  name: string;
  density: number; // 0 to 100
  trend: 'up' | 'down' | 'stable';
}

export default function CrowdHeatmap() {
  const [zones, setZones] = useState<ZoneData[]>([
    { id: '1', name: 'Gate A (North)', density: 45, trend: 'stable' },
    { id: '2', name: 'Gate B (South)', density: 85, trend: 'up' },
    { id: '3', name: 'East Concourse', density: 60, trend: 'down' },
    { id: '4', name: 'West Concourse', density: 30, trend: 'stable' },
    { id: '5', name: 'Food Court 1', density: 92, trend: 'up' },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => {
        const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
        const newDensity = Math.max(0, Math.min(100, zone.density + change));
        
        return {
          ...zone,
          density: newDensity,
          trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable'
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getDensityColor = (density: number) => {
    if (density >= 85) return 'bg-error';
    if (density >= 60) return 'bg-warning';
    return 'bg-link';
  };

  const getDensityText = (density: number) => {
    if (density >= 85) return 'text-error';
    if (density >= 60) return 'text-warning-deep';
    return 'text-link-deep';
  };

  const highDensityZones = zones.filter(z => z.density >= 85);

  return (
    <div className="flex flex-col h-full bg-canvas p-4 text-ink">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-body-md-strong text-ink">
          <Users size={18} className="text-link" />
          Crowd Density
        </h3>
        <span className="text-caption-mono px-2 py-1 bg-canvas-soft border border-hairline rounded-sm text-body">
          Live Update
        </span>
      </div>

      {highDensityZones.length > 0 && (
        <div className="mb-4 p-2 bg-error-soft border border-error rounded-md flex items-start gap-2 animate-pulse">
          <AlertTriangle size={16} className="text-error shrink-0 mt-0.5" />
          <p className="text-caption text-error leading-tight">
            High congestion at: {highDensityZones.map(z => z.name).join(', ')}. Diverting traffic recommended.
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
        {zones.sort((a, b) => b.density - a.density).map(zone => (
          <div key={zone.id} className="p-3 bg-canvas-soft border border-hairline rounded-md">
            <div className="flex justify-between items-end mb-2">
              <span className="text-body-sm-strong text-ink">{zone.name}</span>
              <span className={`text-caption-mono font-bold ${getDensityText(zone.density)}`}>
                {zone.density}%
              </span>
            </div>
            
            {/* Progress bar container */}
            <div className="h-1.5 w-full bg-hairline rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-in-out ${getDensityColor(zone.density)}`}
                style={{ width: `${zone.density}%` }}
                role="progressbar"
                aria-valuenow={zone.density}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${zone.name} density`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
