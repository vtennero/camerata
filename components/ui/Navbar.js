import Link from "next/link";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./NavbarMenuOverlay";
import NavLink from "./NavLink";
import supabase from "../auth/supabaseClient";

function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      redirectTo: window.location.origin,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  let navLinks = [
    {
      title: "MindChronicle",
      path: "/mindchronicle",
    },
    {
      title: "Settings",
      path: "/settings",
    },
  ];

  if (session) {
    navLinks.push({ title: "Logout", path: "#logout", action: signOut });
  } else {
    navLinks.push({ title: "Login", path: "#login", action: signInWithGithub });
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
              <li
                key={index}
                onClick={() => (link.action ? link.action() : null)}
              >
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
