import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { OngoingIncubationsList } from './OngoingIncubationsList';
import { DEMO_INCUBATION_BATCHES } from '../../data/demo';

interface Props {
  onToggleSidebar: () => void;
}

export const IncubationDashboard: React.FC<Props> = ({ onToggleSidebar }) => {
  const [selectedMediaType, setSelectedMediaType] = useState<'TSA' | 'SDA'>('TSA');
  const [batches] = useState(DEMO_INCUBATION_BATCHES);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <button
                type="button"
                className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                onClick={onToggleSidebar}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Incubation
              </h2>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/incubation/new"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Start New Batch
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 sm:mt-2 2xl:mt-5">
          <div className="border-b border-gray-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <Link
                  to="#"
                  className={`${
                    selectedMediaType === 'TSA'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setSelectedMediaType('TSA')}
                >
                  TSA
                </Link>
                <Link
                  to="#"
                  className={`${
                    selectedMediaType === 'SDA'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setSelectedMediaType('SDA')}
                >
                  SDA
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          <OngoingIncubationsList
            batches={batches.filter(batch => batch.mediaType === selectedMediaType)}
          />
        </div>
      </div>
    </div>
  );
};