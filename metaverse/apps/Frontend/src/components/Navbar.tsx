import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import {
  HomeIcon,
  UserIcon,
  Bot,
  ShoppingBag,
  Map,
  Orbit,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import ModeToggle from "./ModeToggle";
import { syncUser } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";

const Navbar = async () => {
  const user = await currentUser()
  if(user) await syncUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-sky-600 bg-background/70 py-3 px-4 sm:px-6 lg:px-20">
      <div className="mx-auto max-w-screen-xl flex items-center justify-between">
        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-sky-600/10 rounded">
            <Bot className="w-4 h-4 text-sky-bg-sky-600" />
          </div>
          <span className="text-xl font-bold font-mono">
            Meta<span className="text-sky-800">Realm</span>
          </span>
        </Link>

        {/* CENTER: NAVIGATION */}
        <nav className="hidden md:flex text-sky-500 items-center gap-9 ">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm hover:text-sky-800 transition-colors"
          >
            <HomeIcon size={16} />
            <span>Home</span>
          </Link>

          <Link
            href="/map"
            className="flex items-center gap-1.5 text-sm hover:text-sky-800 transition-colors"
          >
            <Map size={16} />
            <span>Maps</span>
          </Link>

          <Link
            href="/space"
            className="flex items-center gap-1.5 text-sm hover:text-sky-800 transition-colors"
          >
            <Orbit size={16} />
            <span>Spaces</span>
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-1.5 text-sm hover:text-sky-800 transition-colors"
          >
            <ShoppingBag size={16} />
            <span>Products</span>
          </Link>
        </nav>

        {/* RIGHT: USER ACTIONS */}
        <div className="hidden md:flex items-center gap-3 text-sky-500 ">
          <ModeToggle />

          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-sm hover:text-sky-800 transition-colors"
              >
                <UserIcon size={16} />
                <span>Profile</span>
              </Link>

              <Button
              asChild
              variant="outline"
              className="border-sky-500 text-sky-600 hover:bg-sky-600 hover:text-white transition-colors"
            >
              <Link href="/generate-program">Get Started</Link>
            </Button>


              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="border-sky-bg-sky-600/50 text-sky-bg-sky-600 hover:text-white hover:bg-sky-600/10"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button className="bg-sky-600 text-sky-bg-sky-600-foreground hover:bg-sky-600/90">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* MOBILE MENU ICON */}
        <div className="md:hidden">
          <button
            type="button"
            className="p-2 text-gray-600 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
