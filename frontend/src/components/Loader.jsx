// src/components/Loader.jsx

const Loader = () => {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-blue-600 font-bold text-2xl animate-pulse tracking-wide">
            BAZARIO
          </div>
        </div>
      </div>
    );
  };
  
  const Loader1 = () => {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl font-extrabold text-blue-600 animate-pulse tracking-widest">
          BAZARIO
        </p>
      </div>
    );
  };
  
  const Loader2 = () => {
    return (
      <div className="fixed inset-0 z-50 bg-[#f1f3f6] flex flex-col items-center justify-center">
        <div className="flex space-x-2 mb-4">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
        </div>
        <p className="text-blue-700 text-lg font-semibold tracking-wide">
          Preparing Your Seller Dashboard...
        </p>
      </div>
    );
  };
  
  const Loader3 = () => {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <h1 className="text-3xl font-extrabold text-blue-700 animate-[pulse_2s_infinite] tracking-widest drop-shadow-lg">
          BAZARIO
        </h1>
      </div>
    );
  };
  
  export { Loader, Loader1, Loader2, Loader3 };
  