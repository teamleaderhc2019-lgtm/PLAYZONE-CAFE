import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory } from '../../types';
import Modal from '../Modal';

const ExpenseModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (expense: Omit<Expense, 'id'> & { id?: string }) => void;
    expense: Expense | null;
}> = ({ isOpen, onClose, onSave, expense }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState<number | ''>('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState<ExpenseCategory>('Khác');
    const [error, setError] = useState('');

    const isEditing = expense !== null;
    const expenseCategories: ExpenseCategory[] = ['Mặt bằng', 'Nhân sự', 'Nguyên vật liệu', 'Bảo trì xe', 'Khác'];

    useEffect(() => {
        if (isOpen) {
            if (expense) {
                setName(expense.name);
                setAmount(expense.amount);
                setDate(expense.date);
                setCategory(expense.category);
            } else {
                setName('');
                setAmount('');
                setDate(new Date().toISOString().split('T')[0]);
                setCategory('Khác');
            }
            setError('');
        }
    }, [isOpen, expense]);

    const handleSaveClick = () => {
        const numericAmount = Number(amount);
        if (!name.trim() || isNaN(numericAmount) || numericAmount <= 0) {
            setError('Tên và số tiền không hợp lệ. Số tiền phải lớn hơn 0.');
            return;
        }
        if (!date) {
            setError('Vui lòng chọn ngày chi.');
            return;
        }
        onSave({ id: expense?.id, name: name.trim(), amount: numericAmount, date, category });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Chỉnh sửa chi phí' : 'Thêm chi phí mới'}>
            <div className="space-y-4">
                {error && <p className="text-red-400 bg-red-500/20 p-3 rounded-lg text-sm">{error}</p>}
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Tên khoản chi</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ví dụ: Tiền thuê mặt bằng T11"
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Số tiền (VNĐ)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ví dụ: 10000000"
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Ngày chi</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Loại chi phí</label>
                    <select
                        value={category}
                        onChange={e => setCategory(e.target.value as ExpenseCategory)}
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none appearance-none"
                    >
                        {expenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <button
                        onClick={handleSaveClick}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {isEditing ? 'Lưu thay đổi' : 'Thêm chi phí'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ExpenseModal;
