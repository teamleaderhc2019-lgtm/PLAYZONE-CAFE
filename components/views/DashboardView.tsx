import React from 'react';
import { PlaySession, MenuItem, Car, BillingConfig } from '../../types';
import { PlusIcon } from '../Icons';
import SessionCard from '../common/SessionCard';

const DashboardView: React.FC<{
    sessions: PlaySession[];
    availableZones: string[];
    onOpenStartSessionModal: (zoneId: string) => void;
    onOpenOrderModal: (session: PlaySession) => void;
    onOpenCheckoutModal: (session: PlaySession) => void;
    now: number;
    menuItems: MenuItem[];
    cars: Car[];
    billingConfig: BillingConfig;
}> = ({ sessions, availableZones, onOpenStartSessionModal, onOpenOrderModal, onOpenCheckoutModal, now, menuItems, cars, billingConfig }) => (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">Phiên đang chơi ({sessions.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sessions.map(session => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        now={now}
                        onAddOrder={onOpenOrderModal}
                        onEndSession={onOpenCheckoutModal}
                        menuItems={menuItems}
                        cars={cars}
                        billingConfig={billingConfig}
                    />
                ))}
            </div>
        </div>

        {availableZones.length > 0 && (
            <div>
                <h2 className="text-xl font-semibold text-cyan-400 mb-4">Khu vực trống ({availableZones.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {availableZones.map(zoneId => (
                        <button
                            key={zoneId}
                            onClick={() => onOpenStartSessionModal(zoneId)}
                            className="group relative flex flex-col items-center justify-center h-32 rounded-lg border border-dashed border-gray-600 hover:border-cyan-500 hover:bg-gray-800/50 transition-all duration-200"
                        >
                            <div className="mb-2 p-2 rounded-full bg-gray-800 group-hover:bg-cyan-500/20 transition-colors">
                                <PlusIcon className="w-6 h-6 text-gray-500 group-hover:text-cyan-400" />
                            </div>
                            <span className="text-gray-400 font-medium group-hover:text-cyan-400">{zoneId}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default DashboardView;
