// src/components/Toast.jsx
import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // auto-close after duration
    }, duration);

    const interval = setInterval(() => {
      setProgress((prev) => prev - 100 / (duration / 100));
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-[300px] p-4 rounded shadow-lg text-white ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      <div>{message}</div>
      <div className="w-full h-1 bg-white/30 mt-2 rounded overflow-hidden">
        <div
          className={`h-full ${
            type === 'success' ? 'bg-white' : 'bg-yellow-100'
          } transition-all`}
          style={{ width: `${progress}%` }}
        ></div>
        <div className="absolute top-1 right-2 cursor-pointer" onClick={onClose}>
  ×
</div>

      </div>
    </div>
  );
};

export default Toast;
