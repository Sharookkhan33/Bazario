import React, { useState, useContext } from "react";
import {
  Drawer,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import UserProfileSection from "../../components/account/UserProfileSection";
import ManageAddressSection from "../../components/account/ManageAddressSection";
import MyOrdersSection from "../../components/account/MyOrdersSection";
import WishlistSection from "../../components/account/WishlistSection";
import PaymentsSection from "../../components/account/PaymentsSection";
import MyReviewsSection from "../../components/account/MyReviewsSection";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const MENU = [
  { key: "profile", label: "Profile Info" },
  { key: "address", label: "Manage Address" },
  { key: "orders", label: "My Orders" },
  { key: "wishlist", label: "My Wishlist" },
  { key: "payments", label: "My Payments" },
  { key: "reviews", label: "My Reviews & Ratings" },
  { key: "logout", label: "Logout" },
];

const MyAccount = () => {
  const { logout } = useContext(AuthContext);
  const [active, setActive] = useState("profile");
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const renderSection = () => {
    switch (active) {
      case "profile":
        return <UserProfileSection />;
      case "address":
        return <ManageAddressSection />;
      case "orders":
        return <MyOrdersSection />;
      case "wishlist":
        return <WishlistSection />;
      case "payments":
        return <PaymentsSection />;
      case "reviews":
        return <MyReviewsSection />;
      default:
        return null;
    }
  };

  const MenuList = ({ isMobile = false }) => (
    <nav className="flex flex-col gap-1 px-4">
      {MENU.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => {
            if (key === "logout") {
              handleLogout();
            } else {
              setActive(key);
              if (isMobile) setOpenSidebar(false);
            }
          }}
          className={`text-left px-4 py-2 rounded transition-all duration-200 ${
            active === key
              ? "bg-blue-600 text-white"
              : "text-gray-800 hover:bg-blue-100"
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen relative">
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <IconButton
          variant="text"
          onClick={() => setOpenSidebar(true)}
          className="text-gray-800"
        >
          <Bars3Icon className="h-6 w-6" />
        </IconButton>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 bg-white shadow h-screen sticky top-0 flex-col">
        <Typography variant="h5" className="p-6 border-b text-blue-800">
          My Account
        </Typography>
        <MenuList />
      </aside>

      {/* Drawer Sidebar (Mobile) */}
      <Drawer
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        className="p-4"
        overlay={true}
      >
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" color="blue">
            My Account
          </Typography>
          <IconButton variant="text" onClick={() => setOpenSidebar(false)}>
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
        <MenuList isMobile />
      </Drawer>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">{renderSection()}</main>
    </div>
  );
};

export default MyAccount;
