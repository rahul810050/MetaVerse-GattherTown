import { Bot } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-sky-600 bg-background/80 backdrop-blur-sm px-20">
      {/* Top border glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-sky-600/30 to-transparent"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1 bg-sky-600/10 rounded">
                <Bot className="w-4 h-4 text-sky-600" />
              </div>
              <span className="text-xl  font-bold font-mono">
                Meta<span className="text-sky-600">Realm</span>.ai
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TraIner.ai - All rights reserved
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 text-sky-500 md:grid-cols-3 gap-x-12 gap-y-2 text-sm">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-sky-800 transition-colors"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-sky-800 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-sky-800 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-sky-800 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-sky-800 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/help"
              className="text-muted-foreground hover:text-sky-800 transition-colors"
            >
              Help
            </Link>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-md bg-background/50">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs font-mono">SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;