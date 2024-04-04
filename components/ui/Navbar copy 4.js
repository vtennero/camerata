import LoginAndOut from "@/components/ui/Login";
import Link from "next/link";
import { useSession } from "@/contexts/SessionContext";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./NavbarMenuOverlay";
import NavLink from "./NavLink";

function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const session = useSession();

  let navLinks = [
    {
      title: "Roadmap",
      path: "/roadmap",
    },
    {
      title: "Settings",
      path: "/settings",
    },
  ];
  // Dynamically adjust links based on session
  if (session) {
    // User is logged in, add logout link
    navLinks = [...navLinks, { title: "Logout", path: "#logout" }];
  } else {
    // User is logged out, add login link
    navLinks = [...navLinks, { title: "Login", path: "#login" }];
  }

  return (
    <nav className="bg-slate-900 text-white p-4 border-b border-gray-400">
      <div className="flex justify-between items-center">
        <ul className="flex justify-center flex-grow">
          <li className="font-bold text-xl">
            <Link href="/">The Camerata</Link>
          </li>
        </ul>
        <div className="block md:hidden mobile-menu">
          {!navbarOpen ? (
            <button
              onClick={() => setNavbarOpen(true)}
              className="text-slate-200 flex items-center px-3 py-2 border rounded border-slate-200 hover:text-white hover:border-white"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setNavbarOpen(false)}
              className="text-slate-200 flex items-center px-3 py-2 border rounded border-slate-200 hover:text-white hover:border-white"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="menu hidden md:block md:w-auto" id="navbar">
          <ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink href={link.path} title={link.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {navbarOpen ? <MenuOverlay links={navLinks} /> : null}
    </nav>
  );
}

export default Navbar;
