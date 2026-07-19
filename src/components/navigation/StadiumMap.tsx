'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { PointOfInterest } from '@/lib/types';

const DynamicLeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-canvas-soft-2 text-mute text-caption" role="status">
      <span>Loading interactive map...</span>
    </div>
  ),
});

/**
 * Stadium Map wrapper component.
 * Dynamically loads the Leaflet map (client-only) and displays
 * a detail panel for the currently selected point of interest.
 */
export default function StadiumMap() {
  const [selectedZone, setSelectedZone] = useState<PointOfInterest | null>(null);

  // Screen reader table representation of Leaflet Map POIs
  const points = [
    { id: 'gate-a', name: 'Gate A (North Entrance)', type: 'Gate', status: 'Entry point open' },
    { id: 'gate-b', name: 'Gate B (South Entrance)', type: 'Gate', status: 'Entry point open' },
    { id: 'concourse', name: 'Main Concourse', type: 'Concourse', status: 'Main concourse active' },
    { id: 'field', name: 'Pitch / Center', type: 'Field', status: 'Center pitch area' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.movraHighlightPOI = (id: string) => {
        const found = points.find((p) => p.id === id);
        if (found) {
          const latLngs: Record<string, { lat: number; lng: number; type: string; name: string }> = {
            'gate-a': { lat: 40.8138, lng: -74.0745, type: 'gate', name: 'Gate A (North Entrance)' },
            'gate-b': { lat: 40.8118, lng: -74.0745, type: 'gate', name: 'Gate B (South Entrance)' },
            'concourse': { lat: 40.8128, lng: -74.076, type: 'concourse', name: 'Main Concourse' },
            'field': { lat: 40.8128, lng: -74.0745, type: 'field', name: 'Pitch / Center' },
          };
          const coords = latLngs[id];
          if (coords) {
            setSelectedZone({
              id,
              name: coords.name,
              type: coords.type,
              lat: coords.lat,
              lng: coords.lng,
            });
          }
        }
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.movraHighlightPOI;
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-canvas p-4 text-ink">
      {/* Screen Reader Alternative for the Visual Leaflet Map (WCAG 2.1 AA) */}
      <div className="sr-only">
        <h4>Stadium Points of Interest List</h4>
        <table>
          <thead>
            <tr>
              <th scope="col">Location</th>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.type}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-body-md-strong text-ink">
          <MapPin size={18} className="text-link" aria-hidden="true" />
          Interactive Map
        </h3>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-caption text-body">
            <div className="w-2 h-2 rounded-full bg-canvas-soft-2 border border-hairline-strong" aria-hidden="true" /> Field
          </span>
          <span className="flex items-center gap-1 text-caption text-body">
            <div className="w-2 h-2 rounded-full bg-canvas border border-hairline-strong" aria-hidden="true" /> Seating
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
      <div className="mt-4 p-3 bg-canvas-soft border border-hairline rounded-md min-h-[80px]" aria-live="polite">
        {selectedZone ? (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-canvas border border-hairline text-link rounded-md shrink-0 shadow-sm" aria-hidden="true">
              <Info size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-ink text-body-sm-strong">{selectedZone.name}</h4>
              <p className="text-caption text-body mt-1 flex items-center gap-1">
                <Navigation size={12} aria-hidden="true" />
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
