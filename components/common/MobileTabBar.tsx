import React from 'react';
import { AppView } from '../../types';
import { DashboardIcon, InventoryIcon, ReportsIcon, SettingsIcon } from '../Icons';

interface MobileTabBarProps {
    activeView: AppView;
    setActiveView: (view: AppView) => void;
    userRole: 'admin' | 'staff' | null;
}

const MobileTabBar: React.FC<MobileTabBarProps> = ({ activeView, setActiveView, userRole }) => {
    const TabButton: React.FC<{ view: AppView; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => {
        const isActive = activeView === view;
        return (
            <button
                onClick={() => setActiveView(view)}
                className={`relative flex flex-col items-center justify-center w-full py-3 transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-200'
                    }`}
            >
                <div className={`transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}>
                    {icon}
                </div>
                <span className={`text-[10px] font-medium mt-1 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {label}
                </span>
                {isActive && (
                    <div className="absolute bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]"></div>
                )}
            </button>
        );
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-xl border-t border-white/10 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
            <div className="flex justify-around items-center h-[72px] px-2">
                <TabButton view="dashboard" label="Bảng tin" icon={<DashboardIcon className="w-6 h-6" />} />
                <TabButton view="inventory" label="Kho xe" icon={<InventoryIcon className="w-6 h-6" />} />

                {userRole === 'admin' && (
                    <>
                        <TabButton view="reports" label="Báo cáo" icon={<ReportsIcon className="w-6 h-6" />} />
                        <TabButton view="settings" label="Cài đặt" icon={<SettingsIcon className="w-6 h-6" />} />
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileTabBar;
