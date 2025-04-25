
import React from "react";
import { Bell, LogOut, User, Wallet, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessTopbar = () => {
  const navigate = useNavigate();
  // Dummy user data
  const user = { name: "John Business", avatar: "" };

  const handleLogout = () => {
    localStorage.removeItem("userType");
    navigate("/landing");
  };

  const navigateToWallet = () => {
    navigate("/wallet/business");
  };

  const navigateToOffers = () => {
    navigate("/offers");
  };

  return (
    <header className="h-16 w-full flex items-center justify-between border-b border-gray-200 px-6 bg-white z-10">
      <div className="text-lg font-semibold text-[#1A1F2C]">Place Order</div>
      <div className="flex items-center gap-4">
        <button 
          className="relative cursor-pointer"
          onClick={navigateToOffers}
          title="Offers"
        >
          <Gift className="w-5 h-5 text-[#9b87f5]" />
        </button>
        <button 
          className="relative cursor-pointer"
          onClick={navigateToWallet}
          title="Wallet"
        >
          <Wallet className="w-5 h-5 text-[#9b87f5]" />
        </button>
        <button className="relative">
          <Bell className="w-5 h-5 text-[#9b87f5]" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#9b87f5] rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          {user.avatar
            ? <img src={user.avatar} alt="profile" className="w-8 h-8 rounded-full" />
            : <User className="w-7 h-7 text-[#7E69AB] bg-[#F1F0FB] rounded-full p-1" />}
          <span className="text-sm font-medium">{user.name}</span>
        </div>
        <button
          className="flex items-center px-3 py-1 bg-[#F1F0FB] text-[#1A1F2C] rounded-lg hover:bg-[#edeafa] text-sm gap-1"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </header>
  );
};

export default BusinessTopbar;

