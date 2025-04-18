import { Link } from "react-router-dom";

const VendorSuccess = () => {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="p-8 bg-white rounded shadow text-center max-w-md">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Registration Submitted ✅</h2>
          <p className="text-gray-700">
            Your registration has been submitted successfully. Please wait for admin approval.
          </p>
          <Link to="/" className="text-blue-600 font-large">Home</Link>
        </div>
      </div>
    );
  };
  
  export default VendorSuccess;
  