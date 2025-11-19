import React from 'react';
import { AppView } from '../../types';
import { DashboardIcon, InventoryIcon, ReportsIcon, SettingsIcon } from '../Icons';

const Header: React.FC<{ activeView: AppView; setActiveView: (view: AppView) => void }> = ({ activeView, setActiveView }) => {
    return (
        <header className="bg-[#1a1d21] px-6 py-3 flex justify-between items-center shadow-md border-b border-gray-800">
            <div className="flex items-center">
                <h1 className="text-xl font-bold text-cyan-400 tracking-wide">PLAYZONE & CAFE</h1>
            </div>
            <nav className="flex items-center space-x-6">
                <button
                    onClick={() => setActiveView('dashboard')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${activeView === 'dashboard'
                            ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <DashboardIcon className="w-5 h-5 inline-block mr-2" />
                    Bảng điều khiển
                </button>
                <button
                    onClick={() => setActiveView('inventory')}
                    className={`flex items-center space-x-2 transition-colors ${activeView === 'inventory' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <InventoryIcon className="w-5 h-5" />
                    <span>Kho xe</span>
                </button>
                <button
                    onClick={() => setActiveView('reports')}
                    className={`flex items-center space-x-2 transition-colors ${activeView === 'reports' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <ReportsIcon className="w-5 h-5" />
                    <span>Báo cáo</span>
                </button>
                <button
                    onClick={() => setActiveView('settings')}
                    className={`flex items-center space-x-2 transition-colors ${activeView === 'settings' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <SettingsIcon className="w-5 h-5" />
                    <span>Cài đặt</span>
                </button>
            </nav>
        </header>
    );
};

export default Header;
