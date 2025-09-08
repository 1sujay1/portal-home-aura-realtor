"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaSearch,
  FaBuilding,
  FaUserAlt,
  FaHeart,
} from "react-icons/fa";
import { MdRealEstateAgent, MdDashboard } from "react-icons/md";
import { BiSupport } from "react-icons/bi";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-brand-gradient text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--accent-gold)] rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-[var(--accent-orange)] rounded-full animate-pulse-custom"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-[var(--accent-warm)] rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 stagger-animation">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 animate-bounceIn">
              <FaHome className="text-[var(--accent-gold)] text-4xl animate-float" />
              <h2 className="text-3xl font-bold text-shimmer">homeaurarealtor</h2>
            </div>
            <p className="text-white/80 text-lg leading-relaxed">
              Your trusted partner in finding the perfect property. We make property
              hunting and selling an enjoyable experience with professional service.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="glass-card p-3 rounded-xl hover:bg-[var(--accent-gold)] transition-all duration-300 hover:scale-110 hover-glow group"
              >
                <FaFacebookF className="w-6 h-6 group-hover:animate-pulse-custom" />
              </a>
              <a
                href="#"
                className="glass-card p-3 rounded-xl hover:bg-[var(--accent-gold)] transition-all duration-300 hover:scale-110 hover-glow group"
              >
                <FaTwitter className="w-6 h-6 group-hover:animate-pulse-custom" />
              </a>
              <a
                href="#"
                className="glass-card p-3 rounded-xl hover:bg-[var(--accent-gold)] transition-all duration-300 hover:scale-110 hover-glow group"
              >
                <FaInstagram className="w-6 h-6 group-hover:animate-pulse-custom" />
              </a>
              <a
                href="#"
                className="glass-card p-3 rounded-xl hover:bg-[var(--accent-gold)] transition-all duration-300 hover:scale-110 hover-glow group"
              >
                <FaLinkedinIn className="w-6 h-6 group-hover:animate-pulse-custom" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 animate-slideInLeft">
              <FaSearch className="text-[var(--accent-gold)] animate-pulse-custom" />
              Quick Links
            </h3>
            <ul className="space-y-5">
              <li>
                <Link
                  href="/properties"
                  className="text-white/80 hover:text-[var(--accent-gold)] flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 group"
                >
                  <FaBuilding className="w-5 h-5 group-hover:animate-bounceIn" />
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/properties/add"
                  className="text-white/80 hover:text-[var(--accent-gold)] flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 group"
                >
                  <MdRealEstateAgent className="w-5 h-5 group-hover:animate-bounceIn" />
                  List Your Property
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-white/80 hover:text-[var(--accent-gold)] flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 group"
                >
                  <MdDashboard className="w-5 h-5 group-hover:animate-bounceIn" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/saved"
                  className="text-white/80 hover:text-[var(--accent-gold)] flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 group"
                >
                  <FaHeart className="w-5 h-5 group-hover:animate-bounceIn" />
                  Saved Properties
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 animate-slideInRight">
              <BiSupport className="text-[var(--accent-gold)] animate-pulse-custom" />
              Contact Info
            </h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4 text-white/80 p-3 glass-card rounded-xl hover:scale-105 transition-all duration-300">
                <FaMapMarkerAlt className="text-[var(--accent-gold)] w-6 h-6 flex-shrink-0 animate-pulse-custom" />
                <span className="font-medium">homeaurarealtor Office, India</span>
              </li>
              <li className="flex items-center gap-4 text-white/80 p-3 glass-card rounded-xl hover:scale-105 transition-all duration-300">
                <FaPhone className="text-[var(--accent-gold)] w-6 h-6 flex-shrink-0 animate-pulse-custom" />
                <span className="font-medium">Contact: Available on Request</span>
              </li>
              <li className="flex items-center gap-4 text-white/80 p-3 glass-card rounded-xl hover:scale-105 transition-all duration-300">
                <FaEnvelope className="text-[var(--accent-gold)] w-6 h-6 flex-shrink-0 animate-pulse-custom" />
                <span className="font-medium">info@homeaurarealtor.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 animate-fadeInUp">
              <FaEnvelope className="text-[var(--accent-gold)] animate-pulse-custom" />
              Newsletter
            </h3>
            <p className="text-white/80 mb-6 text-lg leading-relaxed">
              Subscribe to our newsletter for the latest property updates and exclusive deals.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full px-5 py-4 rounded-xl glass-card border border-white/20 focus:border-[var(--accent-gold)] focus-homeaura placeholder-white/60 text-white font-medium transition-all duration-300"
              />
              <button
                type="submit"
                className="w-full btn-homeaura-primary hover-glow text-lg font-bold py-4"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/20 bg-[var(--primary-deep)]/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/90 text-center md:text-left text-lg font-medium animate-fadeInUp">
              {new Date().getFullYear()} <span className="text-shimmer font-bold">homeaurarealtor</span>. All rights reserved. Developed by <span className="text-[var(--accent-gold)] font-semibold">Sujay Kumar N</span>
            </p>
            <div className="flex items-center gap-8 animate-fadeInUp">
              <Link
                href="/privacy-policy"
                className="text-white/80 hover:text-[var(--accent-gold)] font-medium transition-all duration-300 hover:scale-110"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-white/80 hover:text-[var(--accent-gold)] font-medium transition-all duration-300 hover:scale-110"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-white/80 hover:text-[var(--accent-gold)] font-medium transition-all duration-300 hover:scale-110"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
