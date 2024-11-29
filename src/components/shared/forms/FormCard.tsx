import React from 'react';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
}

export const FormCard: React.FC<FormCardProps> = ({
  title,
  children,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isSubmitting = false,
}) => {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="px-6 py-6 sm:p-8">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-8">
            {title}
          </h3>
          <div className="space-y-6">
            {children}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 text-right sm:px-8 space-x-3 rounded-b-lg">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-gray-300
                       shadow-sm text-sm font-medium rounded-md text-gray-700
                       bg-white hover:bg-gray-50 focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50
                       disabled:cursor-not-allowed"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent
                     shadow-sm text-sm font-medium rounded-md text-white
                     bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2
                     focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50
                     disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
