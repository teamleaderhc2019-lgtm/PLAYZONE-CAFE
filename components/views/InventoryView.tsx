import React, { useState } from 'react';
import { Car, CarStatus } from '../../types';
import CarStatusBadge from '../CarStatusBadge';
import Modal from '../Modal';

const InventoryView: React.FC<{
    cars: Car[];
    updateCarStatus: (carId: string, status: CarStatus) => void;
}> = ({ cars, updateCarStatus }) => {
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const availableStatuses: CarStatus[] = ['Sẵn sàng', 'Đang sạc', 'Bảo trì'];

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Quản lý kho xe ({cars.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {cars.map(car => (
                    <div key={car.id} className="bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between border border-gray-700">
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg">{car.name}</h3>
                                <p className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">{car.id}</p>
                            </div>
                            <p className="text-gray-400 text-sm mb-3">{car.type}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <CarStatusBadge status={car.status} />
                            <button onClick={() => setSelectedCar(car)} className="text-xs text-cyan-400 hover:underline">Đổi trạng thái</button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={!!selectedCar} onClose={() => setSelectedCar(null)} title={`Đổi trạng thái xe ${selectedCar?.name}`}>
                <div className="space-y-3">
                    <p>Chọn trạng thái mới cho xe:</p>
                    <div className="flex flex-col space-y-2">
                        {availableStatuses.map(status => (
                            <button key={status} onClick={() => { if (selectedCar) { updateCarStatus(selectedCar.id, status); setSelectedCar(null); } }} className="text-left w-full p-3 bg-gray-700 hover:bg-cyan-600 rounded-lg transition-colors">
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default InventoryView;
