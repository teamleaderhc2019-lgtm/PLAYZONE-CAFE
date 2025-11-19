import React from 'react';
import type { CarStatus } from '../types';

const statusStyles: Record<CarStatus, string> = {
  'Sẵn sàng': 'bg-green-500/20 text-green-400',
  'Đang chơi': 'bg-blue-500/20 text-blue-400',
  'Đang sạc': 'bg-yellow-500/20 text-yellow-400',
  'Bảo trì': 'bg-red-500/20 text-red-400',
};

const CarStatusBadge: React.FC<{ status: CarStatus }> = ({ status }) => (
  <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusStyles[status]}`}>
    {status}
  </span>
);

export default CarStatusBadge;
