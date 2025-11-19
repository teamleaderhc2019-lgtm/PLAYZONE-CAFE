import React, { useState, useEffect } from 'react';
import { MenuItem } from '../../types';
import Modal from '../Modal';

const MenuItemModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Omit<MenuItem, 'id'> & { id?: number }) => void;
    menuItem: MenuItem | null;
}> = ({ isOpen, onClose, onSave, menuItem }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [error, setError] = useState('');

    const isEditing = menuItem !== null;

    useEffect(() => {
        if (isOpen) {
            if (menuItem) {
                setName(menuItem.name);
                setPrice(menuItem.price);
            } else {
                setName('');
                setPrice('');
            }
            setError('');
        }
    }, [isOpen, menuItem]);

    const handleSaveClick = () => {
        const numericPrice = Number(price);
        if (!name.trim() || isNaN(numericPrice) || numericPrice <= 0) {
            setError('Tên món không được để trống và giá phải là một số lớn hơn 0.');
            return;
        }
        onSave({ id: menuItem?.id, name: name.trim(), price: numericPrice });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Chỉnh sửa món' : 'Thêm món mới'}>
            <div className="space-y-4">
                {error && <p className="text-red-400 bg-red-500/20 p-3 rounded-lg text-sm">{error}</p>}
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Tên món</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ví dụ: Cà phê sữa"
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Giá (VNĐ)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ví dụ: 22000"
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <button
                        onClick={handleSaveClick}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {isEditing ? 'Lưu thay đổi' : 'Thêm món'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default MenuItemModal;
