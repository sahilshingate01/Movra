'use client';

import React, { useMemo, useCallback, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { PointOfInterest } from '@/lib/types';
import { STADIUM_CENTER, MAP_DEFAULT_ZOOM } from '@/lib/constants';

/** Re-export PointOfInterest for backward compatibility. */
export type { PointOfInterest };

interface LeafletMapProps {
  /** Callback fired when a user selects a map marker. */
  onZoneSelect: (zone: PointOfInterest) => void;
  /** The currently selected point of interest, if any. */
  selectedZone: PointOfInterest | null;
}

/** Static points of interest for MetLife Stadium (FIFA 2026 venue). */
const POINTS_OF_INTEREST: PointOfInterest[] = [
  { id: 'gate-a', name: 'Gate A (North Entrance)', lat: 40.8138, lng: -74.0745, type: 'gate' },
  { id: 'gate-b', name: 'Gate B (South Entrance)', lat: 40.8118, lng: -74.0745, type: 'gate' },
  { id: 'concourse', name: 'Main Concourse', lat: 40.8128, lng: -74.076, type: 'concourse' },
  { id: 'field', name: 'Pitch / Center', lat: 40.8128, lng: -74.0745, type: 'field' },
];

/**
 * Interactive Leaflet map component for stadium wayfinding.
 * Renders markers for stadium points of interest with keyboard accessibility.
 */
const LeafletMap = memo(function LeafletMap({ onZoneSelect, selectedZone }: LeafletMapProps) {
  // Memoize icon creation to avoid instantiating new L.DivIcon objects every render
  const createIcon = useCallback(
    (type: string, isSelected: boolean) => {
      const color = isSelected
        ? 'var(--color-link)'
        : type === 'gate'
          ? 'var(--color-warning)'
          : 'var(--color-ink)';
      return new L.DivIcon({
        className: 'bg-transparent border-0',
        html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3); transition: all 0.2s;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
    },
    []
  );

  // Memoize markers to avoid re-creating event handler closures
  const markers = useMemo(
    () =>
      POINTS_OF_INTEREST.map((p) => ({
        ...p,
        icon: createIcon(p.type, selectedZone?.id === p.id),
      })),
    [selectedZone?.id, createIcon]
  );

  const handleMarkerClick = useCallback(
    (point: PointOfInterest) => {
      onZoneSelect(point);
    },
    [onZoneSelect]
  );

  return (
    <MapContainer
      center={STADIUM_CENTER}
      zoom={MAP_DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      {markers.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          title={p.name}
          alt={p.name}
          keyboard={true}
          icon={p.icon}
          eventHandlers={{
            click: () => handleMarkerClick(p),
            keypress: (e) => {
              if (e.originalEvent.key === 'Enter' || e.originalEvent.key === ' ') {
                handleMarkerClick(p);
              }
            },
          }}
        >
          <Popup>
            <div className="p-1">
              <h4 className="font-semibold text-ink text-body-sm-strong">{p.name}</h4>
              <p className="text-caption text-body mt-1">Category: {p.type}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
});

export default LeafletMap;
