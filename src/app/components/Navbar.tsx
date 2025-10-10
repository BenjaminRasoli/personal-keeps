import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../config/FireBaseConfig";

function Navbar() {
  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <nav className="w-full bg-background border-b border-muted shadow-sm">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-primary text-2xl font-bold hover:text-secondary transition-colors"
          >
            Home
          </Link>

          {user && (
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded bg-primary text-surface hover:bg-secondary transition-colors"
              aria-label="Logout"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
