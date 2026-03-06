"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="p-12 text-center border-t bg-white/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8 text-sm text-slate-500">
          <Link to="/privacy" className="hover:text-primary transition-colors font-medium">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-primary transition-colors font-medium">Terms of Service</Link>
          <Link to="/documentation" className="hover:text-primary transition-colors font-medium">Documentation</Link>
          <a href="mailto:william@gmbcreationco.com" className="flex items-center gap-2 hover:text-primary transition-colors font-medium">
            <Mail size={16} />
            Support: william@gmbcreationco.com
          </a>
        </div>
        
        <div className="pt-8 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} GMB Creation Co. All rights reserved.
          </p>
          <p className="mt-2 text-[9px] text-slate-300 max-w-md mx-auto leading-relaxed">
            GMB Creation Co is an independent automation platform. Google Business Profile and Gmail are trademarks of Google LLC. Our use of Google API data adheres to the Google API Services User Data Policy.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;