import React from 'react';
import { AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';

interface Error {
  line: number;
  message: string;
  type: 'error' | 'warning';
}

interface ErrorPanelProps {
  errors: Error[];
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({ errors }) => {
  const errorCount = errors.filter(e => e.type === 'error').length;
  const warningCount = errors.filter(e => e.type === 'warning').length;

  const getSuggestion = (error: Error): string => {
    if (error.message.includes('incomplete')) {
      return 'Replace the comment with your implementation. Start by creating the basic structure of the function.';
    }
    if (error.message.includes('memory leaks')) {
      return 'Add free() calls for every malloc() to prevent memory leaks. Free memory when nodes are deleted.';
    }
    if (error.message.includes('Empty function')) {
      return 'Add the function implementation. Consider what operations you need to perform step by step.';
    }
    if (error.message.includes('not implemented')) {
      return 'Remove the pass statement and add your implementation. Think about the algorithm step by step.';
    }
    return 'Review the function requirements and implement the necessary logic.';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 h-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Code Analysis</h3>
        <div className="flex space-x-2">
          {errorCount > 0 && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              {errorCount} error{errorCount !== 1 ? 's' : ''}
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="h-60 overflow-y-auto space-y-3">
        {errors.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <Lightbulb className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p>No issues detected!</p>
              <p className="text-sm mt-1">Your code looks good. Run it to test functionality.</p>
            </div>
          </div>
        ) : (
          errors.map((error, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 ${
                error.type === 'error'
                  ? 'bg-red-50 border-red-400'
                  : 'bg-yellow-50 border-yellow-400'
              }`}
            >
              <div className="flex items-start space-x-2">
                {error.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      error.type === 'error' 
                        ? 'bg-red-200 text-red-800' 
                        : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      Line {error.line}
                    </span>
                    <span className={`text-xs font-medium ${
                      error.type === 'error' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {error.type.toUpperCase()}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${
                    error.type === 'error' ? 'text-red-700' : 'text-yellow-700'
                  }`}>
                    {error.message}
                  </p>
                  <div className={`text-xs p-2 rounded ${
                    error.type === 'error' 
                      ? 'bg-red-100 text-red-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    <strong>💡 Suggestion:</strong> {getSuggestion(error)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ErrorPanel;