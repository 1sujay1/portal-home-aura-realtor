"use client";

import { FaHome, FaHandshake, FaUsers, FaAward, FaChartLine } from "react-icons/fa";
import { MdSecurity, MdSupport, MdLocationCity } from "react-icons/md";
import { BiHappyBeaming } from "react-icons/bi";

export default function AboutUs() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-brand-gradient text-white py-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[var(--accent-gold)] rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-[var(--accent-orange)] rounded-full animate-pulse-custom"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-[var(--accent-warm)] rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 animate-fadeInUp text-shimmer">
              homeaurarealtor - Your Trusted Real Estate Partner
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-12 animate-fadeInUp font-medium" style={{animationDelay: '0.3s'}}>
              We're dedicated to making your property journey seamless and successful
            </p>
            <div className="flex flex-wrap justify-center gap-6 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <div className="glass-card p-6 text-center hover:scale-110 transition-all duration-300 hover-glow">
                <div className="text-4xl font-bold text-[var(--accent-gold)] animate-pulse-custom">10+</div>
                <div className="text-lg text-white/90 font-medium">Years Experience</div>
              </div>
              <div className="glass-card p-6 text-center hover:scale-110 transition-all duration-300 hover-glow">
                <div className="text-4xl font-bold text-[var(--accent-gold)] animate-pulse-custom">1000+</div>
                <div className="text-lg text-white/90 font-medium">Properties Listed</div>
              </div>
              <div className="glass-card p-6 text-center hover:scale-110 transition-all duration-300 hover-glow">
                <div className="text-4xl font-bold text-[var(--accent-gold)] animate-pulse-custom">500+</div>
                <div className="text-lg text-white/90 font-medium">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-gradient-to-br from-white to-[var(--neutral-light)] relative">
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-[var(--accent-gold)]/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-[var(--accent-orange)]/10 rounded-full animate-pulse-custom"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--primary-deep)] mb-8 animate-fadeInDown">
              Our Mission
            </h2>
            <p className="text-[var(--neutral-dark)] text-xl md:text-2xl leading-relaxed animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <span className="text-[var(--accent-gold)] font-bold">homeaurarealtor</span> provides exceptional real estate services by combining innovative technology
              with personalized customer care, ensuring every client finds their perfect property.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 stagger-animation">
            {[
              {
                icon: <FaHandshake className="w-12 h-12" />,
                title: "Trust & Reliability",
                description: "Building lasting relationships through transparency and integrity"
              },
              {
                icon: <MdSecurity className="w-12 h-12" />,
                title: "Secure Transactions",
                description: "Ensuring safe and secure property transactions"
              },
              {
                icon: <BiHappyBeaming className="w-12 h-12" />,
                title: "Client Satisfaction",
                description: "Putting our clients' needs first, always"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl card-hover-lift group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                <div className="text-[var(--accent-gold)] mb-6 animate-bounceIn" style={{animationDelay: `${index * 0.2}s`}}>{item.icon}</div>
                <h3 className="text-2xl font-bold text-[var(--primary-deep)] mb-4 group-hover:text-[var(--accent-gold)] transition-colors duration-300">{item.title}</h3>
                <p className="text-[var(--neutral-dark)] text-lg leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-24 bg-brand-gradient text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, var(--accent-gold) 2px, transparent 2px)', backgroundSize: '60px 60px'}}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 animate-fadeInDown text-shimmer">
            Why Choose homeaurarealtor
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-animation">
            {[
              {
                icon: <FaAward />,
                title: "Expert Team",
                description: "Professional and experienced real estate agents"
              },
              {
                icon: <MdLocationCity />,
                title: "Prime Locations",
                description: "Access to the best properties in prime locations"
              },
              {
                icon: <FaChartLine />,
                title: "Market Analysis",
                description: "Detailed market insights and property valuations"
              },
              {
                icon: <MdSupport />,
                title: "24/7 Support",
                description: "Round-the-clock assistance for all your queries"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 glass-card rounded-2xl card-hover-lift group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="text-[var(--accent-gold)] text-4xl mb-6 flex justify-center animate-bounceIn" style={{animationDelay: `${index * 0.1}s`}}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[var(--accent-gold)] transition-colors duration-300">{feature.title}</h3>
                <p className="text-white/80 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-gradient-to-br from-[var(--neutral-light)] to-white relative">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-[var(--accent-gold)]/10 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-[var(--accent-orange)]/10 rounded-full animate-pulse-custom"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--primary-deep)] text-center mb-20 animate-fadeInDown">
            Meet Our Team
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sujay Kumar N",
                role: "Founder & Developer",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a"
              },
              {
                name: "Real Estate Team",
                role: "Property Consultants",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
              },
              {
                name: "Market Experts",
                role: "Market Analysis Team",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden card-hover-lift group animate-fadeInUp" style={{animationDelay: `${index * 0.2}s`}}>
                <div className="h-72 relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-accent-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-[var(--primary-deep)] mb-2 group-hover:text-[var(--accent-gold)] transition-colors duration-300">{member.name}</h3>
                  <p className="text-[var(--neutral-dark)] text-lg font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-gradient text-white py-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[var(--accent-gold)] rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[var(--accent-orange)] rounded-full animate-pulse-custom"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 animate-fadeInUp text-shimmer">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            Let us help you discover the perfect property that matches your needs and preferences with <span className="text-[var(--accent-gold)] font-bold">homeaurarealtor</span>.
          </p>
          <button
            onClick={() => window.location.href = '/properties'}
            className="btn-homeaura-primary px-10 py-5 text-xl font-bold hover-glow hover:scale-110 flex items-center gap-3 mx-auto shadow-2xl animate-bounceIn" style={{animationDelay: '0.6s'}}
          >
            <FaHome className="w-6 h-6 animate-pulse-custom" />
            Browse Properties
          </button>
        </div>
      </div>
    </div>
  );
}
