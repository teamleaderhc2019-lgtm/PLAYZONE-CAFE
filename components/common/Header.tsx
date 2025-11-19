import React from 'react';
import { AppView } from '../../types';
import { DashboardIcon, InventoryIcon, ReportsIcon, SettingsIcon, LogoutIcon } from '../Icons';

const Header: React.FC<{
    activeView: AppView;
    setActiveView: (view: AppView) => void;
    userRole: 'admin' | 'staff' | null;
    onLogout: () => void;
}> = ({ activeView, setActiveView, userRole, onLogout }) => {
    const NavButton: React.FC<{ view: AppView; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex flex-col items-center justify-center space-y-1 md:flex-row md:space-y-0 md:space-x-2 px-2 py-2 md:px-3 md:py-2 rounded-lg transition-all duration-200 text-xs md:text-base ${activeView === view ? 'bg-cyan-500 text-white shadow-lg' : 'hover:bg-gray-700'
                }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <header className="bg-gray-800 shadow-md p-2 md:p-4 flex justify-between items-center sticky top-0 z-30">
            <h1 className="text-lg md:text-2xl font-bold text-cyan-400">PLAYZONE & CAFE</h1>
            {/* Ẩn navigation bar trên mobile, chỉ hiện trên md trở lên */}
            <nav className="hidden md:flex space-x-1 md:space-x-4 items-center">
                <NavButton view="dashboard" label="Bảng điều khiển" icon={<DashboardIcon className="w-5 h-5" />} />
                <NavButton view="inventory" label="Kho xe" icon={<InventoryIcon className="w-5 h-5" />} />

                {userRole === 'admin' && (
                    <>
                        <NavButton view="reports" label="Báo cáo" icon={<ReportsIcon className="w-5 h-5" />} />
                        <NavButton view="settings" label="Cài đặt" icon={<SettingsIcon className="w-5 h-5" />} />
                    </>
                )}

                <div className="h-6 w-px bg-gray-600 mx-2"></div>

                <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Đăng xuất"
                >
                    <LogoutIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Thoát</span>
                </button>
            </nav>
        </header>
    );
};

export default Header;
