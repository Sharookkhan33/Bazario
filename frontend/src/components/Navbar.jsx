import React, { useContext, useState,useEffect } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HiOutlineShoppingCart, HiOutlineHeart, HiUser } from 'react-icons/hi';
import { BsFillBoxFill } from 'react-icons/bs';
import { FiBarChart } from 'react-icons/fi';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { FiFilter } from "react-icons/fi";
import { HiOutlineLogin, HiOutlineUserAdd, HiOutlineBriefcase,HiOutlineLogout } from 'react-icons/hi';
import { Sun, Moon } from 'lucide-react';
import { Badge, Button } from '@material-tailwind/react';
import api from '../api/axios'


const Navbar = () => {
  const { isLoggedIn, userType, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', averageRating: '', sort: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [cartCount, setCartCount] = useState(0);

const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
  localStorage.setItem('theme', newTheme);
};


useEffect(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  document.documentElement.classList.toggle('dark', savedTheme === 'dark');
}, []);

  const navigate = useNavigate();
  const location = useLocation();
  const qs = new URLSearchParams(location.search);
  const hasSearch = !!qs.get('search');

  const isAuthPage = [
    '/login', '/register', '/vendor-login',
    '/vendor-register', '/admin-login', '/admin-register',
  ].includes(location.pathname);

  const showOnlyLogo = location.pathname.startsWith('/admin');

  // Fetch cart count
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get(
          '/cart',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const count = res.data.items.reduce((sum, i) => sum + i.quantity, 0);
        setCartCount(count);
        console.log('Cart count:', count);
      } catch (err) {
        setCartCount(0);
        console.error('Fetch cart count error:', err);
      }
    };
    if (isLoggedIn && userType === 'user') fetchCart();
  }, [isLoggedIn, userType, location]);


  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      const queryParams = new URLSearchParams(filters);
      queryParams.set('search', q);
      navigate(`/?${queryParams.toString()}`);
      setSearchTerm('');
    }
  };

  const handleApplyFilters = () => {
    const queryParams = new URLSearchParams(filters);
    if (qs.get('search')) queryParams.set('search', qs.get('search'));
    navigate(`/?${queryParams.toString()}`);
    setShowFilters(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 shadow-md">
      <nav className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link
  to="/home"
  className="text-xl font-bold text-black transition-all duration-300 hover:text-blue-600 hover:scale-105"
>
  Bazario
</Link>


        {/* Desktop Search */}
        {!isAuthPage && !showOnlyLogo && (
        <form
        onSubmit={handleSearch}
        className="hidden md:flex relative items-center w-10 hover:w-1/2 focus-within:w-1/2 transition-all duration-500 ease-in-out bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden group border border-transparent hover:border-blue-500 focus-within:border-blue-500"
      >
        <FaSearch className="text-gray-600 dark:text-gray-300 ml-3 text-lg group-hover:text-blue-500 transition-all duration-600 cursor-pointer" />
      
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
          placeholder="Search products..."
          className="w-full  h-10 bg-gray-100 dark:bg-gray-800 border- text-black dark:text-white pl-4 pr-4 outline-none  hidden group-hover:block focus:block transition-all duration-500 ease-in-out text-sm"
        />
      </form>
      
        
        )}
        {hasSearch && (
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full shadow-md border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 group"
    >
      <FiFilter className="text-lg group-hover:scale-110 transition-transform duration-300" />
      <span className="text-sm font-medium">Filters</span>
    </button>
  )}

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-5 text-sm">
          {!isLoggedIn && !isAuthPage && (
            <>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-black-700 hover:text-blue-600 transition-all duration-300"
            >
              <HiOutlineLogin className="text-lg" />
              Login
            </Link>
          
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-black-700 hover:text-blue-600 transition-all duration-300"
            >
              <HiOutlineUserAdd className="text-lg" />
              Register
            </Link>
          
            <Link
              to="/vendor-home"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-black-700 hover:text-blue-600 transition-all duration-300"
            >
              <HiOutlineBriefcase className="text-lg" />
              Become Seller
            </Link>
          </>
          
          )}
          {isLoggedIn && userType === 'user' && (
          <div className="flex items-center gap-6">
       <Link
  to="/my-cart"
  className="relative flex flex-col items-center text-black hover:text-blue-600 transition-all duration-300 group"
> 
            <HiOutlineShoppingCart className="text-2xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
            <span className="text-xs mt-1">Cart</span>
            {cartCount > 0 && (
      <span
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
      >
        {cartCount}
      </span>
    )}
          </Link>
          
          <Link
            to="/my-wishlist"
            className="flex flex-col items-center text-black hover:text-blue-600 transition-all duration-300 group"
          >
            <HiOutlineHeart className="text-2xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
            <span className="text-xs mt-1">Wishlist</span>
          </Link>
        
          <Link
            to="/my-account"
            className="flex flex-col items-center text-black hover:text-blue-600 transition-all duration-300 group"
          >
            <HiUser className="text-2xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" />
            <span className="text-xs mt-1">Account</span>
          </Link>
          <button
  onClick={toggleTheme}
  className="text-xl p-2 rounded-full transition-all duration-500 hover:bg-gray-100 dark:hover:bg-gray-700"
  aria-label="Toggle Theme"
>
{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
</button>

        </div>
        
          )}
          {isLoggedIn && userType === 'vendor' && (
            <>
              <Link to="/vendors/dashboard" className="flex items-center gap-1 text-blue-600"><BsFillBoxFill />Dashboard</Link>
              <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
            </>
          )}
          {isLoggedIn && userType === 'admin' && (
            <>
              <Link to="/admin-dashboard" className="flex items-center gap-1 text-blue-600"><FiBarChart />Admin</Link>
              <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
            </>
          )}
        </div>
  

        {/* Hamburger */}
        <div className="md:hidden">
  <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-gray-700">
    <FaBars />
  </button>
</div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
 <div className="fixed inset-0 z-40 flex justify-end">
    {/* Clickable Background to Close Sidebar */}
    <div
      className="flex-1 bg-black bg-opacity-30"
      onClick={() => setMenuOpen(false)}
    />

    {/* Sidebar from Right */}
    <div className={`w-64 shadow-lg p-6 flex flex-col space-y-4 transition-transform duration-300 transform translate-x-0 
      ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-400 text-white-500'}`}>
      {/* Close Button */}
      <button
        onClick={() => setMenuOpen(false)}
        className="self-end text-2xl text-gray-700 mb-2 hover:text-red-500"
      >
        <FaTimes />
      </button>
      {/* Add inside mobile menu section */}
<button
  onClick={toggleTheme}
  className="text-xl p-2 rounded-full self-start transition-all duration-500 hover:bg-gray-100 dark:hover:bg-gray-700"
  aria-label="Toggle Theme"
>
  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
</button>


      {!isLoggedIn && !isAuthPage && (
        <>
          <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300">
            Login
          </Link>
          <Link to="/register" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300">
            Register
          </Link>
          <Link to="/vendor-login" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300">
            Become Seller
          </Link>
        </>
      )}

      {isLoggedIn && userType === 'user' && (
        <>
          <Link to="/my-cart" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300">
            Cart
          </Link>
          <Link to="/my-wishlist" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300">
            Wishlist
          </Link>
          <Link to="/my-account" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300">
            Account
          </Link>
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-600 hover:text-blue-600 font-medium transition-all duration-300">
            Logout <HiOutlineLogout className="inline ml-1" />
          </button>
        </>
      )}

      {isLoggedIn && userType === 'vendor' && (
        <>
          <Link to="/vendors/dashboard" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300">
            Dashboard
          </Link>
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-600 font-medium hover:underline">
            Logout
          </button>
        </>
      )}

      {isLoggedIn && userType === 'admin' && (
        <>
          <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)} className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300">
            Admin
          </Link>
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-600 font-medium hover:underline">
            Logout
          </button>
        </>
      )}
    </div>
  </div>
)}



      {/* Filters Panel */}
      {showFilters && (
  <div className="absolute top-full left-1/2 -translate-x-1/2 w-11/12 md:w-96 bg-white border shadow-lg p-3 z-50 max-h-96 overflow-y-auto rounded-md">
    <h3 className="text-base font-semibold mb-3">Filters</h3>
    <div className="space-y-2 text-sm">
      <div>
        <label className="block">Min Price</label>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="block">Max Price</label>
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="block">Rating</label>
        <input
          type="number"
          name="averageRating"
          value={filters.averageRating}
          onChange={handleFilterChange}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      <div>
        <label className="block">Sort By</label>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">Select</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_asc">Rating: Low to High</option>
          <option value="rating_desc">Rating: High to Low</option>
        </select>
      </div>
      <button
        onClick={handleApplyFilters}
        className="w-full bg-blue-600 text-white py-2 rounded mt-3 hover:bg-blue-700 text-sm"
      >
        Apply Filters
      </button>
    </div>
  </div>
)}

    </header>
  );
};

export default Navbar;
