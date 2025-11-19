import React from 'react';
import { CafeMenuItem } from '../types';

const SettingsView: React.FC<{
  menuItems: CafeMenuItem[];
  onAddMenuItem: (item: CafeMenuItem) => void;
  onUpdateMenuItem: (item: CafeMenuItem) => void;
  onDeleteMenuItem: (id: string) => void;
}> = ({ menuItems, onAddMenuItem, onUpdateMenuItem, onDeleteMenuItem }) => {
  // Placeholder UI for settings (menu management)
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Cài đặt Menu Cafe</h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-cyan-400">Danh sách món</h3>
        <ul>
          {menuItems.map(item => (
            <li key={item.id} className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span>{item.name} ({item.price}₫)</span>
              <div className="flex gap-2">
                <button className="text-yellow-400 hover:underline" onClick={() => onUpdateMenuItem(item)}>Sửa</button>
                <button className="text-red-400 hover:underline" onClick={() => onDeleteMenuItem(item.id)}>Xóa</button>
              </div>
            </li>
          ))}
        </ul>
        <button className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600" onClick={() => onAddMenuItem({ id: '', name: '', price: 0 })}>
          Thêm món mới
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
