export type CarStatus = 'Sẵn sàng' | 'Đang chơi' | 'Đang sạc' | 'Bảo trì';

export interface Car {
  id: string;
  name: string;
  type: 'Xe đua' | 'Xe công trình';
  status: CarStatus;
  purchasePrice: number;
  purchaseDate: string; // YYYY-MM-DD
  lifespanMonths: number;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export interface OrderItem {
  menuItemId: number;
  quantity: number;
}

export interface PlaySession {
  id: string;
  zoneId: string;
  carIds: string[];
  startTime: number;
  endTime?: number;
  order: OrderItem[];
  playCost?: number;
  orderCost?: number;
  totalCost?: number;
}

export interface CompletedTransaction extends PlaySession {
  paymentMethod: 'Tiền mặt' | 'Chuyển khoản' | 'Ví điện tử';
  completedAt: number;
}

export type AppView = 'dashboard' | 'inventory' | 'reports' | 'settings';

export type PaymentMethod = 'Tiền mặt' | 'Chuyển khoản' | 'Ví điện tử';

export interface BillingConfig {
    playRatePerMinute: number;
    freePlayMinutes: number;
}

export type ExpenseCategory = 'Mặt bằng' | 'Nhân sự' | 'Nguyên vật liệu' | 'Bảo trì xe' | 'Khác';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
}
