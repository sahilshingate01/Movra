'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export interface PointOfInterest {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
}

interface LeafletMapProps {
  onZoneSelect: (zone: PointOfInterest) => void;
  selectedZone: PointOfInterest | null;
}

const pointsOfInterest = [
  { id: 'gate-a', name: 'Gate A (North Entrance)', lat: 40.8138, lng: -74.0745, type: 'gate' },
  { id: 'gate-b', name: 'Gate B (South Entrance)', lat: 40.8118, lng: -74.0745, type: 'gate' },
  { id: 'concourse', name: 'Main Concourse', lat: 40.8128, lng: -74.0760, type: 'concourse' },
  { id: 'field', name: 'Pitch / Center', lat: 40.8128, lng: -74.0745, type: 'field' },
];

export default function LeafletMap({ onZoneSelect, selectedZone }: LeafletMapProps) {
  // Center on MetLife Stadium (New York/New Jersey 2026 Venue)
  
  const createIcon = (type: string, isSelected: boolean) => {
    const color = isSelected ? 'var(--color-link)' : (type === 'gate' ? 'var(--color-warning)' : 'var(--color-ink)');
    return new L.DivIcon({
      className: 'bg-transparent border-0',
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3); transition: all 0.2s;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  return (
    <MapContainer 
      center={[40.8128, -74.0745]} 
      zoom={16} 
      style={{ height: '100%', width: '100%', zIndex: 0 }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {pointsOfInterest.map((p) => (
        <Marker 
          key={p.id} 
          position={[p.lat, p.lng]}
          icon={createIcon(p.type, selectedZone?.id === p.id)}
          eventHandlers={{
            click: () => onZoneSelect(p)
          }}
        >
        </Marker>
      ))}
    </MapContainer>
  );
}
