
import { Car, MenuItem } from './types';

export const PLAY_RATE_PER_MINUTE = 1000;
export const FREE_PLAY_MINUTES = 15;

export const INITIAL_CARS: Car[] = [
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `R${i + 1}`,
    name: `Xe đua #${i + 1}`,
    type: 'Xe đua' as const,
    status: 'Sẵn sàng' as const,
    purchasePrice: 2000000,
    purchaseDate: '2023-01-01',
    lifespanMonths: 24,
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `C${i + 1}`,
    name: `Xe công trình #${i + 1}`,
    type: 'Xe công trình' as const,
    status: 'Sẵn sàng' as const,
    purchasePrice: 3500000,
    purchaseDate: '2023-06-01',
    lifespanMonths: 36,
  })),
];

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'Cà phê đen', price: 18000 },
  { id: 2, name: 'Cà phê sữa', price: 22000 },
  { id: 3, name: 'Bạc xỉu', price: 25000 },
  { id: 4, name: 'Nước cam ép', price: 28000 },
  { id: 5, name: 'Trà đào', price: 25000 },
  { id: 6, name: 'Bánh mì que', price: 15000 },
  { id: 7, name: 'Snack khoai tây', price: 20000 },
];

export const PLAY_ZONES: string[] = [
  'Đường đua 1',
  'Đường đua 2',
  'Đường đua 3',
  'Đường đua 4',
  'Khu công trình A',
  'Khu công trình B',
];