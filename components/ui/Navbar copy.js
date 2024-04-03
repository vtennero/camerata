import supabase from "@/components/auth/supabaseClient";
import LoginAndOut from "@/components/ui/Login";
import Link from "next/link";

function Navbar() {
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

export default Navbar;
