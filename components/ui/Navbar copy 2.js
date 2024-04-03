import supabase from "@/components/auth/supabaseClient";
import LoginAndOut from "@/components/ui/Login";
import Link from "next/link";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  // Toggle for the mobile menu
  const toggleNavbar = () => setNavbarOpen(!navbarOpen);

  return (
    <nav className="fixed mx-auto top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-100 border border-[#33353F]">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 lg:py-4">
        <Link
          href="/"
          className="text-2xl md:text-5xl text-white font-semibold"
        >
          勝男
        </Link>

        {/* Mobile burger icon */}
        <div className="md:hidden">
          <button
            onClick={toggleNavbar}
            className="px-3 py-2 text-slate-200 border rounded hover:border-white hover:text-white"
          >
            {navbarOpen ? (
              <XMarkIcon className="w-5 h-5" />
            ) : (
              <Bars3Icon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Desktop Links + Settings + Login/Logout */}
        <div className="hidden md:block md:w-auto">
          <ul className="flex items-center space-x-8 p-4 md:p-0">
            {/* Settings Link for desktop */}
            <li>
              <Link href="/settings">
                <p className="text-white hover:underline">Settings</p>
              </Link>
            </li>

            {/* Login/Logout for desktop */}
            <li>
              <LoginAndOut />
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {navbarOpen && (
        <div className="px-4 py-2 md:hidden">
          <ul className="space-y-4">
            {/* Settings link for mobile */}
            <li>
              <Link href="/settings">
                <p className="block text-white hover:underline">Settings</p>
              </Link>
            </li>

            {/* Login/Logout for mobile */}
            <li>
              <LoginAndOut />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
