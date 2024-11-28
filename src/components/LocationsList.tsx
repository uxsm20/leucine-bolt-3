import React from 'react';
import { Room } from '../types/monitoring';

interface Props {
  locations: Room[];
  onLocationSelect: (location: Room) => void;
}

export const LocationsList: React.FC<Props> = ({ locations, onLocationSelect }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {locations.map((location) => (
          <li key={location.id}>
            <button
              onClick={() => onLocationSelect(location)}
              className="w-full px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900">{location.name}</h3>
                <p className="text-sm text-gray-500">Room: {location.roomNumber}</p>
              </div>
              <div className="text-sm text-gray-500">
                <p>Class {location.cleanRoomClass}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}