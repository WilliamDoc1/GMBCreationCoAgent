"use client";

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="p-8 text-center border-t bg-white/50">
      <div className="flex justify-center gap-6 text-xs text-slate-400">
        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        <Link to="/documentation" className="hover:text-primary transition-colors">Documentation</Link>
      </div>
      <p className="mt-4 text-[10px] text-slate-300 uppercase tracking-widest font-medium">
        &copy; {new Date().getFullYear()} GMB Creation Co. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;