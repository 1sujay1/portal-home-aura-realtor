"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PropertyCard from "@/components/PropertyCard";
import { FaSearch, FaHome, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { MdRealEstateAgent, MdLocationCity } from "react-icons/md";
import { BiBuildingHouse } from "react-icons/bi";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(
          "/api/properties?limit=6&sortBy=createdAt&order=desc"
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setProperties(data.properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setButtonLoading('search');
      router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleNavigation = (path, buttonId) => {
    setButtonLoading(buttonId);
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--neutral-light)] to-white">
      {/* Hero Section with Search */}
      <div
        className="relative h-[800px] bg-cover bg-center parallax-bg overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-hero-gradient opacity-90"></div>
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-[var(--accent-gold)]/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-[var(--accent-orange)]/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-[var(--accent-warm)]/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-6xl md:text-8xl text-white font-bold text-center mb-8 animate-fadeInUp text-shimmer">
            Discover Your Perfect Home
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 text-center mb-16 max-w-4xl animate-fadeInUp font-medium" style={{animationDelay: '0.3s'}}>
            Your journey to finding the ideal property starts with <span className="text-[var(--accent-gold)] font-bold">homeaurarealtor</span>
          </p>
          <form onSubmit={handleSearch} className="w-full max-w-5xl mb-12 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 h-7 w-7 text-[var(--accent-gold)] animate-pulse-custom" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter location, property type, or keywords..."
                  className="w-full pl-16 pr-6 py-7 rounded-2xl text-xl glass-card border border-white/30 focus:border-[var(--accent-gold)] focus-homeaura placeholder-white/70 text-white font-medium shadow-2xl backdrop-blur-lg transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className={`w-full md:w-auto btn-homeaura-primary px-12 py-7 text-xl font-bold hover-glow hover:scale-105 shadow-2xl flex items-center justify-center gap-3 instant-feedback ${buttonLoading === 'search' ? 'btn-loading' : ''}`}
                disabled={buttonLoading === 'search'}
              >
                <FaSearch className="h-6 w-6 animate-pulse-custom" />
                Search Now
              </button>
            </div>
          </form>

          {/* List Property CTA */}
          <button
            onClick={() => handleNavigation("/properties/add", 'list-property-hero')}
            className={`btn-homeaura-secondary px-10 py-5 text-xl font-bold hover:scale-110 shadow-2xl flex items-center gap-3 animate-bounceIn instant-feedback ${buttonLoading === 'list-property-hero' ? 'btn-loading' : ''}`} style={{animationDelay: '0.9s'}}
            disabled={buttonLoading === 'list-property-hero'}
          >
            <FaPlus className="h-6 w-6 text-[var(--accent-gold)] animate-pulse-custom" />
            List Your Property
          </button>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-brand-gradient py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, var(--accent-gold) 2px, transparent 2px)', backgroundSize: '50px 50px'}}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-animation">
            <button
              onClick={() => handleNavigation("/properties?type=sale", 'properties-sale')}
              className={`glass-card p-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 group hover:scale-105 hover-glow card-hover-lift instant-feedback ${buttonLoading === 'properties-sale' ? 'opacity-75' : ''}`}
              disabled={buttonLoading === 'properties-sale'}
            >
              <BiBuildingHouse className="h-12 w-12 text-[var(--accent-gold)] group-hover:scale-125 group-hover:animate-bounceIn transition-all duration-300" />
              <div className="text-left">
                <div className="font-bold text-xl text-white mb-2">Properties for Sale</div>
                <div className="text-base text-white/80">
                  Find your dream home today
                </div>
              </div>
            </button>
            <button
              onClick={() => handleNavigation("/properties?type=rent", 'properties-rent')}
              className={`glass-card p-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 group hover:scale-105 hover-glow card-hover-lift instant-feedback ${buttonLoading === 'properties-rent' ? 'opacity-75' : ''}`}
              disabled={buttonLoading === 'properties-rent'}
            >
              <FaHome className="h-12 w-12 text-[var(--accent-gold)] group-hover:scale-125 group-hover:animate-bounceIn transition-all duration-300" />
              <div className="text-left">
                <div className="font-bold text-xl text-white mb-2">Properties for Rent</div>
                <div className="text-base text-white/80">Explore rental options</div>
              </div>
            </button>
            <button
              onClick={() => handleNavigation("/properties/add", 'list-property-quick')}
              className={`glass-card p-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-4 group hover:scale-105 hover-glow card-hover-lift instant-feedback ${buttonLoading === 'list-property-quick' ? 'opacity-75' : ''}`}
              disabled={buttonLoading === 'list-property-quick'}
            >
              <FaPlus className="h-12 w-12 text-[var(--accent-gold)] group-hover:scale-125 group-hover:animate-bounceIn transition-all duration-300" />
              <div className="text-left">
                <h3 className="font-bold text-xl text-white mb-2">List Your Property</h3>
                <p className="text-base text-white/80">Reach thousands of buyers</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-br from-[var(--primary-deep)] via-[var(--primary-main)] to-[var(--primary-light)] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[var(--accent-gold)] rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[var(--accent-orange)] rounded-full animate-pulse-custom"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-white mb-20 animate-fadeInDown text-shimmer">
            Why Choose homeaurarealtor
          </h2>
          <div className="grid md:grid-cols-3 gap-10 stagger-animation">
            {[
              {
                icon: <MdRealEstateAgent className="w-16 h-16" />,
                title: "Expert Agents",
                desc: "Professional guidance through every step of your property journey",
              },
              {
                icon: <FaMapMarkerAlt className="w-16 h-16" />,
                title: "Prime Locations",
                desc: "Properties in the most sought-after areas across India",
              },
              {
                icon: <FaHome className="w-16 h-16" />,
                title: "Quality Homes",
                desc: "Carefully curated premium properties for every budget",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-card p-10 rounded-2xl text-center card-hover-lift group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="text-[var(--accent-gold)] mb-6 flex justify-center animate-bounceIn" style={{animationDelay: `${index * 0.2}s`}}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[var(--accent-gold)] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/80 mb-8 text-lg leading-relaxed">{feature.desc}</p>
                <button
                  onClick={() => handleNavigation("/about-us", `about-${index}`)}
                  className={`btn-homeaura-secondary hover:scale-110 transition-all duration-300 instant-feedback ${buttonLoading === `about-${index}` ? 'btn-loading' : ''}`}
                  disabled={buttonLoading === `about-${index}`}
                >
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="py-24 px-4 bg-gradient-to-br from-white to-[var(--neutral-light)] relative">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-[var(--accent-gold)]/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 bg-[var(--accent-orange)]/10 rounded-full animate-pulse-custom"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center lg:text-left animate-slideInLeft">
              <h2 className="text-5xl md:text-6xl font-bold text-[var(--primary-deep)] mb-4">
                Featured Properties
              </h2>
              <p className="text-[var(--neutral-dark)] text-xl font-medium">
                Handpicked premium properties just for you
              </p>
            </div>
            <button
              onClick={() => handleNavigation("/properties", 'view-all-properties')}
              className={`btn-homeaura-primary px-8 py-4 text-lg font-bold hover-glow hover:scale-105 flex items-center gap-3 shadow-xl animate-slideInRight instant-feedback ${buttonLoading === 'view-all-properties' ? 'btn-loading' : ''}`}
              disabled={buttonLoading === 'view-all-properties'}
            >
              <MdLocationCity className="w-6 h-6 animate-pulse-custom" />
              View All Properties
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="relative mx-auto w-12 h-12">
                <div className="animate-spin rounded-full h-12 w-12 border-3 border-[var(--accent-gold)]/30 border-t-[var(--accent-gold)]"></div>
              </div>
              <p className="text-[var(--primary-main)] mt-3 font-medium">Loading properties<span className="loading-dots"></span></p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <div key={property._id} className="opacity-0 animate-fadeInUp" style={{animationDelay: `${index * 0.05}s`}}>
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-brand-gradient py-24 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--accent-gold)] rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-[var(--accent-orange)] rounded-full animate-pulse-custom"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 animate-fadeInUp text-shimmer">
            Ready to List Your Property?
          </h2>
          <p className="text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            Join our network of property owners and reach thousands of potential
            buyers and renters with <span className="text-[var(--accent-gold)] font-bold">homeaurarealtor</span>
          </p>
          <button
            onClick={() => handleNavigation("/properties/add", 'list-property-cta')}
            className={`btn-homeaura-primary px-12 py-6 text-2xl font-bold hover-glow hover:scale-110 flex items-center gap-4 mx-auto shadow-2xl animate-bounceIn instant-feedback ${buttonLoading === 'list-property-cta' ? 'btn-loading' : ''}`} style={{animationDelay: '0.6s'}}
            disabled={buttonLoading === 'list-property-cta'}
          >
            <FaPlus className="w-7 h-7 animate-pulse-custom" />
            List Your Property Now
          </button>
        </div>
      </div>
    </div>
  );
}
