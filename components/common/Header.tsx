import React, { useState } from 'react';
import { AppView } from '../../types';
import { DashboardIcon, InventoryIcon, ReportsIcon, SettingsIcon, LogoutIcon, MenuIcon, XIcon } from '../Icons';

const Header: React.FC<{
    activeView: AppView;
    setActiveView: (view: AppView) => void;
    userRole: 'admin' | 'staff' | null;
    onLogout: () => void;
}> = ({ activeView, setActiveView, userRole, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const NavButton: React.FC<{ view: AppView; label: string; icon: React.ReactNode; onClick?: () => void }> = ({ view, label, icon, onClick }) => (
        <button
            onClick={() => {
                setActiveView(view);
                if (onClick) onClick();
            }}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 w-full md:w-auto ${activeView === view ? 'bg-cyan-500 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'
                }`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <header className="bg-gray-800 shadow-md p-2 md:p-4 sticky top-0 z-30">
            <div className="flex justify-between items-center h-10 md:h-auto">
                <h1 className="text-base md:text-2xl font-bold text-cyan-400">PLAYZONE & CAFE</h1>

                {/* Desktop Navigation */}
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
                    <span className="text-xs text-gray-500 ml-2 border border-gray-600 px-1 rounded">
                        Role: {userRole || 'null'}
                    </span>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-300 hover:text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4 space-y-2">
                    <div className="flex items-center justify-between px-3">
                        <span className="text-xs text-gray-500 border border-gray-600 px-1 rounded">
                            Role: {userRole || 'null'}
                        </span>
                        <button
                            onClick={onLogout}
                            className="flex items-center space-x-2 text-red-400 hover:text-red-300"
                        >
                            <LogoutIcon className="w-5 h-5" />
                            <span>Thoát</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
