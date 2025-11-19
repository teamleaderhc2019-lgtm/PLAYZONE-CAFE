import React, { useState, useEffect } from 'react';
import { Car } from '../../types';
import Modal from '../Modal';

const CarModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (car: Car) => void;
    car: Car | null;
    existingCarIds: string[];
}> = ({ isOpen, onClose, onSave, car, existingCarIds }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState<'Xe đua' | 'Xe công trình'>('Xe đua');
    const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [lifespanMonths, setLifespanMonths] = useState<number | ''>('');
    const [error, setError] = useState('');

    const isEditing = car !== null;

    useEffect(() => {
        if (isOpen) {
            if (car) {
                setId(car.id);
                setName(car.name);
                setType(car.type);
                setPurchasePrice(car.purchasePrice || '');
                setPurchaseDate(car.purchaseDate || new Date().toISOString().split('T')[0]);
                setLifespanMonths(car.lifespanMonths || '');
            } else {
                setId('');
                setName('');
                setType('Xe đua');
                setPurchasePrice('');
                setPurchaseDate(new Date().toISOString().split('T')[0]);
                setLifespanMonths('');
            }
            setError('');
        }
    }, [isOpen, car]);

    const handleSaveClick = () => {
        const price = Number(purchasePrice);
        const lifespan = Number(lifespanMonths);

        if (!id.trim() || !name.trim()) {
            setError('ID và Tên xe không được để trống.');
            return;
        }
        if (!isEditing && existingCarIds.includes(id.trim().toUpperCase())) {
            setError('ID xe đã tồn tại. Vui lòng chọn ID khác.');
            return;
        }
        if (isNaN(price) || price <= 0 || isNaN(lifespan) || lifespan <= 0) {
            setError('Giá mua và thời gian sử dụng phải là số dương.');
            return;
        }
        if (!purchaseDate) {
            setError('Vui lòng chọn ngày mua.');
            return;
        }

        onSave({
            id: id.trim().toUpperCase(),
            name: name.trim(),
            type,
            status: car?.status || 'Sẵn sàng',
            purchasePrice: price,
            purchaseDate: purchaseDate,
            lifespanMonths: lifespan,
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Chỉnh sửa xe' : 'Thêm xe mới'}>
            <div className="space-y-4">
                {error && <p className="text-red-400 bg-red-500/20 p-3 rounded-lg text-sm">{error}</p>}
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">ID Xe</label>
                    <input
                        type="text"
                        value={id}
                        onChange={e => setId(e.target.value.toUpperCase())}
                        disabled={isEditing}
                        placeholder="Ví dụ: R16, C11"
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-gray-600 disabled:cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Tên xe</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Ví dụ: Xe đua #16"
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Loại xe</label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value as 'Xe đua' | 'Xe công trình')}
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none appearance-none"
                    >
                        <option value="Xe đua">Xe đua</option>
                        <option value="Xe công trình">Xe công trình</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Giá mua (VNĐ)</label>
                    <input
                        type="number"
                        value={purchasePrice}
                        onChange={e => setPurchasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ví dụ: 2000000"
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Ngày mua</label>
                    <input
                        type="date"
                        value={purchaseDate}
                        onChange={e => setPurchaseDate(e.target.value)}
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2 font-semibold">Thời gian sử dụng ước tính (tháng)</label>
                    <input
                        type="number"
                        value={lifespanMonths}
                        onChange={e => setLifespanMonths(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ví dụ: 24"
                        className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                    <button
                        onClick={handleSaveClick}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {isEditing ? 'Lưu thay đổi' : 'Thêm xe'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CarModal;
