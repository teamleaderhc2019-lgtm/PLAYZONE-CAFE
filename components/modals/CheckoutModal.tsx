import React from 'react';
import { PlaySession, PaymentMethod, MenuItem, BillingConfig } from '../../types';
import { CheckCircleIcon } from '../Icons';
import { formatCurrency, formatDuration } from '../../lib/utils';
import Modal from '../Modal';
import { PrintableInvoice } from '../common/PrintableInvoice';
import { useRef } from 'react';

const CheckoutModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    session: PlaySession | null;
    onCheckout: (session: PlaySession, paymentMethod: PaymentMethod) => void;
    now: number;
    menuItems: MenuItem[];
    billingConfig: BillingConfig;
}> = ({ isOpen, onClose, session, onCheckout, now, menuItems, billingConfig }) => {
    if (!session) return null;

    const durationMs = now - session.startTime;
    const totalSeconds = Math.floor(durationMs / 1000);
    const freeSeconds = billingConfig.freePlayMinutes * 60;
    const chargeableSeconds = Math.max(0, totalSeconds - freeSeconds);
    const chargeableMinutes = Math.ceil(chargeableSeconds / 60);
    const playCost = chargeableMinutes * billingConfig.playRatePerMinute;

    const orderCost = session.order.reduce((acc, item) => {
        const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
        return acc + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);

    const totalCost = playCost + orderCost;

    const handlePayment = (method: PaymentMethod) => {
        onCheckout(session, method);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={`Hóa đơn thanh toán - ${session.zoneId}`}>
                <div className="space-y-4 text-lg">
                    <div className="bg-gray-700/50 p-4 rounded-lg">
                        <h4 className="text-xl font-semibold text-cyan-400 mb-3">Chi tiết hóa đơn</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span>Thời gian chơi:</span> <span>{formatDuration(durationMs)}</span></div>
                            <div className="flex justify-between"><span>Phí chơi RC:</span> <span className="font-semibold">{formatCurrency(playCost)}</span></div>
                            <div className="flex justify-between"><span>Tiền đồ uống:</span> <span className="font-semibold">{formatCurrency(orderCost)}</span></div>
                            <div className="border-t border-gray-600 my-2"></div>
                            <div className="flex justify-between text-2xl font-bold text-cyan-400"><span>TỔNG CỘNG:</span> <span>{formatCurrency(totalCost)}</span></div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-cyan-400 mb-3">Chọn hình thức thanh toán</h4>
                        <div className="flex flex-col space-y-3">
                            {(['Tiền mặt', 'Chuyển khoản', 'Ví điện tử'] as PaymentMethod[]).map(method => (
                                <button key={method} onClick={() => handlePayment(method)} className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
                                    <CheckCircleIcon className="w-6 h-6" />
                                    <span>{method}</span>
                                </button>
                            ))}
                            <button onClick={handlePrint} className="w-full flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors mt-2">
                                <span>🖨️ In hóa đơn</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Hidden Printable Invoice */}
            <div className="hidden print:block fixed inset-0 bg-white z-[9999]">
                <PrintableInvoice
                    session={session}
                    menuItems={menuItems}
                    billingConfig={billingConfig}
                    playCost={playCost}
                    orderCost={orderCost}
                    totalCost={totalCost}
                />
            </div>
        </>
    );
};

export default CheckoutModal;
