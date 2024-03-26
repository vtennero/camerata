import Link from "next/link";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-center">
        <li className="font-bold">
          <Link href="/">
            <h1>The Camerata</h1> {/* Make it clickable */}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
