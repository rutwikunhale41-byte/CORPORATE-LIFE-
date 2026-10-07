import React from 'react';
import { MapPin, Navigation, Compass, Clock } from 'lucide-react';

export const MapsApp: React.FC = () => {
  const locations = [
    { name: 'Nexora Global Tech Hub', type: 'Workplace', area: 'Hinjawadi IT Park, Pune', travelTime: '25 mins' },
    { name: 'Baner Flat', type: 'Home', area: 'Baner High Street, Pune', travelTime: '0 mins' },
    { name: 'Cafe Goodluck', type: 'Coffee & Date Spot', area: 'FC Road, Deccan Gymkhana', travelTime: '15 mins' },
    { name: 'Sinhagad Fort Base', type: 'Weekend Trek Spot', area: 'Donje Village, Haveli', travelTime: '45 mins' },
    { name: 'Monalisa Display Art Gallery', type: 'Art Gallery', area: 'Koregaon Park, Pune', travelTime: '20 mins' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-100">Google Maps • Pune & Vicinity</h2>
            <p className="text-[10px] text-slate-400">Navigation & Saved Spots</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {locations.map((loc, i) => (
          <div key={i} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-950 text-blue-400 border border-blue-800 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">{loc.name}</h4>
                <p className="text-[10px] text-slate-400">{loc.type} • {loc.area}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-blue-400">{loc.travelTime}</div>
              <div className="text-[9px] text-slate-500">Drive Time</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
