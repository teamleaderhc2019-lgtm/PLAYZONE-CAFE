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

<<<<<<< HEAD
=======
const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


// --- HELPER COMPONENTS ---
const Header: React.FC<{ activeView: AppView; setActiveView: (view: AppView) => void }> = ({ activeView, setActiveView }) => {
    const NavButton: React.FC<{ view: AppView; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex flex-col items-center justify-center space-y-1 md:flex-row md:space-y-0 md:space-x-2 px-2 py-2 md:px-3 md:py-2 rounded-lg transition-all duration-200 text-xs md:text-base ${
                activeView === view ? 'bg-cyan-500 text-white shadow-lg' : 'hover:bg-gray-700'
            }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <header className="bg-gray-800 shadow-md p-2 md:p-4 flex justify-between items-center sticky top-0 z-30">
            <h1 className="text-lg md:text-2xl font-bold text-cyan-400">PLAYZONE & CAFE</h1>
            {/* Ẩn navigation bar trên mobile, chỉ hiện trên md trở lên */}
            <nav className="hidden md:flex space-x-1 md:space-x-4">
                <NavButton view="dashboard" label="Bảng điều khiển" icon={<DashboardIcon className="w-5 h-5" />} />
                <NavButton view="inventory" label="Kho xe" icon={<InventoryIcon className="w-5 h-5" />} />
                <NavButton view="reports" label="Báo cáo" icon={<ReportsIcon className="w-5 h-5" />} />
                <NavButton view="settings" label="Cài đặt" icon={<SettingsIcon className="w-5 h-5" />} />
            </nav>
        </header>
    );
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-400">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

const CarStatusBadge: React.FC<{ status: CarStatus }> = ({ status }) => {
    const statusStyles: Record<CarStatus, string> = {
        'Sẵn sàng': 'bg-green-500/20 text-green-400',
        'Đang chơi': 'bg-blue-500/20 text-blue-400',
        'Đang sạc': 'bg-yellow-500/20 text-yellow-400',
        'Bảo trì': 'bg-red-500/20 text-red-400',
    };
    return <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status]}`}>{status}</span>;
}


// --- MAIN APP COMPONENT ---
>>>>>>> 714633a301d52768ede80174f509c586674271ee
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
    const [sessions, setSessions] = useState<PlaySession[]>(() => {
        const saved = localStorage.getItem('playzone_sessions');
        return saved ? JSON.parse(saved) : [];
    });
    const [now, setNow] = useState(Date.now());

    // Persist sessions to localStorage
    useEffect(() => {
        localStorage.setItem('playzone_sessions', JSON.stringify(sessions));
    }, [sessions]);
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
                    { data: configData, error: configError }
                ] = await Promise.all([
                    supabase.from('cars').select('*').order('id', { ascending: true }),
                    supabase.from('menu_items').select('*').order('id', { ascending: true }),
                    supabase.from('expenses').select('*').order('date', { ascending: false }),
                    supabase.from('completed_transactions').select('*').order('completedAt', { ascending: false }),
                    supabase.from('billing_config').select('config').limit(1).single(),
                ]);

                if (carsError) throw carsError;
                if (menuItemsError) throw menuItemsError;
                if (expensesError) throw expensesError;
                if (completedError) throw completedError;
                if (configError) console.warn('Could not fetch billing config, using defaults.');

                setCars(carsData || []);
                setMenuItems(menuItemsData || []);
                setExpenses(expensesData || []);
                setCompleted(completedData || []);
                if (configData) setBillingConfig(configData.config);

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

    const handleAddOrder = (orderItems: OrderItem[]) => {
        if (!selectedSession) return;
        setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, order: [...s.order, ...orderItems.filter(oi => oi.quantity > 0)] } : s));
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
<<<<<<< HEAD
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
=======
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
        <div className="min-h-screen flex flex-col pb-16 md:pb-0"> {/* chừa chỗ cho bottom nav trên mobile */}
            <Header activeView={activeView} setActiveView={setActiveView} />
            <main className="flex-grow p-2 sm:p-4 md:p-6 lg:p-8">
                {renderView()}
            </main>

            {/* --- BOTTOM NAVIGATION BAR MOBILE --- */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-800 flex justify-around items-center h-16 md:hidden">
                <button onClick={() => setActiveView('dashboard')} className={`flex flex-col items-center flex-1 py-2 ${activeView === 'dashboard' ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-300'}`}> <DashboardIcon className="w-7 h-7 mb-1" /> <span className="text-xs">Trang chủ</span> </button>
                <button onClick={() => setActiveView('inventory')} className={`flex flex-col items-center flex-1 py-2 ${activeView === 'inventory' ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-300'}`}> <InventoryIcon className="w-7 h-7 mb-1" /> <span className="text-xs">Kho xe</span> </button>
                <button onClick={() => setActiveView('reports')} className={`flex flex-col items-center flex-1 py-2 ${activeView === 'reports' ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-300'}`}> <ReportsIcon className="w-7 h-7 mb-1" /> <span className="text-xs">Báo cáo</span> </button>
                <button onClick={() => setActiveView('settings')} className={`flex flex-col items-center flex-1 py-2 ${activeView === 'settings' ? 'text-cyan-400' : 'text-gray-400 hover:text-cyan-300'}`}> <SettingsIcon className="w-7 h-7 mb-1" /> <span className="text-xs">Cài đặt</span> </button>
            </nav>

            {/* --- MODALS --- */}
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


// --- VIEW COMPONENTS ---
const DashboardView: React.FC<{
    activeSessions: PlaySession[];
    availableZones: string[];
    onStartSession: (zoneId: string) => void;
    onAddOrder: (session: PlaySession) => void;
    onEndSession: (session: PlaySession) => void;
    now: number;
    menuItems: MenuItem[];
    cars: Car[];
}> = ({ activeSessions, availableZones, onStartSession, onAddOrder, onEndSession, now, menuItems, cars }) => (
    <div className="grid grid-cols-1 gap-4 md:gap-8">
        <div>
            <h2 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-cyan-400 border-b border-gray-700 pb-1 md:pb-2">Phiên đang chơi ({activeSessions.length})</h2>
            {activeSessions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                    {activeSessions.map(session => (
                        <SessionCard key={session.id} session={session} now={now} onAddOrder={onAddOrder} onEndSession={onEndSession} menuItems={menuItems} cars={cars} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 md:py-10 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-400">Không có phiên nào đang hoạt động.</p>
                </div>
            )}
        </div>
        <div>
            <h2 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-cyan-400 border-b border-gray-700 pb-1 md:pb-2">Khu vực trống ({availableZones.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-4">
                {availableZones.map(zoneId => (
                    <button
                        key={zoneId}
                        onClick={() => onStartSession(zoneId)}
                        className="bg-gray-800 hover:bg-cyan-500 hover:text-white border-2 border-dashed border-gray-600 hover:border-cyan-500 rounded-lg p-2 md:p-4 h-20 md:h-32 flex flex-col justify-center items-center transition-all duration-200"
                    >
                        <PlusIcon className="w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2 text-gray-500" />
                        <span className="font-semibold text-center text-xs md:text-base">{zoneId}</span>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

const SessionCard: React.FC<{
    session: PlaySession;
    now: number;
    onAddOrder: (session: PlaySession) => void;
    onEndSession: (session: PlaySession) => void;
    menuItems: MenuItem[];
    cars: Car[];
}> = ({ session, now, onAddOrder, onEndSession, menuItems, cars }) => {
    const duration = now - session.startTime;
    const orderCost = session.order.reduce((total, item) => {
        const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
        return total + (menuItem ? menuItem.price * item.quantity : 0);
    }, 0);

    const getCarName = (carId: string) => cars.find(c => c.id === carId)?.name || carId;
>>>>>>> 714633a301d52768ede80174f509c586674271ee

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
<<<<<<< HEAD
}
=======
};


// --- MODAL COMPONENTS ---

const StartSessionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    zoneId: string | null;
    cars: Car[];
    onStart: (carIds: string[]) => void;
}> = ({ isOpen, onClose, zoneId, cars, onStart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCarIds, setSelectedCarIds] = useState<string[]>([]);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSelectedCarIds([]);
        }
    }, [isOpen]);

    const handleToggleCar = (carId: string) => {
        setSelectedCarIds(prev =>
            prev.includes(carId)
            ? prev.filter(id => id !== carId)
            : [...prev, carId]
        );
    };

        // Lọc xe theo loại khu vực
        let allowedType: 'Xe đua' | 'Xe công trình' | undefined = undefined;
        if (zoneId) {
            if (zoneId.toLowerCase().includes('đua')) allowedType = 'Xe đua';
            else if (zoneId.toLowerCase().includes('công trình')) allowedType = 'Xe công trình';
        }
        const filteredCars = cars.filter(car => {
            const matchSearch = car.name.toLowerCase().includes(searchTerm.toLowerCase()) || car.id.toLowerCase().includes(searchTerm.toLowerCase());
            if (allowedType) return matchSearch && car.type === allowedType;
            return matchSearch;
        });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Bắt đầu phiên chơi tại ${zoneId}`}>
            <div className="flex flex-col h-full">
                {/* Nút bắt đầu đặt ở trên */}
                <button
                    onClick={() => onStart(selectedCarIds)}
                    disabled={selectedCarIds.length === 0}
                    className="mb-4 w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Bắt đầu phiên với {selectedCarIds.length} xe
                </button>
                <input
                    type="text"
                    placeholder="Tìm xe theo tên hoặc ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-3 bg-gray-700 rounded-lg mb-4 border border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                />
                <div className="space-y-2 flex-grow overflow-y-auto pr-2">
                    {filteredCars.map(car => {
                        const isSelected = selectedCarIds.includes(car.id);
                        return (
                             <button
                                key={car.id}
                                onClick={() => handleToggleCar(car.id)}
                                className={`w-full flex justify-between items-center text-left p-3 rounded-lg transition-all duration-200 ${
                                    isSelected ? 'bg-cyan-600 ring-2 ring-cyan-400' : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                <span>
                                    <span className="font-semibold">{car.name}</span>
                                    <span className="text-sm text-gray-400 ml-2">({car.type})</span>
                                </span>
                                {isSelected ? <CheckCircleIcon className="w-6 h-6 text-white"/> : <CarStatusBadge status={car.status}/>}
                            </button>
                        );
                    })}
                    {filteredCars.length === 0 && <p className="text-center text-gray-400 py-4">Không tìm thấy xe phù hợp.</p>}
                </div>
            </div>
        </Modal>
    );
};

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

    return (
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
                                <CheckCircleIcon className="w-6 h-6"/>
                                <span>{method}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

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
>>>>>>> 714633a301d52768ede80174f509c586674271ee
