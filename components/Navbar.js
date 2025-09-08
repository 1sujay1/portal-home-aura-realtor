'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BiBuildingHouse } from 'react-icons/bi';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-brand-gradient shadow-2xl sticky top-0 z-50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <Link href="/" className="flex items-center group animate-fadeInLeft">
              <BiBuildingHouse className="h-10 w-10 text-[var(--accent-gold)] group-hover:scale-125 transition-all duration-300 animate-float" />
              <span className="ml-3 text-2xl font-bold text-white text-shimmer">homeaurarealtor</span>
            </Link>
            <div className="hidden md:flex md:items-center md:ml-12 space-x-6 animate-fadeInDown">
              <Link 
                href="/properties" 
                className="text-white/90 hover:text-[var(--accent-gold)] px-4 py-3 rounded-xl text-base font-semibold transition-all duration-150 hover:bg-white/10 hover:scale-105 instant-feedback"
              >
                Properties
              </Link>
              {user && (
                <>
                  <Link 
                    href="/properties/add" 
                    className="text-white/90 hover:text-[var(--accent-gold)] px-4 py-3 rounded-xl text-base font-semibold transition-all duration-150 hover:bg-white/10 hover:scale-105 instant-feedback"
                  >
                    List Property
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="text-white/90 hover:text-[var(--accent-gold)] px-4 py-3 rounded-xl text-base font-semibold transition-all duration-150 hover:bg-white/10 hover:scale-105 instant-feedback"
                  >
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-6 animate-fadeInRight">
            {loading ? (
              <div className="flex items-center space-x-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[var(--accent-gold)]"></div>
                <span className="text-white/90">Loading...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-white/90 glass-card px-4 py-2">
                  <FaUserCircle className="h-6 w-6 text-[var(--accent-gold)] mr-3 animate-pulse-custom" />
                  <span className="font-semibold">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="btn-homeaura-primary hover-glow instant-feedback"
                  disabled={loading}
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-homeaura-secondary instant-feedback"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-homeaura-primary hover-glow instant-feedback"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white/90 hover:text-[var(--accent-gold)] focus:outline-none focus-homeaura p-3 rounded-xl glass-button animate-bounceIn"
            >
              {isOpen ? (
                <FaTimes className="h-7 w-7 animate-rotateIn" />
              ) : (
                <FaBars className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ${isOpen ? 'block animate-fadeInDown' : 'hidden'}`}>
        <div className="px-4 pt-4 pb-6 space-y-3 bg-brand-gradient border-t border-white/20 backdrop-blur-lg">
          <Link
            href="/properties"
            className="text-white/90 hover:text-[var(--accent-gold)] block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-white/10 glass-button"
            onClick={() => setIsOpen(false)}
          >
            Properties
          </Link>
          {user && (
            <>
              <Link
                href="/properties/add"
                className="text-white/90 hover:text-[var(--accent-gold)] block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-white/10 glass-button"
                onClick={() => setIsOpen(false)}
              >
                List Property
              </Link>
              <Link
                href="/dashboard"
                className="text-white/90 hover:text-[var(--accent-gold)] block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-white/10 glass-button"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[var(--accent-gold)]"></div>
              <span className="text-white/90 ml-3">Loading...</span>
            </div>
          ) : user ? (
            <div className="space-y-4">
              <div className="flex items-center px-4 py-3 text-white/90 glass-card">
                <FaUserCircle className="h-6 w-6 text-[var(--accent-gold)] mr-3 animate-pulse-custom" />
                <span className="font-semibold">{user.name}</span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full btn-homeaura-primary hover-glow"
                disabled={loading}
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Link
                href="/login"
                className="btn-homeaura-secondary block text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-homeaura-primary block text-center hover-glow"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
