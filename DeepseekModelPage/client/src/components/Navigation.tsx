import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { logout } from "@/lib/auth";
import { Menu, X, Zap, LogOut, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AuthModal from "./AuthModal";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "#features", label: "Features" },
    { href: "#contact", label: "Contact" },
  ];

  if (loading) {
    return (
      <nav className="glass-nav fixed w-full top-0 z-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-echo-orange rounded-lg flex items-center justify-center">
              <Zap className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-white">Echo AI</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="glass-nav fixed w-full top-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-10 h-10 bg-echo-orange rounded-lg flex items-center justify-center">
            <Zap className="text-white h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-white">Echo AI</span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className={`nav-link text-echo-gray hover:text-white transition-colors ${
                location === item.href ? 'text-white' : ''
              }`}>
                {item.label}
              </a>
            </Link>
          ))}
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/chat">
                <Button 
                  variant="ghost" 
                  className="text-echo-gray hover:text-white transition-colors"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-echo-orange text-echo-orange hover:bg-echo-orange hover:text-white transition-all duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <AuthModal>
              <Button
                className="bg-echo-orange hover:bg-echo-amber text-white font-semibold transition-all duration-300 hover:scale-105 animate-pulse-glow"
              >
                Sign In
              </Button>
            </AuthModal>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-echo-gray hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-4 pb-4 border-t border-gray-800"
          >
            <div className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button 
                    variant="ghost"
                    className={`text-echo-gray hover:text-white transition-colors w-full justify-start ${
                      location === item.href ? 'text-white' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              {isAuthenticated && (
                <Link href="/chat">
                  <Button 
                    variant="ghost"
                    className="text-echo-gray hover:text-white transition-colors w-full justify-start"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </Button>
                </Link>
              )}
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  className="bg-echo-orange hover:bg-echo-amber text-white font-semibold w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <AuthModal>
                  <Button
                    className="bg-echo-orange hover:bg-echo-amber text-white font-semibold w-full"
                  >
                    Sign In
                  </Button>
                </AuthModal>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
