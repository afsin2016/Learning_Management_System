import React from 'react';

const Loader = ({ message = 'Loading...', size = 'default' }) => {
  const spinnerSizes = {
    small: 'w-5 h-5 border-2',
    default: 'w-9 h-9 border-3',
    large: 'w-14 h-14 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div
        className={`${spinnerSizes[size] || spinnerSizes.default} border-indigo-600 border-t-transparent rounded-full animate-spin`}
      ></div>
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );
};

export default Loader;
