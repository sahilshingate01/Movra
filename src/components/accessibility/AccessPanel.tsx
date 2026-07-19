'use client';

import React, { useMemo, memo, useEffect } from 'react';
import { Accessibility, Ear, Eye, HandHelping } from 'lucide-react';

/** Shape of an accessibility service entry (without the React icon to keep data serializable for memo). */
interface ServiceEntry {
  id: number;
  name: string;
  iconType: 'accessibility' | 'handHelping' | 'ear' | 'eye';
  status: string;
  location: string;
}

/** Static service data — defined outside component to avoid re-creation. */
const SERVICE_DATA: ServiceEntry[] = [
  { id: 1, name: 'Wheelchair Route', iconType: 'accessibility', status: 'Clear', location: 'Gate B to Sec 104' },
  { id: 2, name: 'Sensory Room', iconType: 'handHelping', status: 'Available', location: 'Level 2, Room 205' },
  { id: 3, name: 'Audio Description', iconType: 'ear', status: 'Active', location: 'Tune to FM 104.5' },
  { id: 4, name: 'Large Print Menus', iconType: 'eye', status: 'Available', location: 'All Concessions' },
];

/** Maps an icon type string to the corresponding Lucide icon element. */
function getServiceIcon(iconType: ServiceEntry['iconType']): React.ReactElement {
  switch (iconType) {
    case 'accessibility':
      return <Accessibility size={18} />;
    case 'handHelping':
      return <HandHelping size={18} />;
    case 'ear':
      return <Ear size={18} />;
    case 'eye':
      return <Eye size={18} />;
  }
}

/**
 * Accessibility Services panel.
 * Displays available accessibility amenities at the stadium including
 * wheelchair routes, sensory rooms, audio descriptions, and large print menus.
 */
const AccessPanel = memo(function AccessPanel() {
  // Memoize the services list to prevent unnecessary re-renders
  const services = useMemo(() => SERVICE_DATA, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.movraVenueState) window.movraVenueState = {};
      window.movraVenueState.accessibility = services.map(({ id, name, status, location }) => ({
        id,
        name,
        status,
        location,
      }));
    }
    return () => {
      if (typeof window !== 'undefined' && window.movraVenueState) {
        delete window.movraVenueState.accessibility;
      }
    };
  }, [services]);

  return (
    <div className="flex flex-col h-full bg-canvas p-4 text-ink">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-body-md-strong text-ink">
          <Accessibility size={18} className="text-violet" aria-hidden="true" />
          Accessibility Services
        </h3>
      </div>

      <div className="space-y-3" role="list" aria-label="Available accessibility services">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-3 bg-canvas-soft border border-hairline rounded-md flex items-center justify-between"
            role="listitem"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-canvas border border-hairline text-violet shadow-sm" aria-hidden="true">
                {getServiceIcon(service.iconType)}
              </div>
              <div>
                <p className="text-body-sm-strong text-ink">{service.name}</p>
                <p className="text-caption text-body">{service.location}</p>
              </div>
            </div>
            <div className="text-caption-mono font-medium text-link bg-canvas border border-hairline px-2 py-1 rounded-sm shadow-sm">
              {service.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default AccessPanel;
