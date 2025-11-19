import React, { useState, useEffect } from 'react';
import { Car } from '../../types';
import { CheckCircleIcon } from '../Icons';
import CarStatusBadge from '../CarStatusBadge';
import Modal from '../Modal';

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

    const filteredCars = cars.filter(car => car.name.toLowerCase().includes(searchTerm.toLowerCase()) || car.id.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Bắt đầu phiên chơi tại ${zoneId}`}>
            <div className="flex flex-col h-full">
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
                                className={`w-full flex justify-between items-center text-left p-3 rounded-lg transition-all duration-200 ${isSelected ? 'bg-cyan-600 ring-2 ring-cyan-400' : 'bg-gray-700 hover:bg-gray-600'
                                    }`}
                            >
                                <span>
                                    <span className="font-semibold">{car.name}</span>
                                    <span className="text-sm text-gray-400 ml-2">({car.type})</span>
                                </span>
                                {isSelected ? <CheckCircleIcon className="w-6 h-6 text-white" /> : <CarStatusBadge status={car.status} />}
                            </button>
                        );
                    })}
                    {filteredCars.length === 0 && <p className="text-center text-gray-400 py-4">Không tìm thấy xe phù hợp.</p>}
                </div>
                <div className="mt-6">
                    <button
                        onClick={() => onStart(selectedCarIds)}
                        disabled={selectedCarIds.length === 0}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        Bắt đầu phiên với {selectedCarIds.length} xe
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default StartSessionModal;
