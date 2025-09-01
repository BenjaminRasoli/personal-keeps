import Link from "next/link";
import { useUser } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { sign } from "crypto";
import { auth } from "../config/FireBaseConfig";

function Navbar() {
  const { user } = useUser();

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <nav className="bg-surface shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-primary text-2xl font-bold">
              MyApp
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
