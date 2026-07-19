'use client';

import React from 'react';
import { Accessibility, Ear, Eye, HandHelping } from 'lucide-react';

export default function AccessPanel() {
  const services = [
    { id: 1, name: 'Wheelchair Route', icon: <Accessibility size={18} />, status: 'Clear', location: 'Gate B to Sec 104' },
    { id: 2, name: 'Sensory Room', icon: <HandHelping size={18} />, status: 'Available', location: 'Level 2, Room 205' },
    { id: 3, name: 'Audio Description', icon: <Ear size={18} />, status: 'Active', location: 'Tune to FM 104.5' },
    { id: 4, name: 'Large Print Menus', icon: <Eye size={18} />, status: 'Available', location: 'All Concessions' },
  ];

  return (
    <div className="flex flex-col h-full bg-canvas p-4 text-ink">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-body-md-strong text-ink">
          <Accessibility size={18} className="text-violet" />
          Accessibility Services
        </h3>
      </div>

      <div className="space-y-3">
        {services.map(service => (
          <div key={service.id} className="p-3 bg-canvas-soft border border-hairline rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-canvas border border-hairline text-violet shadow-sm">
                {service.icon}
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
}
