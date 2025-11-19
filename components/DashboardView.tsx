import React from 'react';
import { PlaySession, MenuItem, Car } from '../types';
import { PlusIcon } from './Icons';

interface DashboardViewProps {
  activeSessions: PlaySession[];
  availableZones: string[];
  onStartSession: (zoneId: string) => void;
  onAddOrder: (session: PlaySession) => void;
  onEndSession: (session: PlaySession) => void;
  now: number;
  menuItems: MenuItem[];
  cars: Car[];
}


const DashboardView: React.FC<DashboardViewProps> = ({ activeSessions, availableZones, onStartSession, onAddOrder, onEndSession, now, menuItems, cars }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6" style={{fontFamily:'Inter, Arial, sans-serif'}}>
      {/* Phiên đang chơi */}
      <h2 className="text-2xl font-bold text-cyan-400 mb-2" style={{fontWeight:700, letterSpacing:'-0.5px'}}>Phiên đang chơi ({activeSessions.length})</h2>
      <div className="w-full border-b border-[#22304d] mb-4"></div>
      <div className="bg-[#19233a] rounded-[14px] p-6 mb-8 min-h-[90px] flex items-center justify-center border border-[#22304d] shadow" style={{boxShadow:'0 2px 8px 0 #10192b0a'}}>
        {activeSessions.length === 0 ? (
          <span className="text-gray-400 text-base font-medium">Không có phiên nào đang hoạt động.</span>
        ) : (
          <div className="w-full">{/* TODO: render session list */}</div>
        )}
      </div>

      {/* Khu vực trống */}
      <h2 className="text-2xl font-bold text-cyan-400 mb-2" style={{fontWeight:700, letterSpacing:'-0.5px'}}>Khu vực trống ({availableZones.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 md:gap-6">
        {availableZones.map(zone => (
          <button
            key={zone}
            className="flex flex-col items-center justify-center border border-dashed border-[#3bc6e9] rounded-lg p-4 bg-[#19233a] hover:bg-cyan-900/30 transition min-h-[100px] shadow-sm"
            style={{boxShadow:'0 2px 8px 0 #10192b0a', borderWidth:1, borderStyle:'dashed'}}
            onClick={() => onStartSession(zone)}
          >
            <PlusIcon className="w-6 h-6 text-gray-300 mb-1" />
            <span className="font-semibold text-white text-[15px] mt-1" style={{fontWeight:600, letterSpacing:'-0.2px'}}>{zone}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
