import React from 'react';
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';

const quickLinks = [
  { label: 'Browse Vendors', href: '/vendors' },
  { label: 'Join as Vendor', href: '/register' },
  { label: 'How It Works', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Success Stories', href: '#' },
];

const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

const socialLinks = [
  { label: 'Facebook', icon: Facebook },
  { label: 'Twitter', icon: Twitter },
  { label: 'LinkedIn', icon: Linkedin },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-carbon text-mist font-display">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-6 w-6 text-paper" strokeWidth={1.5} />
              <span className="text-lg font-semibold text-paper">
                VendorHub<span className="text-fiverr-green">.</span>
              </span>
            </div>
            <p className="text-smoke mb-6 max-w-md leading-relaxed">
              Connecting event planners with premium vendors to create unforgettable experiences.
              Find the perfect partners for your next event.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-smoke hover:text-paper hover:border-white/30 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-paper uppercase tracking-wide mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-smoke hover:text-paper transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-paper uppercase tracking-wide mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-smoke">
                <Mail className="h-4 w-4 mr-2 text-graphite" strokeWidth={1.5} />
                hello@vendorhub.com
              </li>
              <li className="flex items-center text-smoke">
                <Phone className="h-4 w-4 mr-2 text-graphite" strokeWidth={1.5} />
                (555) 123-4567
              </li>
              <li className="flex items-center text-smoke">
                <MapPin className="h-4 w-4 mr-2 text-graphite" strokeWidth={1.5} />
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-smoke text-sm">
            &copy; {currentYear} VendorHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            {legalLinks.map((label) => (
              <a key={label} href="#" className="text-smoke hover:text-paper text-sm transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
