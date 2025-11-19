import React, { useState } from 'react';
import { Car, MenuItem, BillingConfig, Expense, ExpenseCategory } from '../../types';
import { PlusIcon, EditIcon, TrashIcon } from '../Icons';
import { supabase } from '../../lib/supabaseClient';
import { formatCurrency } from '../../lib/utils';
import CarModal from '../modals/CarModal';
import MenuItemModal from '../modals/MenuItemModal';
import ExpenseModal from '../modals/ExpenseModal';

const SettingsView: React.FC<{
    cars: Car[];
    setCars: React.Dispatch<React.SetStateAction<Car[]>>;
    menuItems: MenuItem[];
    setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
    billingConfig: BillingConfig;
    setBillingConfig: React.Dispatch<React.SetStateAction<BillingConfig>>;
    expenses: Expense[];
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}> = ({ cars, setCars, menuItems, setMenuItems, billingConfig, setBillingConfig, expenses, setExpenses }) => {

    type SettingsTab = 'billing' | 'menu' | 'cars' | 'costs';
    const [activeTab, setActiveTab] = useState<SettingsTab>('billing');

    const [tempBillingConfig, setTempBillingConfig] = useState(billingConfig);
    const [isCarModalOpen, setCarModalOpen] = useState(false);
    const [editingCar, setEditingCar] = useState<Car | null>(null);
    const [isMenuItemModalOpen, setMenuItemModalOpen] = useState(false);
    const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    // Car Management
    const handleSaveCar = async (car: Car) => {
        const { data, error } = await supabase.from('cars').upsert(car).select().single();
        if (error || !data) {
            alert('Lỗi: không thể lưu thông tin xe.');
            return;
        }
        if (cars.some(c => c.id === car.id)) {
            setCars(prev => prev.map(c => c.id === car.id ? data : c));
        } else {
            setCars(prev => [...prev, data].sort((a, b) => a.id.localeCompare(b.id)));
        }
    };
    const handleDeleteCar = async (carId: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa xe ${carId}? Thao tác này không thể hoàn tác.`)) {
            const { error } = await supabase.from('cars').delete().eq('id', carId);
            if (error) {
                alert('Lỗi: không thể xóa xe.');
                return;
            }
            setCars(prev => prev.filter(c => c.id !== carId));
        }
    };
    const handleOpenCarModal = (car: Car | null) => {
        setEditingCar(car);
        setCarModalOpen(true);
    };

    // Menu Item Management
    const handleSaveMenuItem = async (item: Omit<MenuItem, 'id'> & { id?: number }) => {
        const { id, ...itemDetails } = item;
        let savedItem: MenuItem;

        if (!id) { // New item
            const { data, error } = await supabase.from('menu_items').insert(itemDetails).select().single();
            if (error || !data) { alert('Lỗi: không thể thêm món mới.'); return; }
            savedItem = data;
            setMenuItems(prev => [...prev, savedItem]);
        } else { // Existing item
            const { data, error } = await supabase.from('menu_items').update(itemDetails).eq('id', id).select().single();
            if (error || !data) { alert('Lỗi: không thể cập nhật món.'); return; }
            savedItem = data;
            setMenuItems(prev => prev.map(i => i.id === savedItem.id ? savedItem : i));
        }
    };
    const handleDeleteMenuItem = async (itemId: number) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa món này? Thao tác này không thể hoàn tác.`)) {
            const { error } = await supabase.from('menu_items').delete().eq('id', itemId);
            if (error) { alert('Lỗi: không thể xóa món.'); return; }
            setMenuItems(prev => prev.filter(i => i.id !== itemId));
        }
    };
    const handleOpenMenuItemModal = (item: MenuItem | null) => {
        setEditingMenuItem(item);
        setMenuItemModalOpen(true);
    };

    // Expense Management
    const handleSaveExpense = async (expense: Omit<Expense, 'id'> & { id?: string }) => {
        const { id, ...expenseDetails } = expense;
        if (id) { // Editing
            const { data, error } = await supabase.from('expenses').update(expenseDetails).eq('id', id).select().single();
            if (error || !data) { alert('Lỗi: không thể cập nhật chi phí.'); return; }
            setExpenses(prev => prev.map(e => e.id === data.id ? data : e));
        } else { // Adding
            const { data, error } = await supabase.from('expenses').insert(expenseDetails).select().single();
            if (error || !data) { alert('Lỗi: không thể thêm chi phí.'); return; }
            setExpenses(prev => [...prev, data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
    };

    const handleDeleteExpense = async (expenseId: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa khoản chi này?`)) {
            const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
            if (error) { alert('Lỗi: không thể xóa chi phí.'); return; }
            setExpenses(prev => prev.filter(e => e.id !== expenseId));
        }
    };

    const handleSaveBillingConfig = async () => {
        const { error } = await supabase.from('billing_config').upsert({ id: 1, config: tempBillingConfig });
        if (error) {
            alert('Lỗi: Không thể lưu cài đặt phí chơi.');
            return;
        }
        setBillingConfig(tempBillingConfig);
        alert('Đã lưu cài đặt thành công!');
    };

    const handleOpenExpenseModal = (expense: Expense | null) => {
        setEditingExpense(expense);
        setExpenseModalOpen(true);
    }

    const TabButton: React.FC<{ tabName: SettingsTab; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-3 font-semibold text-lg transition-colors duration-200 ${activeTab === tabName
                    ? 'border-b-2 border-cyan-400 text-cyan-400'
                    : 'border-b-2 border-transparent text-gray-400 hover:text-white'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div>
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">Cài đặt hệ thống</h2>

            <div className="flex border-b border-gray-700 mb-6">
                <TabButton tabName="billing" label="Phí chơi RC" />
                <TabButton tabName="menu" label="Menu Cafe" />
                <TabButton tabName="cars" label="Kho xe" />
                <TabButton tabName="costs" label="Chi phí" />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                {activeTab === 'billing' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-cyan-400">Cài đặt Phí chơi RC</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 mb-2">Đơn giá mỗi phút (VNĐ)</label>
                                <input type="number" value={tempBillingConfig.playRatePerMinute} onChange={e => setTempBillingConfig(prev => ({ ...prev, playRatePerMinute: Number(e.target.value) }))} className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">Số phút chơi miễn phí</label>
                                <input type="number" value={tempBillingConfig.freePlayMinutes} onChange={e => setTempBillingConfig(prev => ({ ...prev, freePlayMinutes: Number(e.target.value) }))} className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none" />
                            </div>
                        </div>
                        <div className="mt-6 text-right">
                            <button onClick={handleSaveBillingConfig} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg">
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'menu' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-cyan-400">Quản lý Menu Cafe</h3>
                            <button onClick={() => handleOpenMenuItemModal(null)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"><PlusIcon className="w-5 h-5" /> <span>Thêm món</span></button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-700 text-gray-400">
                                    <tr><th className="p-3">Tên món</th><th className="p-3">Giá</th><th className="p-3 text-right">Hành động</th></tr>
                                </thead>
                                <tbody>
                                    {menuItems.map(item => (
                                        <tr key={item.id} className="border-b border-gray-700/50">
                                            <td className="p-3">{item.name}</td>
                                            <td className="p-3">{formatCurrency(item.price)}</td>
                                            <td className="p-3 text-right space-x-2">
                                                <button onClick={() => handleOpenMenuItemModal(item)} className="p-2 hover:bg-gray-700 rounded-full"><EditIcon className="w-5 h-5 text-yellow-400" /></button>
                                                <button onClick={() => handleDeleteMenuItem(item.id)} className="p-2 hover:bg-gray-700 rounded-full"><TrashIcon className="w-5 h-5 text-red-400" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'cars' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-cyan-400">Quản lý Kho xe</h3>
                            <button onClick={() => handleOpenCarModal(null)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"><PlusIcon className="w-5 h-5" /> <span>Thêm xe</span></button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-700 text-gray-400">
                                    <tr>
                                        <th className="p-3">ID</th>
                                        <th className="p-3">Tên xe</th>
                                        <th className="p-3">Loại</th>
                                        <th className="p-3 text-right">Giá mua</th>
                                        <th className="p-3 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cars.map(car => (
                                        <tr key={car.id} className="border-b border-gray-700/50">
                                            <td className="p-3 font-mono">{car.id}</td>
                                            <td className="p-3">{car.name}</td>
                                            <td className="p-3">{car.type}</td>
                                            <td className="p-3 text-right">{formatCurrency(car.purchasePrice)}</td>
                                            <td className="p-3 text-right space-x-2">
                                                <button onClick={() => handleOpenCarModal(car)} className="p-2 hover:bg-gray-700 rounded-full"><EditIcon className="w-5 h-5 text-yellow-400" /></button>
                                                <button onClick={() => handleDeleteCar(car.id)} className="p-2 hover:bg-gray-700 rounded-full"><TrashIcon className="w-5 h-5 text-red-400" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'costs' && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-cyan-400">Quản lý Chi phí</h3>
                            <button onClick={() => handleOpenExpenseModal(null)} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"><PlusIcon className="w-5 h-5" /> <span>Thêm chi phí</span></button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-gray-700 text-gray-400">
                                    <tr>
                                        <th className="p-3">Ngày</th>
                                        <th className="p-3">Tên khoản chi</th>
                                        <th className="p-3">Loại</th>
                                        <th className="p-3 text-right">Số tiền</th>
                                        <th className="p-3 text-right">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.length > 0 ? expenses.map(expense => (
                                        <tr key={expense.id} className="border-b border-gray-700/50">
                                            <td className="p-3">{new Date(expense.date).toLocaleDateString('vi-VN')}</td>
                                            <td className="p-3">{expense.name}</td>
                                            <td className="p-3">{expense.category}</td>
                                            <td className="p-3 text-right">{formatCurrency(expense.amount)}</td>
                                            <td className="p-3 text-right space-x-2">
                                                <button onClick={() => handleOpenExpenseModal(expense)} className="p-2 hover:bg-gray-700 rounded-full"><EditIcon className="w-5 h-5 text-yellow-400" /></button>
                                                <button onClick={() => handleDeleteExpense(expense.id)} className="p-2 hover:bg-gray-700 rounded-full"><TrashIcon className="w-5 h-5 text-red-400" /></button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="text-center p-6 text-gray-400">Chưa có khoản chi nào được ghi nhận.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals for Settings */}
            <CarModal
                isOpen={isCarModalOpen}
                onClose={() => setCarModalOpen(false)}
                onSave={(car) => {
                    handleSaveCar(car);
                    setCarModalOpen(false);
                }}
                car={editingCar}
                existingCarIds={cars.map(c => c.id)}
            />
            <MenuItemModal
                isOpen={isMenuItemModalOpen}
                onClose={() => setMenuItemModalOpen(false)}
                onSave={(item) => {
                    handleSaveMenuItem(item);
                    setMenuItemModalOpen(false);
                }}
                menuItem={editingMenuItem}
            />
            <ExpenseModal
                isOpen={isExpenseModalOpen}
                onClose={() => setExpenseModalOpen(false)}
                onSave={(expense) => {
                    handleSaveExpense(expense);
                    setExpenseModalOpen(false);
                }}
                expense={editingExpense}
            />
        </div>
    );
};

export default SettingsView;
