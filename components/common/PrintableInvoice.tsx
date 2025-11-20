import React from 'react';
import { PlaySession, MenuItem, BillingConfig } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface PrintableInvoiceProps {
    session: PlaySession;
    menuItems: MenuItem[];
    billingConfig: BillingConfig;
    playCost: number;
    orderCost: number;
    totalCost: number;
}

export const PrintableInvoice = React.forwardRef<HTMLDivElement, PrintableInvoiceProps>(({ session, menuItems, billingConfig, playCost, orderCost, totalCost }, ref) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('vi-VN');
    const timeStr = now.toLocaleTimeString('vi-VN');

    return (
        <div ref={ref} className="hidden print:block p-8 font-mono text-black bg-white">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold uppercase">Playzone & Cafe</h1>
                <p className="text-sm">Địa chỉ: [Địa chỉ quán của bạn]</p>
                <p className="text-sm">Hotline: [Số điện thoại]</p>
            </div>

            <div className="mb-6 border-b border-black pb-4">
                <h2 className="text-xl font-bold text-center uppercase mb-4">Hóa Đơn Thanh Toán</h2>
                <div className="flex justify-between text-sm">
                    <span>Ngày: {dateStr}</span>
                    <span>Giờ: {timeStr}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Khu vực: {session.zoneId}</span>
                    <span>Mã HĐ: {session.id}</span>
                </div>
            </div>

            <div className="mb-6">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-black">
                            <th className="text-left py-2">Mục</th>
                            <th className="text-right py-2">SL</th>
                            <th className="text-right py-2">Đơn giá</th>
                            <th className="text-right py-2">Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Play Cost */}
                        <tr>
                            <td className="py-2">Phí chơi RC</td>
                            <td className="text-right py-2">1</td>
                            <td className="text-right py-2">{formatCurrency(playCost)}</td>
                            <td className="text-right py-2">{formatCurrency(playCost)}</td>
                        </tr>

                        {/* Menu Items */}
                        {session.order.map((item, idx) => {
                            const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
                            if (!menuItem) return null;
                            return (
                                <tr key={idx}>
                                    <td className="py-2">{menuItem.name}</td>
                                    <td className="text-right py-2">{item.quantity}</td>
                                    <td className="text-right py-2">{formatCurrency(menuItem.price)}</td>
                                    <td className="text-right py-2">{formatCurrency(menuItem.price * item.quantity)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="border-t border-black pt-4 mb-8">
                <div className="flex justify-between font-bold text-lg">
                    <span>TỔNG CỘNG:</span>
                    <span>{formatCurrency(totalCost)}</span>
                </div>
            </div>

            <div className="text-center text-sm italic">
                <p>Cảm ơn quý khách và hẹn gặp lại!</p>
                <p>Wifi: Playzone_Guest | Pass: 12345678</p>
            </div>
        </div>
    );
});

PrintableInvoice.displayName = 'PrintableInvoice';
