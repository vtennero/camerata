import supabase from "@/components/auth/supabaseClient";
import LoginAndOut from "@/components/ui/Login";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-slate-900 text-white p-4 border-b border-gray-400">
      <div className="flex justify-between items-center">
        <div></div>

        <ul className="flex justify-center">
          <li className="font-bold text-xl	">
            <Link href="/">
              <h1>The Camerata</h1>
            </Link>
          </li>
        </ul>

        <div>
          <LoginAndOut />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
