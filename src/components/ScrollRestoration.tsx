"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollRestoration = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Try to restore scroll position from session storage
    const scrollKey = `scroll-pos-${pathname}${search}`;
    const savedPosition = sessionStorage.getItem(scrollKey);
    
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    } else {
      window.scrollTo(0, 0);
    }

    const handleScroll = () => {
      sessionStorage.setItem(scrollKey, window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname, search]);

  return null;
};

export default ScrollRestoration;