import { Link } from "react-router";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/clerk-react";
import { ShoppingBagIcon, PlusIcon, UserIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <div className="navbar bg-base-300">
      <div className="max-w-5xl mx-auto w-full px-2 sm:px-4 flex justify-between items-center gap-1">
        {/* LOGO - LEFT SIDE */}
        <div className="flex-shrink-0">
          <Link to="/" className="btn btn-ghost btn-sm sm:btn-md gap-1 sm:gap-2 px-2">
            <ShoppingBagIcon className="size-5 text-primary" />
            <span className="hidden sm:inline text-lg font-bold font-mono uppercase tracking-wider">
              Productify
            </span>
          </Link>
        </div>

        <div className="flex gap-1 sm:gap-2 items-center flex-shrink-0">
          <ThemeSelector />
          {isSignedIn ? (
            <>
              <Link to="/create" className="btn btn-primary btn-xs sm:btn-sm gap-1 px-2">
                <PlusIcon className="size-4" />
                <span className="hidden sm:inline">New Product</span>
              </Link>
              <Link to="/profile" className="btn btn-ghost btn-xs sm:btn-sm gap-1 px-2">
                <UserIcon className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="btn btn-ghost btn-xs sm:btn-sm px-2">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-xs sm:btn-sm px-2">Get Started</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default Navbar;