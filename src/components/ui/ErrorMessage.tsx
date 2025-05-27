import React from 'react';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div role="alert" className="bg-red-100 text-red-800 px-4 py-2 rounded mb-2 text-center">
      {message}
    </div>
  );
}
