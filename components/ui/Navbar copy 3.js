import LoginAndOut from "@/components/ui/Login";
import Link from "next/link";
import { useSession } from "@/contexts/SessionContext";
import { useState } from "react";

function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const session = useSession();

  if (!session) {
    return (
      <nav className="bg-slate-900 text-white p-4 border-b border-gray-400">
        <div className="flex justify-between items-center">
          <div className="flex-1"></div>

          <ul className="flex justify-center flex-grow">
            <li className="font-bold text-xl">
              <Link href="/">The Camerata</Link>
            </li>
          </ul>

          <div className="flex-1">
            <LoginAndOut />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-slate-900 text-white p-4 border-b border-gray-400">
      <div className="flex justify-between items-center">
        {/* Invisible spacer to balance the layout */}
        <div className="flex-1 invisible md:visible">
          <div className="opacity-0">Settings</div>
        </div>

        <ul className="flex justify-center flex-grow">
          <li className="font-bold text-xl">
            <Link href="/">The Camerata</Link>
          </li>
        </ul>

        {/* Right-hand side container for Settings and LoginAndOut */}
        <div className="flex flex-1 justify-end items-center">
          {/* Settings Link */}
          <div className="mr-4">
            <Link href="/settings" className="text-sm">
              Settings
            </Link>
          </div>
          <LoginAndOut />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
