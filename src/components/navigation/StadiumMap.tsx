'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';

interface Zone {
  id: string;
  name: string;
  path: string;
  type: 'seating' | 'field' | 'concourse' | 'gate' | 'amenity';
}

export default function StadiumMap() {
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // Simplified SVG paths for a stylized stadium map
  const zones: Zone[] = [
    { id: 'field', name: 'Pitch', type: 'field', path: 'M 100 100 L 300 100 L 300 250 L 100 250 Z' },
    { id: 'north-stand', name: 'North Stand', type: 'seating', path: 'M 50 50 L 350 50 L 300 100 L 100 100 Z' },
    { id: 'south-stand', name: 'South Stand', type: 'seating', path: 'M 100 250 L 300 250 L 350 300 L 50 300 Z' },
    { id: 'east-stand', name: 'East Stand', type: 'seating', path: 'M 300 100 L 350 50 L 350 300 L 300 250 Z' },
    { id: 'west-stand', name: 'West Stand', type: 'seating', path: 'M 50 50 L 100 100 L 100 250 L 50 300 Z' },
    { id: 'gate-a', name: 'Gate A (North)', type: 'gate', path: 'M 175 30 L 225 30 L 225 50 L 175 50 Z' },
    { id: 'gate-b', name: 'Gate B (South)', type: 'gate', path: 'M 175 300 L 225 300 L 225 320 L 175 320 Z' },
  ];

  const getFillColor = (type: string, isSelected: boolean) => {
    if (isSelected) return 'var(--color-link-bg-soft)'; 
    switch (type) {
      case 'field': return 'var(--color-canvas-soft-2)'; 
      case 'seating': return 'var(--color-canvas)'; 
      case 'gate': return 'var(--color-canvas-soft-2)'; 
      default: return 'var(--color-canvas)'; 
    }
  };

  return (
    <div className="flex flex-col h-full bg-canvas p-4 text-ink">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-body-md-strong text-ink">
          <MapPin size={18} className="text-link" />
          Interactive Map
        </h3>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-caption text-body">
            <div className="w-2 h-2 rounded-full bg-canvas-soft-2 border border-hairline-strong" /> Field
          </span>
          <span className="flex items-center gap-1 text-caption text-body">
            <div className="w-2 h-2 rounded-full bg-canvas border border-hairline-strong" /> Seating
          </span>
        </div>
      </div>

      <div className="flex-1 relative border border-hairline rounded-md bg-canvas-soft overflow-hidden flex items-center justify-center p-4 shadow-inner">
        <svg viewBox="0 0 400 350" className="w-full h-full max-w-[300px]" aria-label="Stadium interactive map">
          {zones.map((zone) => (
            <path
              key={zone.id}
              d={zone.path}
              fill={getFillColor(zone.type, selectedZone?.id === zone.id)}
              stroke={selectedZone?.id === zone.id ? 'var(--color-link)' : 'var(--color-hairline-strong)'}
              strokeWidth="2"
              className="cursor-pointer transition-colors duration-200 hover:opacity-80 hover:stroke-ink"
              onClick={() => setSelectedZone(zone)}
              aria-label={zone.name}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedZone(zone);
                }
              }}
            />
          ))}
        </svg>
      </div>

      {/* Selected Zone Info Panel */}
      <div className="mt-4 p-3 bg-canvas-soft border border-hairline rounded-md min-h-[80px]">
        {selectedZone ? (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-canvas border border-hairline text-link rounded-md shrink-0 shadow-sm">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-ink text-body-sm-strong">{selectedZone.name}</h4>
              <p className="text-caption text-body mt-1 flex items-center gap-1">
                <Navigation size={12} />
                {selectedZone.type === 'gate' ? 'Entry point open' : 'Main concourse active'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-mute text-caption italic">
            Select a zone on the map for details
          </div>
        )}
      </div>
    </div>
  );
}
