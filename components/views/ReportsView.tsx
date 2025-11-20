import React from 'react';
import { CompletedTransaction, MenuItem } from '../../types';
import { formatCurrency } from '../../lib/utils';

const ReportsView: React.FC<{ completedTransactions: CompletedTransaction[], menuItems: MenuItem[] }> = ({ completedTransactions }) => {
    const today = new Date().toLocaleDateString('vi-VN');
    const todayTransactions = completedTransactions.filter(t => new Date(t.completedAt).toLocaleDateString('vi-VN') === today);

    const totalRevenue = todayTransactions.reduce((sum, t) => sum + (t.totalCost ?? 0), 0);
    const rcRevenue = todayTransactions.reduce((sum, t) => sum + (t.playCost ?? 0), 0);
    const cafeRevenue = todayTransactions.reduce((sum, t) => sum + (t.orderCost ?? 0), 0);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Báo cáo doanh thu trong ngày ({today})</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 text-lg">Tổng doanh thu</h3>
                    <p className="text-4xl font-bold text-cyan-400 mt-2">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 text-lg">Doanh thu RC</h3>
                    <p className="text-4xl font-bold text-white mt-2">{formatCurrency(rcRevenue)}</p>
                </div>
                <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg">
                    <h3 className="text-gray-400 text-lg">Doanh thu Cafe</h3>
                    <p className="text-4xl font-bold text-white mt-2">{formatCurrency(cafeRevenue)}</p>
                </div>
            </div>

            <div className="bg-gray-800 p-3 md:p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Chi tiết giao dịch hôm nay</h3>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {todayTransactions.length > 0 ? todayTransactions.map(t => (
                        <div key={t.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">{new Date(t.completedAt).toLocaleTimeString('vi-VN')}</div>
                                    <h4 className="font-bold text-white">{t.zoneId}</h4>
                                </div>
                                <div className="text-right">
                                    <div className="text-cyan-400 font-bold text-lg">{formatCurrency(t.totalCost ?? 0)}</div>
                                    <div className="text-xs text-gray-400">{t.paymentMethod}</div>
                                </div>
                            </div>
                            <div className="border-t border-gray-600 pt-2 mt-2 grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-400 block text-xs">Tiền chơi</span>
                                    <span className="text-white">{formatCurrency(t.playCost ?? 0)}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block text-xs">Tiền món</span>
                                    <span className="text-white">{formatCurrency(t.orderCost ?? 0)}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-400 block text-xs">Xe</span>
                                    <span className="text-white text-xs">{t.carIds.join(', ')}</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center p-6 text-gray-400 bg-gray-800 rounded-lg">Chưa có giao dịch nào hôm nay.</div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="border-b border-gray-700 text-gray-400">
                            <tr>
                                <th className="p-3">Thời gian</th>
                                <th className="p-3">Khu vực</th>
                                <th className="p-3">Xe</th>
                                <th className="p-3 text-right">Tiền chơi</th>
                                <th className="p-3 text-right">Tiền món</th>
                                <th className="p-3 text-right">Tổng cộng</th>
                                <th className="p-3">Thanh toán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todayTransactions.length > 0 ? todayTransactions.map(t => (
                                <tr key={t.id} className="border-b border-gray-700/50 hover:bg-gray-700/40">
                                    <td className="p-3">{new Date(t.completedAt).toLocaleTimeString('vi-VN')}</td>
                                    <td className="p-3">{t.zoneId}</td>
                                    <td className="p-3">{t.carIds.join(', ')}</td>
                                    <td className="p-3 text-right">{formatCurrency(t.playCost ?? 0)}</td>
                                    <td className="p-3 text-right">{formatCurrency(t.orderCost ?? 0)}</td>
                                    <td className="p-3 text-right font-semibold text-cyan-400">{formatCurrency(t.totalCost ?? 0)}</td>
                                    <td className="p-3">{t.paymentMethod}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="text-center p-6 text-gray-400">Chưa có giao dịch nào hôm nay.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
