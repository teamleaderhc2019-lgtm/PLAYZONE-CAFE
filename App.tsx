import React, { useState, useEffect } from 'react';
import './index.css';
import { AppView, Car, CarStatus, CompletedTransaction, MenuItem, OrderItem, PaymentMethod, PlaySession, BillingConfig, Expense } from './types';
import { PLAY_ZONES } from './constants';
import { supabase } from './lib/supabaseClient';

// Components
import Header from './components/common/Header';
import DashboardView from './components/views/DashboardView';
import InventoryView from './components/views/InventoryView';
import ReportsView from './components/views/ReportsView';
import SettingsView from './components/views/SettingsView';
import StartSessionModal from './components/modals/StartSessionModal';
import OrderModal from './components/modals/OrderModal';
import CheckoutModal from './components/modals/CheckoutModal';

export default function App() {
    const [activeView, setActiveView] = useState<AppView>('dashboard');
    const [loading, setLoading] = useState(true);

    // Data state
    const [cars, setCars] = useState<Car[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [billingConfig, setBillingConfig] = useState<BillingConfig>({ playRatePerMinute: 1000, freePlayMinutes: 15 });
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [completed, setCompleted] = useState<CompletedTransaction[]>([]);

    // Local UI state
    const [sessions, setSessions] = useState<PlaySession[]>([]);
    const [now, setNow] = useState(Date.now());

    // Removed localStorage persistence

    const [isStartSessionModalOpen, setStartSessionModalOpen] = useState(false);
    const [isOrderModalOpen, setOrderModalOpen] = useState(false);
    const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);
    const [selectedSession, setSelectedSession] = useState<PlaySession | null>(null);

    // Fetch initial data from Supabase
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    { data: carsData, error: carsError },
                    { data: menuItemsData, error: menuItemsError },
                    { data: expensesData, error: expensesError },
                    { data: completedData, error: completedError },
                    { data: configData, error: configError },
                    { data: sessionsData, error: sessionsError }
                ] = await Promise.all([
                    supabase.from('cars').select('*').order('id', { ascending: true }),
                    supabase.from('menu_items').select('*').order('id', { ascending: true }),
                    supabase.from('expenses').select('*').order('date', { ascending: false }),
                    supabase.from('completed_transactions').select('*').order('completedAt', { ascending: false }),
                    supabase.from('billing_config').select('config').limit(1).single(),
                    supabase.from('active_sessions').select('*')
                ]);

                if (carsError) throw carsError;
                if (menuItemsError) throw menuItemsError;
                if (expensesError) throw expensesError;
                if (completedError) throw completedError;
                if (sessionsError) throw sessionsError;
                if (configError) console.warn('Could not fetch billing config, using defaults.');

                setCars(carsData || []);
                setMenuItems(menuItemsData || []);
                setExpenses(expensesData || []);
                setCompleted(completedData || []);
                if (configData) setBillingConfig(configData.config);

                // Map DB session format to App session format
                if (sessionsData) {
                    const mappedSessions: PlaySession[] = sessionsData.map((s: any) => ({
                        id: s.id,
                        zoneId: s.zone_id,
                        carIds: s.car_ids,
                        startTime: s.start_time,
                        order: s.orders || []
                    }));
                    setSessions(mappedSessions);
                }

            } catch (error: any) {
                console.error("Error fetching initial data:", error);
                let errorMessage = 'An unknown error occurred.';
                let detailedMessage = '';

                if (error && error.message) {
                    errorMessage = error.message;
                }

                if (errorMessage.includes('Failed to fetch')) {
                    detailedMessage = 'Đây có thể là lỗi mạng hoặc CORS. Vui lòng kiểm tra lại kết nối internet của bạn. Nếu bạn là nhà phát triển, hãy đảm bảo URL của ứng dụng này đã được thêm vào mục cài đặt CORS trong Bảng điều khiển Supabase của bạn (Settings > API > URL Configuration).';
                } else if (errorMessage.toLowerCase().includes('jwt') || errorMessage.toLowerCase().includes('unauthorized') || errorMessage.toLowerCase().includes('api key')) {
                    detailedMessage = 'Xác thực thất bại. Nguyên nhân có thể là do URL hoặc Khóa API (Anon Key) của Supabase không chính xác. Vui lòng mở tệp `lib/supabaseClient.ts` và đảm bảo bạn đã thay thế các giá trị giữ chỗ bằng thông tin xác thực thực tế từ dự án Supabase của bạn (Settings > API).';
                }

                alert(`Không thể tải dữ liệu từ server.\n\nLỗi: ${errorMessage}\n\n${detailedMessage ? `Gợi ý: ${detailedMessage}` : ''}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleStartSession = async (carIds: string[]) => {
        if (!selectedZone || carIds.length === 0) return;

        const newSession: PlaySession = {
            id: `S${Date.now()}`,
            zoneId: selectedZone,
            carIds,
            startTime: Date.now(),
            order: [],
        };

        // Insert into active_sessions
        const { error: sessionError } = await supabase.from('active_sessions').insert({
            id: newSession.id,
            zone_id: newSession.zoneId,
            car_ids: newSession.carIds,
            start_time: newSession.startTime,
            orders: newSession.order
        });

        if (sessionError) {
            console.error("Error creating session:", sessionError);
            alert("Lỗi: Không thể tạo phiên chơi mới.");
            return;
        }

        const { error } = await supabase.from('cars').update({ status: 'Đang chơi' }).in('id', carIds);
        if (error) {
            console.error("Error updating car status:", error);
            alert("Lỗi: Không thể cập nhật trạng thái xe.");
            return;
        }

        setSessions(prev => [...prev, newSession]);
        setCars(prev => prev.map(car => carIds.includes(car.id) ? { ...car, status: 'Đang chơi' } : car));
        setStartSessionModalOpen(false);
        setSelectedZone(null);
    };

    const handleOpenStartSessionModal = (zoneId: string) => {
        setSelectedZone(zoneId);
        setStartSessionModalOpen(true);
    };

    const handleAddOrder = async (orderItems: OrderItem[]) => {
        if (!selectedSession) return;

        const updatedOrder = [...selectedSession.order, ...orderItems.filter(oi => oi.quantity > 0)];

        // Update active_sessions in DB
        const { error } = await supabase.from('active_sessions').update({ orders: updatedOrder }).eq('id', selectedSession.id);

        if (error) {
            console.error("Error updating order:", error);
            alert("Lỗi: Không thể cập nhật đơn hàng.");
            return;
        }

        setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, order: updatedOrder } : s));
        setOrderModalOpen(false);
    };

    const handleCheckout = async (session: PlaySession, paymentMethod: PaymentMethod) => {
        const endTime = Date.now();
        const durationMs = endTime - session.startTime;
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

        const completedSession: CompletedTransaction = {
            ...session,
            endTime,
            playCost,
            orderCost,
            totalCost,
            paymentMethod,
            completedAt: endTime,
        };

        const { data: newTransaction, error: insertError } = await supabase.from('completed_transactions').insert(completedSession).select().single();
        if (insertError || !newTransaction) {
            console.error("Error saving transaction:", insertError);
            alert("Lỗi: Không thể lưu giao dịch.");
            return;
        }

        // Delete from active_sessions
        const { error: deleteError } = await supabase.from('active_sessions').delete().eq('id', session.id);
        if (deleteError) {
            console.error("Error removing active session:", deleteError);
            // We don't stop here because the transaction is already saved
        }

        const { error: updateError } = await supabase.from('cars').update({ status: 'Sẵn sàng' }).in('id', session.carIds);
        if (updateError) {
            console.error("Error updating car status on checkout:", updateError);
        }

        setCompleted(prev => [newTransaction, ...prev]);
        setSessions(prev => prev.filter(s => s.id !== session.id));
        setCars(prev => prev.map(car => session.carIds.includes(car.id) ? { ...car, status: 'Sẵn sàng' } : car));
        setCheckoutModalOpen(false);
        setSelectedSession(null);
    };

    const updateCarStatus = async (carId: string, status: CarStatus) => {
        const { error } = await supabase.from('cars').update({ status }).eq('id', carId);
        if (error) {
            alert("Lỗi: không thể cập nhật trạng thái xe.");
            return;
        }
        setCars(prev => prev.map(car => car.id === carId ? { ...car, status } : car));
    };

    const activeSessions = sessions.filter(s => !s.endTime);
    const availableZones = PLAY_ZONES.filter(zone => !activeSessions.some(s => s.zoneId === zone));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-2xl font-semibold text-cyan-400">Đang tải dữ liệu...</p>
                    <p className="text-gray-400 mt-2">Vui lòng chờ trong giây lát.</p>
                </div>
            </div>
        );
    }

    const renderView = () => {
        switch (activeView) {
            case 'inventory':
                return <InventoryView cars={cars} updateCarStatus={updateCarStatus} />;
            case 'reports':
                return <ReportsView completedTransactions={completed} menuItems={menuItems} />;
            case 'settings':
                return <SettingsView
                    cars={cars}
                    setCars={setCars}
                    menuItems={menuItems}
                    setMenuItems={setMenuItems}
                    billingConfig={billingConfig}
                    setBillingConfig={setBillingConfig}
                    expenses={expenses}
                    setExpenses={setExpenses}
                />;
            case 'dashboard':
            default:
                return (
                    <DashboardView
                        activeSessions={activeSessions}
                        availableZones={availableZones}
                        onStartSession={handleOpenStartSessionModal}
                        onAddOrder={(session) => { setSelectedSession(session); setOrderModalOpen(true); }}
                        onEndSession={(session) => { setSelectedSession(session); setCheckoutModalOpen(true); }}
                        now={now}
                        menuItems={menuItems}
                        cars={cars}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-[#111315] text-gray-200 font-sans selection:bg-cyan-500/30">
            <Header activeView={activeView} setActiveView={setActiveView} />

            <main className="container mx-auto px-6 py-8">
                {renderView()}
            </main>

            {/* Modals */}
            <StartSessionModal
                isOpen={isStartSessionModalOpen}
                onClose={() => setStartSessionModalOpen(false)}
                zoneId={selectedZone}
                cars={cars.filter(c => c.status === 'Sẵn sàng')}
                onStart={handleStartSession}
            />

            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setOrderModalOpen(false)}
                session={selectedSession}
                onAddOrder={handleAddOrder}
                menuItems={menuItems}
            />

            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setCheckoutModalOpen(false)}
                session={selectedSession}
                onCheckout={handleCheckout}
                now={now}
                menuItems={menuItems}
                billingConfig={billingConfig}
            />
        </div>
    );
}
