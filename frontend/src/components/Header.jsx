import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex items-center gap-4 p-4">
      {/* Logo */}
      <img
        src="/favicon.svg"
        alt="Bazario Logo"
        className="w-12 h-12 md:w-16 md:h-16" // Adjust size here
      />

      {/* Title */}
      <Link
        to="/home"
        className="text-2xl md:text-4xl font-extrabold text-black hover:text-blue-600 transition-all duration-300"
      >
        Bazario
      </Link>
    </div>
  );
};

export default Header;
