import React from 'react';
import { Link } from 'react-router-dom';
import { format, differenceInHours } from 'date-fns';
import { IncubationBatch } from '../../types/monitoring';

interface Props {
  batches: IncubationBatch[];
  onEndIncubation?: (batchId: string) => void;
}

export const OngoingIncubationsList: React.FC<Props> = ({ batches, onEndIncubation }) => {
  const getNextAction = (batch: IncubationBatch) => {
    if (batch.status === 'completed') {
      return {
        text: 'End Incubation',
        color: 'bg-green-600 hover:bg-green-700',
        onClick: () => onEndIncubation?.(batch.id)
      };
    }

    const startTime = new Date(batch.startTime);
    const hoursElapsed = differenceInHours(new Date(), startTime);
    
    if (batch.currentStage === 1) {
      // If stage 1 has been running for at least 24 hours, show "End Stage 1"
      if (hoursElapsed >= 24) {
        return {
          to: `/incubation/${batch.id}/monitoring/stage/1`,
          text: 'End Stage 1',
          color: 'bg-green-600 hover:bg-green-700'
        };
      }
      // Otherwise, show "Continue Stage 1"
      return {
        to: `/incubation/${batch.id}/monitoring/stage/1`,
        text: 'Continue Stage 1',
        color: 'bg-blue-600 hover:bg-blue-700'
      };
    }

    // If stage 1 is completed (status will be 'stage1-completed')
    if (batch.status === 'stage1-completed') {
      return {
        to: `/incubation/${batch.id}/stage2-setup`,
        text: 'Start Stage 2',
        color: 'bg-blue-600 hover:bg-blue-700'
      };
    }

    // If stage 2 is in progress
    if (batch.stage2StartTime) {
      const stage2Hours = differenceInHours(new Date(), new Date(batch.stage2StartTime));
      if (stage2Hours >= 24) {
        return {
          to: `/incubation/${batch.id}/monitoring/stage/2`,
          text: 'End Stage 2',
          color: 'bg-green-600 hover:bg-green-700'
        };
      }
      return {
        to: `/incubation/${batch.id}/monitoring/stage/2`,
        text: 'Continue Stage 2',
        color: 'bg-blue-600 hover:bg-blue-700'
      };
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Ongoing Incubations</h3>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {batches.map(batch => {
            const nextAction = getNextAction(batch);
            const hoursElapsed = differenceInHours(new Date(), new Date(batch.startTime));
            const stage2Hours = batch.stage2StartTime ? 
              differenceInHours(new Date(), new Date(batch.stage2StartTime)) : 0;

            return (
              <li key={batch.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Batch ID: {batch.id}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Media Type: {batch.mediaType}
                    </p>
                    <p className="text-sm text-gray-500">
                      Started: {format(new Date(batch.startTime), 'PPp')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Time Elapsed: {batch.stage2StartTime ? stage2Hours : hoursElapsed} hours
                    </p>
                    <p className="text-sm text-gray-500">
                      Current Stage: {batch.currentStage}
                      {batch.status === 'stage1-completed' && ' (Ready for Stage 2)'}
                      {batch.stage2StartTime && ' (Stage 2 In Progress)'}
                      {batch.status === 'completed' && ' (Completed)'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Current Incubator: {batch.currentIncubator}
                    </p>
                    <p className="text-sm text-gray-500">
                      Temperature: {batch.temperature}°C
                    </p>
                    <p className="text-sm text-gray-500">
                      Total Plates: {batch.plates.length}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <Link
                      to={`/incubation/${batch.id}/details`}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      View Details
                    </Link>
                    {nextAction && (
                      nextAction.to ? (
                        <Link
                          to={nextAction.to}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white ${nextAction.color}`}
                        >
                          {nextAction.text}
                        </Link>
                      ) : (
                        <button
                          onClick={nextAction.onClick}
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white ${nextAction.color}`}
                        >
                          {nextAction.text}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </li>
            );
          })}
          {batches.length === 0 && (
            <li className="p-4 text-center text-sm text-gray-500">
              No ongoing incubations
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};