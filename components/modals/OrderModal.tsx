import React, { useState, useEffect } from 'react';
import { PlaySession, OrderItem, MenuItem } from '../../types';
import { formatCurrency } from '../../lib/utils';
import Modal from '../Modal';

const OrderModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    session: PlaySession | null;
    onAddOrder: (orderItems: OrderItem[]) => void;
    menuItems: MenuItem[];
}> = ({ isOpen, onClose, session, onAddOrder, menuItems }) => {
    const [order, setOrder] = useState<Record<number, number>>({});

    useEffect(() => {
        if (!isOpen) {
            setOrder({}); // Reset on close
        }
    }, [isOpen]);

    const handleQuantityChange = (menuItemId: number, delta: number) => {
        setOrder(prev => {
            const newQuantity = (prev[menuItemId] || 0) + delta;
            return { ...prev, [menuItemId]: Math.max(0, newQuantity) };
        });
    };

    const handleSubmit = () => {
        const orderItems: OrderItem[] = Object.entries(order)
            .map(([menuItemId, quantity]) => ({ menuItemId: Number(menuItemId), quantity: Number(quantity) }))
            .filter(item => item.quantity > 0);
        onAddOrder(orderItems);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Thêm món cho ${session?.zoneId}`}>
            <div className="space-y-3">
                {menuItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                        <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-400">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button onClick={() => handleQuantityChange(item.id, -1)} className="w-8 h-8 rounded-full bg-gray-600 hover:bg-red-500 transition-colors">-</button>
                            <span className="w-8 text-center font-bold text-lg">{order[item.id] || 0}</span>
                            <button onClick={() => handleQuantityChange(item.id, 1)} className="w-8 h-8 rounded-full bg-gray-600 hover:bg-green-500 transition-colors">+</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <button onClick={handleSubmit} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors">
                    Xác nhận thêm món
                </button>
            </div>
        </Modal>
    );
};

export default OrderModal;
