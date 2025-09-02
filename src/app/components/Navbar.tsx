import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../config/FireBaseConfig";

function Navbar() {
  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <nav className="border-b-2 border-gray-300">
      <div className="mx-auto  px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-surface text-2xl font-bold">
              Home
            </Link>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded bg-primary text-surface hover:bg-accent transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
