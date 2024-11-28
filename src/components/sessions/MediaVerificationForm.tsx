import React, { useState } from 'react';
import { MediaVerification } from '../../types/monitoring';

interface Props {
  onVerify: (verification: MediaVerification) => void;
  onCancel: () => void;
  lotNumber: string;
  expiryDate: Date;
}

export const MediaVerificationForm: React.FC<Props> = ({
  onVerify,
  onCancel,
  lotNumber,
  expiryDate
}) => {
  const [gptPassed, setGptPassed] = useState(false);
  const [gptDate, setGptDate] = useState('');
  const [sterilityPassed, setSterilityPassed] = useState(false);
  const [sterilityDate, setSterilityDate] = useState('');
  const [trypticSoyAgar, setTrypticSoyAgar] = useState(false);
  const [sabouraudDextroseAgar, setSabouraudDextroseAgar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const verification: MediaVerification = {
      lotNumber,
      expiryDate,
      gptPassed,
      gptDate: new Date(gptDate),
      sterilityPassed,
      sterilityDate: new Date(sterilityDate),
      growthPromotionResults: {
        trypticSoyAgar,
        sabouraudDextroseAgar
      }
    };

    onVerify(verification);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900">Media Verification</h3>
      <p className="text-sm text-gray-500">Lot Number: {lotNumber}</p>
      <p className="text-sm text-gray-500">Expiry Date: {expiryDate.toLocaleDateString()}</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Growth Promotion Test</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={gptPassed}
                onChange={(e) => setGptPassed(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">GPT Passed</span>
            </div>
            <input
              type="date"
              value={gptDate}
              onChange={(e) => setGptDate(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sterility Test</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={sterilityPassed}
                onChange={(e) => setSterilityPassed(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Sterility Test Passed</span>
            </div>
            <input
              type="date"
              value={sterilityDate}
              onChange={(e) => setSterilityDate(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Growth Promotion Results</label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={trypticSoyAgar}
                onChange={(e) => setTrypticSoyAgar(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Tryptic Soy Agar</span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={sabouraudDextroseAgar}
                onChange={(e) => setSabouraudDextroseAgar(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Sabouraud Dextrose Agar</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          disabled={!gptPassed || !sterilityPassed}
        >
          Verify & Continue
        </button>
      </div>
    </form>
  );
};