import React from 'react';
import { PlaySession, MenuItem, Car, BillingConfig } from '../../types';
import { ClockIcon, CoffeeIcon, CarIcon } from '../Icons';

// Utility functions duplicated here or should be imported from a utils file?
// For now, let's duplicate or better yet, create a utils file.
// But to keep it simple as per plan, I'll duplicate the simple formatters or move them to a utils file later.
// Wait, I can export them from App.tsx or create a utils.ts.
// Let's create a utils.ts first? No, let's just include them here or assume they are passed/imported.
// Actually, `formatCurrency` and `formatDuration` are used in multiple places.
// I should probably move them to `utils.ts` or `constants.ts` or similar.
// For this step, I will define them locally or import if I create a utils file.
// Let's create a `lib/utils.ts` file quickly to avoid duplication.

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const SessionCard: React.FC<{
    session: PlaySession;
    now: number;
    onAddOrder: (session: PlaySession) => void;
    onEndSession: (session: PlaySession) => void;
    menuItems: MenuItem[];
    cars: Car[];
    billingConfig: BillingConfig;
}> = ({ session, now, onAddOrder, onEndSession, menuItems, cars, billingConfig }) => {
    const duration = now - session.startTime;

    // Calculate Play Cost
    const totalSeconds = Math.floor(duration / 1000);
    const freeSeconds = billingConfig.freePlayMinutes * 60;
    const chargeableSeconds = Math.max(0, totalSeconds - freeSeconds);
    const chargeableMinutes = Math.ceil(chargeableSeconds / 60);
    const playCost = chargeableMinutes * billingConfig.playRatePerMinute;

    const orderCost = session.order.reduce((total, item) => {
        const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
        return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);

    const getCarName = (carId: string) => cars.find(c => c.id === carId)?.name || carId;

    return (
        <div className="bg-[#1e2329] rounded-lg overflow-hidden shadow-lg border border-gray-800 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 bg-[#252a31] border-b border-gray-800">
                <h3 className="font-bold text-lg text-gray-200">{session.zoneId}</h3>
                <p className="text-sm text-gray-400 mt-1">Xe: {session.carIds.map(getCarName).join(', ')}</p>
            </div>

            {/* Timer */}
            <div className="p-4 flex justify-center items-center bg-[#1a1d21]">
                <div className="flex items-center space-x-2 text-cyan-400">
                    <ClockIcon className="w-5 h-5" />
                    <span className="text-2xl font-mono font-bold tracking-wider">{formatDuration(duration)}</span>
                </div>
            </div>

            {/* Play Cost Section */}
            <div className="px-4 pt-4 flex justify-between items-center bg-[#1e2329]">
                <div className="flex items-center text-cyan-400">
                    <CarIcon className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">Phí chơi RC:</span>
                </div>
                <span className="font-bold text-white">{formatCurrency(playCost)}</span>
            </div>

            {/* Order Section */}
            <div className="p-4 flex-grow bg-[#1e2329]">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-yellow-500">
                        <CoffeeIcon className="w-4 h-4 mr-2" />
                        <span className="font-medium text-sm">Đồ uống:</span>
                    </div>
                    <span className="font-bold text-white">{formatCurrency(orderCost)}</span>
                </div>

                <div className="space-y-1 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                    {session.order.length > 0 ? (
                        session.order.map((orderItem, idx) => {
                            const menuItem = menuItems.find(mi => mi.id === orderItem.menuItemId);
                            if (!menuItem) return null;
                            return (
                                <div key={`${menuItem.id}-${idx}`} className="flex justify-between text-sm text-gray-400">
                                    <span>{orderItem.quantity} x {menuItem.name}</span>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-xs text-gray-600 italic">Chưa có đồ uống</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 border-t border-gray-700">
                <button
                    onClick={() => onAddOrder(session)}
                    className="py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700 transition-colors border-r border-gray-700 uppercase"
                >
                    Thêm món
                </button>
                <button
                    onClick={() => onEndSession(session)}
                    className="py-3 text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-700 transition-colors uppercase"
                >
                    Thanh toán
                </button>
            </div>
        </div>
    );
};

export default SessionCard;
