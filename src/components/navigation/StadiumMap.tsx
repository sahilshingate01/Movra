'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import dynamic from 'next/dynamic';
import { PointOfInterest } from './LeafletMap';

const DynamicLeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-canvas-soft-2 text-mute text-caption">
      Loading interactive map...
    </div>
  ),
});

export default function StadiumMap() {
  const [selectedZone, setSelectedZone] = useState<PointOfInterest | null>(null);

  // Map points of interest are now defined inside the LeafletMap component
  // for geographic coordinates.

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

      <div className="flex-1 relative border border-hairline rounded-md bg-canvas-soft overflow-hidden p-0 shadow-inner min-h-[250px]">
        <DynamicLeafletMap 
          selectedZone={selectedZone}
          onZoneSelect={setSelectedZone}
        />
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
