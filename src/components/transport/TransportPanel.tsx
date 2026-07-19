'use client';

import React, { useMemo, memo } from 'react';
import { Train, Bus, Car, Clock } from 'lucide-react';
import type { TransportOption } from '@/lib/types';

/**
 * Returns the icon component for a given transport type.
 * @param type - The transport mode identifier.
 */
function getTransportIcon(type: string): React.ReactElement {
  switch (type) {
    case 'train':
      return <Train size={18} />;
    case 'bus':
      return <Bus size={18} />;
    case 'car':
      return <Car size={18} />;
    default:
      return <Clock size={18} />;
  }
}

/**
 * Transit Hub panel displaying real-time transport options near the stadium.
 * Shows train, bus, and rideshare availability with estimated wait times.
 */
const TransportPanel = memo(function TransportPanel() {
  // Memoize static transport data to prevent re-creation on re-render
  const options: TransportOption[] = useMemo(
    () => [
      {
        id: '1',
        type: 'train',
        name: 'Metro Red Line',
        status: 'On Time',
        next: '5 mins',
        color: 'text-error',
        bg: 'bg-error-soft',
      },
      {
        id: '2',
        type: 'bus',
        name: 'Stadium Express Bus',
        status: 'Delayed',
        next: '12 mins',
        color: 'text-warning-deep',
        bg: 'bg-warning-soft',
      },
      {
        id: '3',
        type: 'car',
        name: 'Rideshare Zone C',
        status: 'High Demand',
        next: 'Wait: 15m',
        color: 'text-link-deep',
        bg: 'bg-link-bg-soft',
      },
    ],
    []
  );

  return (
    <div className="flex flex-col h-full bg-canvas p-4 text-ink">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2 text-body-md-strong text-ink">
          <Train size={18} className="text-link" aria-hidden="true" />
          Transit Hub
        </h3>
      </div>

      <div className="space-y-3">
        {options.map((opt) => (
          <div
            key={opt.id}
            className="p-3 bg-canvas-soft border border-hairline rounded-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${opt.bg} ${opt.color}`} aria-hidden="true">
                {getTransportIcon(opt.type)}
              </div>
              <div>
                <p className="text-body-sm-strong text-ink">{opt.name}</p>
                <p
                  className={`text-caption-mono ${
                    opt.status === 'Delayed' || opt.status === 'High Demand'
                      ? 'text-warning-deep'
                      : 'text-body'
                  }`}
                >
                  {opt.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-caption text-body mb-1">Next Departure</p>
              <p className="text-body-sm-strong text-ink">{opt.next}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TransportPanel;
